import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { DocumentoPedidoService } from "../../../services/comum/documento-pedido.service";
import { DocumentoTipoProcesso } from "../../../models/dto/documento-tipo-processo";
import { Pedido } from "../../../models/comum/pedido";
import { SituacaoPedido } from "../../../models/comum/situacao-pedido";
import { AscModalMensagemPedidoComponent } from "../../../playground/asc-modal-mensagem-pedido/asc-modal-mensagem-pedido.component";
import { MensagemPedidoService } from "../../../services/comum/mensagem-enviada.service";
import { Util } from "../../../../arquitetura/shared/util/util";
import { ActivatedRoute } from "@angular/router";
import { PermissoesSituacaoProcesso } from "../../../models/fluxo/permissoes-situacao-processo";
import { AscModalVisualizarDocumentoComponent } from "../../asc-pedido/asc-documentos/modal-visualizar-documento/asc-modal-visualizar-documento.component";
import { Arquivo } from "app/shared/models/dto/arquivo";
import { MatDialogRef } from "@angular/material/dialog";
import { DscDialogService } from "sidsc-components/dsc-dialog";

interface ArquivoModal {
  arquivos: Arquivo[];
  arquivo: Arquivo;
  modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
  event: any;
}

@Component({
  selector: "asc-detalhe-situacao",
  templateUrl: "./asc-detalhe-situacao.component.html",
  styleUrls: ["./asc-detalhe-situacao.component.scss"],
})
export class AscDetalheSituacaoComponent {
  @Input()
  processoPedido: Pedido;

  private readonly arquivo$ = new EventEmitter<ArquivoModal>();

  private _show: boolean = false;
  EM_PROCESSAMENTO_SIST_SAUDE:number = 38;
  hasArquivosProcessados:boolean = false;

  @Input()
  situacaoPedido: SituacaoPedido;

  private classe: string = "mdl-custom";

  @Input()
  permissoes: PermissoesSituacaoProcesso;

  modalDetalhe?: MatDialogRef<any>;

  @Input()
  set show(show: boolean) {
    this._show = show;
    if( this._show )
      this.abrirModal()

    //this.verificarArquivoProcessado(); <COMENTADO ESPERANDO BACKEND>

    if (
      this.processoPedido &&
      this.processoPedido.id &&
      this.situacaoPedido &&
      this.situacaoPedido.countAnexos &&
      !this.documentos
    ) {
      this.documentoPedidoService
      .consultarDocumentosPorPedidoAndSituacao(
        this.processoPedido.id,
        this.situacaoPedido.id
      )
      .subscribe((anexos) => {
        this.documentos = [];

        if (anexos && anexos.length > 0) {
          this.documentos = anexos.map((a) => ({
            arquivos: [
              {
                id: a.id,
                name: a.nome,
                idDocTipoProcesso: a.idTipoDocumento,
                idDocumentoGED: a.idDocumentoGED,
                data: a.dataHoraCadastramento,
              },
            ],
          }));
        } else {
          this.documentos = [];
        }
      });
    }
  }

  @Output()
  hide = new EventEmitter<boolean>();

  @ViewChild('templateForm', { static: true }) private templateForm!: TemplateRef<any>;

  documentos: DocumentoTipoProcesso[];

  get show(): boolean {
    return this._show;
  }

  constructor(
    private readonly documentoPedidoService: DocumentoPedidoService,
    private readonly mensagemPedidoService: MensagemPedidoService,
    private readonly activatedRoute: ActivatedRoute,
    private _dialogService: DscDialogService
  ) {}

  getNomeUsuario = Util.getNomeUsuario;



  clickVerMensagem(
    event: any,
    modalMensagemPedido: AscModalMensagemPedidoComponent
  ) {
    this.mensagemPedidoService
    .consultarPorIdSituacaoPedido(this.situacaoPedido.id)
    .subscribe((next) => {
      modalMensagemPedido.infoExibicao = {
        itens: next,
        index: 0,
        item: next[0],
        msgItemVazio: "Não existem mensagens.",
      };
    });
  }

  fecharModal(): void {
    this.modalDetalhe?.close();
    this.show = false;
    this.hide.emit(true);
  }

  get tituloAcompanhamento(): boolean {
    let urlAtiva = this.activatedRoute.snapshot["_routerState"].url;
    return urlAtiva.includes("acompanhamento");
  }

  classeAnexo(): string {
    if (this.documentos) {
      this.classe = "mdl-custom mdl-custom-lista-anexos";
    }

    return this.classe;
  }

  public verificarArquivoProcessado():void{
    //[INI]
    // if(this.situacaoPedido && this.situacaoPedido.idSituacaoProcesso){
    //   console.log( "TESTE DETALHE SITUACAO= "+ (this.situacaoPedido.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE));

    //   if(this.documentos && this.documentos.length){
    //     console.log("this.documentos.length = "+ this.documentos.length);
    //   }

    //   if(this.situacaoPedido.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){
    //     console.log( this.situacaoPedido.idSituacaoProcesso + " === "+this.EM_PROCESSAMENTO_SIST_SAUDE );
    //   }

    // }

    if(localStorage.getItem('arquivoEnvioDado')){
      console.log("RECUPERANDO arquivoEnvioDado ------------- ");
      console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
    }

    if(this.situacaoPedido && this.situacaoPedido.idSituacaoProcesso && this.situacaoPedido.idSituacaoProcesso === this.EM_PROCESSAMENTO_SIST_SAUDE){
      if(localStorage.getItem('arquivoEnvioDado')){
        this.hasArquivosProcessados = true;
        console.log( JSON.parse(localStorage.getItem('arquivoEnvioDado')) ) ;
        let arquivoEnvioDado = JSON.parse(localStorage.getItem('arquivoEnvioDado'));
        console.log(this.documentos);
        if(this.documentos===null || this.documentos === undefined){
          this.documentos = [];

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
    //[FIM]
  }

  public abrirModalVisualizarDocumentos(
    event: any,
    arquivo: Arquivo,
    modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent,
    arquivos: Arquivo[]
  ): void {
    const arquivoModal = {
      event,
      arquivo,
      arquivos,
      modalVisualizarDocumentoComponent,
    };
    if (arquivo && arquivo.id) {
      this.arquivo$.emit(arquivoModal);
    } else {
      this.actionToOpenModel(arquivoModal);
    }
  }

  private actionToOpenModel(arquivoModal: ArquivoModal): void {
    const {
      arquivos,
      arquivo,
      modalVisualizarDocumentoComponent: component,
    } = arquivoModal;

    const index = Array.from(arquivos).findIndex((file) => arquivo === file);
    component.infoExibicao = {
      itens: Array.from(arquivos),
      index,
      item: arquivo,
    };
  }

  abrirModal(): void {
    this.modalDetalhe = this._dialogService.confirm({
      data: {
        title: {
          text: 'Detalhe da ocorrência',
          highlightVariant: true,
          showCloseButton: true
        },
        template: this.templateForm,
      }
    })

    this.modalDetalhe.afterClosed().subscribe(() => {
      this.fecharModal();
    });
  }

  }
