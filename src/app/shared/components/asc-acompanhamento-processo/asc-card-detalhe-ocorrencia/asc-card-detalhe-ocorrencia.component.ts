import { AfterContentInit, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { DetalheOcorrenciaModel } from "../models/detalhe-ocorrencia.model";
import { Pedido } from "../../../models/comum/pedido";
import { AscModalMensagemPedidoComponent } from "../../../playground/asc-modal-mensagem-pedido/asc-modal-mensagem-pedido.component";
import { MensagemPedidoService } from "../../../services/comum/mensagem-enviada.service";
import { AscModalOcorrenciaComponent } from "../../asc-pedido/asc-modal-ocorrencia/asc-modal-ocorrencia.component";
import { AscComponenteAutorizado } from "../../asc-pedido/asc-componente-autorizado";
import { MessageService } from 'app/shared/components/messages/message.service';
import { SituacaoPedidoService } from "app/shared/services/comum/situacao-pedido.service";
import { SituacaoPedido } from 'app/shared/models/comum/situacao-pedido';
import { take } from "rxjs/operators";
import { StatusProcessoEnum } from "../../../enums/status-processo.enum";
import { HistoricoProcessoService } from "../../../services/comum/historico-processo.service";
import { DocumentoPedidoService } from "../../../services/comum/documento-pedido.service";
import { DocumentoTipoProcesso } from "../../../models/dto/documento-tipo-processo";
import { AnexoDTO } from "../../../models/dto/anexo";
import { SIASCFluxoService } from "../../../services/comum/siasc-fluxo.service";
import { PermissoesSituacaoProcesso } from "../../../models/fluxo/permissoes-situacao-processo";
import { Util } from "../../../../arquitetura/shared/util/util";
import { ActivatedRoute } from "@angular/router";
import { DocumentoPedidoDTO } from 'app/shared/models/dto/documento-pedido';
import { ProcessoService } from "app/shared/services/comum/processo.service";
import { Subscription } from 'rxjs';
import { DscDialogService } from 'sidsc-components/dsc-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'asc-card-detalhe-ocorrencia',
  templateUrl: './asc-card-detalhe-ocorrencia.component.html',
  styleUrls: ['./asc-card-detalhe-ocorrencia.component.scss']
})
export class AscCardDetalheOcorrenciaComponent extends AscComponenteAutorizado implements AfterContentInit {

  @Input()
  detalheOcorrencia: DetalheOcorrenciaModel = {
    situacao: 'Histórico não informado',
    dateSituacao: new Date()
  }

  @Output()
  atualizarOcorrencia = new EventEmitter<SituacaoPedido>();

  showDetalhe = false;

  private _temMensagens = false;

  isLoading: boolean = false;

  stylePropsModal: any = {
    closeBottomLeft: true,
  }

  private readonly idPedidoEvent = new EventEmitter<number>();
  private _processoPedido: Pedido;
  ultimaSituacao: SituacaoPedido;
  documentos: DocumentoTipoProcesso[];

  private _documentoLista: any = {SIM: [], NAO: []};
  mostrarBordaDocumentosObrigatorios: boolean;
  mostrarBordaDocumentosComplementares: boolean;
  get documentoLista(): any {
    return this._documentoLista;
  }
  set documentoLista(value: any) {
    this._documentoLista = value;
  }

  private _sit: any;
  get sit(): any {
    return this._sit;
  }
  set sit(value: any){
    this._sit = value;
  }

  mostraOuOcultaBotao: boolean = false;

  private subscriptions: Subscription[] = [];

  EM_PROCESSAMENTO_SIST_SAUDE:number = 38;

  dialogRef2?: MatDialogRef<any>;
  @ViewChild('templateForm', { static: true }) private templateForm!: TemplateRef<any>;

  form = new FormGroup({
    cpf: new FormControl('', [Validators.required]),
    nome: new FormControl('', [Validators.required, Validators.minLength(5)]),
    tipoOcorrencia: new FormControl()
  })

  return: any;

  constructor(
    private readonly fluxoService: SIASCFluxoService,
    private readonly service: MensagemPedidoService,
    private readonly situacaoPedidoService: SituacaoPedidoService,
    private readonly historicoProcessoService: HistoricoProcessoService,
    protected readonly messageService: MessageService,
    private readonly documentoPedidoService: DocumentoPedidoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly processoService: ProcessoService,
    private _dialogService: DscDialogService
  ) {
    super();
  }

  ngOnInit() {
    this.ouvindoMudanca()

    this.subscriptions.push(
      this.documentoPedidoService.avisoSituacaoPedido.subscribe((bordaObrigatoria) => {
        this.mostrarBordaDocumentosObrigatorios = bordaObrigatoria;
        this.atualizarEstadoBotaoLiberarPedido(); // Atualiza o botão
      })
    );

    this.subscriptions.push(
      this.documentoPedidoService.avisoSituacaoPedidoComplementares.subscribe((bordaComplementar) => {
        this.mostrarBordaDocumentosComplementares = bordaComplementar;
        this.atualizarEstadoBotaoLiberarPedido(); // Atualiza o botão
      })
    );

    //[INI]
    if(this.ultimaSituacao && this.ultimaSituacao.idSituacaoProcesso){
      console.log( "TESTE DETALHE OCORRENCIA = "+ ( this.ultimaSituacao.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE));
      if(this.documentos && this.documentos.length){
        console.log( this.documentos.length);
      }

      console.log( this.ultimaSituacao.idSituacaoProcesso + " === "+this.EM_PROCESSAMENTO_SIST_SAUDE );

    }

    if(localStorage.getItem('arquivoEnvioDado')){
      console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
    }

    if(this.ultimaSituacao && this.ultimaSituacao.idSituacaoProcesso && this.ultimaSituacao.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){
      if(localStorage.getItem('arquivoEnvioDado')){
        console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
        let arquivoEnvioDado = JSON.parse(localStorage.getItem('arquivoEnvioDado'));
        console.log(this.documentos);
        if(this.documentos===null || this.documentos === undefined){
          this.documentos = [];
        }
        this.documentos.push({
          arquivos: [{
            id: arquivoEnvioDado.id,
            name: arquivoEnvioDado.nome,
            idDocTipoProcesso: null,
            idDocumentoGED: null,
            data: arquivoEnvioDado.dataGeracao,
          }]
        });
      }

    }
    //[FIM]
  }

  atualizarEstadoBotaoLiberarPedido() {
    const situacaoValida = (
      this.ultimaSituacao && (
        this.ultimaSituacao.idSituacaoProcesso === StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR
      )
    );

    // O botão será exibido apenas se ambas as bordas forem verdes e a situação for válida
    this.mostraOuOcultaBotao = situacaoValida &&
    this.mostrarBordaDocumentosObrigatorios !== false &&
    this.mostrarBordaDocumentosComplementares !== false;
  }

  override ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ouvindoMudanca() {
    this.documentoPedidoService
      .avisoParaBotao
      .subscribe((tipo: string) => {
        if (tipo == 'doc') {
          const docs: any = this.documentoPedidoService.getDocumentos();
          if(docs.length > 0){
            const anexos = docs.map(d => {
              const anexoMaisRecente = d.anexos.length > 0
                                       ? d.anexos
                                          .map(a => ({
                                            dataHoraCadastramento: a.dataHoraCadastramento,
                                            valido: a.valido,
                                          }))
                                          .reduce((maisRecente, atual) => {
                                            return new Date(atual.dataHoraCadastramento) > new Date(maisRecente.dataHoraCadastramento) ? atual : maisRecente;
                                          })
                                          :  {dataHoraCadastramento: null,valido: null}

              return {
                ...anexoMaisRecente,
                complementar: d.complementar
              };
            });

            this.documentoLista = {
               ...this.documentoLista,
               [docs[0].complementar]: anexos
            }
            //console.log('ouvindoMudanca documentoLista',this.documentoLista);

          }
        }else {
          const penultimaSituacao = this.documentoPedidoService.getSituacaoPedido();
          this.sit = penultimaSituacao;
        }

        setTimeout(() => {
          this.deveMostrarBotaoLiberarPedido();
        }, 1000);

      });
  }

  @Input()
  set pedidoId(pedidoId: number) {
    this.idPedidoEvent.emit(pedidoId)
  }

  @Input()
  set processoPedido(processoPedido: Pedido) {
    this._processoPedido = processoPedido;
    this.verificarSePossuiMensagemNoPedido(processoPedido);
    if (processoPedido && processoPedido.id) {
      this.fluxoService.consultarPermissoesFluxoPorPedido(processoPedido.id).pipe(
        take<PermissoesSituacaoProcesso>(1)
      ).subscribe(permissao => {
        this.historicoProcessoService.consultarUltimaMudanca(processoPedido.id, !permissao.analisar).pipe(
          take<SituacaoPedido>(1)
        ).subscribe(situacao => {

          this.ultimaSituacao = situacao;
          this.verificarDocumentosEIncluirNaList();

          this.verificarArquivoProcessadoEInlcluirNaLista();

        });
      });
    }
  }

  verificarDocumentosEIncluirNaList():void{
    if (this.ultimaSituacao && this.ultimaSituacao.countAnexos) {
      this.documentoPedidoService.consultarDocumentosPorPedidoAndSituacao(this.processoPedido.id, this.ultimaSituacao.id).pipe(
        take<AnexoDTO[]>(1)
      ).subscribe(anexos => {
        this.documentos = [];

        if (anexos && anexos.length > 0) {
          this.documentos.push({
            arquivos: [{
              id: anexos[0].id,
              name: anexos[0].nome,
              idDocTipoProcesso: anexos[0].idTipoDocumento,
              idDocumentoGED: anexos[0].idDocumentoGED,
              data: anexos[0].dataHoraCadastramento
            }]
          });
        }
      });
    } else {
      this.documentos = [];
    }
  }

  verificarArquivoProcessadoEInlcluirNaLista():void{
    if( this.ultimaSituacao.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){
      if(localStorage.getItem('arquivoEnvioDado')){
        console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
        let arquivoEnvioDado = JSON.parse(localStorage.getItem('arquivoEnvioDado'));

        this.documentos.push({
          arquivos: [{
            id: arquivoEnvioDado.id,
            name: arquivoEnvioDado.nome,
            idDocTipoProcesso: null,
            idDocumentoGED: null,
            data: arquivoEnvioDado.dataGeracao,
          }]
        });
      }

    }
  }

  getNomeUsuario = Util.getNomeUsuario;

  clickShowDetalhe(): void {
    this.showDetalhe = true;
  }

  clickCloseDetalhe(): void {
    this.showDetalhe = false;
  }

  get processoPedido() {
    return this._processoPedido;
  }

  set temMensagens(temMensagens: boolean) {
    this._temMensagens = temMensagens;
  }

  get temMensagens(): boolean {
    return this._temMensagens;
  }

  get isPermiteNovaOcorrencia(): boolean {
    return this.processoPedido && this.processoPedido.ultimaSituacao
      && this.processoPedido.ultimaSituacao.idSituacaoProcesso === StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR;
  }

  ngAfterContentInit(): void {
    this.verificarSePossuiMensagemNoPedido(this.processoPedido);
  }

  atualizarSituacao(situacao: SituacaoPedido) {
    this.ultimaSituacao = situacao;
    this.atualizarOcorrencia.emit(situacao);
  }

  private verificarSePossuiMensagemNoPedido(pedido: Pedido) {
    if (pedido && pedido.ultimaSituacao) {
      this.temMensagens = pedido.ultimaSituacao.countMensagens > 0;
    }
  }

  clickVerMensagem(pedido: Pedido, modalMensagemPedido: AscModalMensagemPedidoComponent) {
    this.pedidoId = pedido.id;
    this.service.consultarPorIdPedido(pedido.id).subscribe(next => {
      modalMensagemPedido.infoExibicao = {
        itens: next,
        index: 0,
        item: next[0],
        msgItemVazio: "Não existem mensagens."
      };
    })
  }

  clickVerMensagemSituacao(pedido: Pedido, idSituacaoPedido: number, modalMensagemPedido: AscModalMensagemPedidoComponent) {
    this.pedidoId = pedido.id;
    this.service.consultarPorIdSituacaoPedido(idSituacaoPedido).subscribe(next => {
      modalMensagemPedido.infoExibicao = {
        itens: next,
        index: 0,
        item: next[0],
        msgItemVazio: "Não existem mensagens."
      };
    });
  }

  clickSolicitacaoRevisao(pedido: Pedido) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;

      const situacaoPedido = {
        idPedido: pedido.id,
        idSituacaoProcesso: 18,
        idTipoOcorrencia: 1,
      } as SituacaoPedido;

      this.situacaoPedidoService.incluirMudancaSituacaoPedido(situacaoPedido).pipe(
        take(1)
      ).subscribe(res => {
        const msgsAviso = res['msgsAviso'];
        this.messageService.showSuccessMsg('MA022');
        if ((msgsAviso) && msgsAviso.length > 0) {
          this.messageService.showWarnMsg(msgsAviso);
        }

        setTimeout(function () {
          location.reload();
        }, 2000);
      }, error => this.messageService.showDangerMsg(error.error));
    }, 5000);
  }

  clickNovaOcorrencia(processoPedido: Pedido, modalOcorrencia: AscModalOcorrenciaComponent): void {
    // const dialogRef2 = this._dialogService.confirm({
    //     data: {
    //       title: {
    //         text: 'Nova ocorrência',
    //         highlightVariant: true
    //       },
    //       template: this.templateForm,
    //       context: this.form,
    //       actionButton: {
    //         type: 'button',
    //         cancelText: 'Cancelar',
    //         confirmText: 'Salvar',
    //         confirmDisabled: this.form.invalid,
    //         confirmFunction: (result: any) => this.return = JSON.stringify(result)
    //       }
    //     }
    //   });
    modalOcorrencia.processo = processoPedido;
    modalOcorrencia.show();
    modalOcorrencia.onUpdate.subscribe(situacaoPedido => {
      this.fluxoService.consultarPermissoesFluxoPorPedido(processoPedido.id).pipe(
        take<PermissoesSituacaoProcesso>(1)
      ).subscribe(permissao => {
        this.historicoProcessoService.consultarUltimaMudanca(processoPedido.id, !permissao.analisar).pipe(
          take<SituacaoPedido>(1)
        ).subscribe(situacao => {
          this.ultimaSituacao = situacao;
        });
      });
    })
  }

  get tituloAcompanhamento(): boolean {
    let urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
    return urlAtiva.includes("acompanhamento");
  }

  deveMostrarBotaoLiberarPedido() {
    const situacaoValida =
      this.ultimaSituacao &&
      this.ultimaSituacao.idSituacaoProcesso === StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR;

    // Verifica os estados dos avisos (null é tratado como válido, false é inválido)
    const estadoObrigatorios = this.documentoPedidoService.getAvisoSituacaoPedidoState();
    const estadoComplementares = this.documentoPedidoService.getAvisoSituacaoPedidoComplementaresState();

    // O botão será exibido apenas se a situação for válida e nenhum dos estados for `false`
    this.mostraOuOcultaBotao = situacaoValida && estadoObrigatorios !== false && estadoComplementares !== false;
  }


  todosDocumentosAnexados() {
    if (!this.sit || !this.sit.dataCadastramento) {
      return false;
    }

    return this.todosDocumentosAnexadosPorTipo(this.documentoLista.NAO) &&
           this.todosDocumentosAnexadosPorTipo(this.documentoLista.SIM);
  }

  todosDocumentosAnexadosPorTipo(tipoDocumento) {
    if (!this.sit || !this.sit.dataCadastramento) {
      return false;
    }

    return this.verificarValidade(tipoDocumento);
  }

  verificarValidade(array: any[]){
    const valida = doc => {
      if (!doc.valido) {
        return new Date(doc.dataHoraCadastramento) > new Date(this.sit.dataCadastramento);
      }
      return doc.dataHoraCadastramento !== null;
    }
    return array.length === 0 || array.every(valida);
  }

  liberarProcessoParaAnalise(idPedido: number): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;

      this.processoService.liberarProcessoParaAnalise(idPedido).subscribe(res => {
        let msg = '';
        if (res.msgsAviso) {
          for (let m of res.msgsAviso) {
            msg = msg.concat(m).concat(' ');
          }
        }
        if (msg == '') {
          this.messageService.showWarnMsg(msg);
        }
        this.messageService.showSuccessMsg('Processo liberado para a análise.');
        this.historicoProcessoService.consultarUltimaSituacao(this.processoPedido.id).subscribe(() => {
          this.atualizarOcorrencia.emit();
          window.location.reload();
        });

      }, error => this.messageService.showDangerMsg(error.error));

    }, 5000);
  }

  get tipoOcorrencia() {
    return this.form.get('tipoOcorrencia')
  }

}
