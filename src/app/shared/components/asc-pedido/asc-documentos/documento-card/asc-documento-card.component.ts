import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DocumentoTipoProcesso } from "../../../../models/dto/documento-tipo-processo";
import { ArrayUtil } from "../../../../util/array-util";
import { ArquivoParam } from "../../../asc-file/models/arquivo.param";
import { MessageService } from "../../../messages/message.service";
import { AscModalVisualizarDocumentoComponent } from "../modal-visualizar-documento/asc-modal-visualizar-documento.component";
import {
  isNotUndefinedNullOrEmpty,
  isUndefinedNullOrEmpty,
  isUndefinedOrNull,
} from "../../../../constantes";
import { DocumentoParam } from "../../models/documento.param";
import { distinctUntilChanged, map, switchMap, take, takeUntil, tap } from "rxjs/operators";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { DocumentoTipoProcessoService } from "../../../../services/comum/documento-tipo-processo.service";
import { Arquivo } from "../../../../models/dto/arquivo";
import { fadeAnimation } from "../../../../animations/faded.animation";
import { AnexoService } from "../../../../services/comum/anexo.service";
import { TipoValidacaoService } from "app/shared/services/comum/tipo-validacao.service";
import { ProcessoService } from "app/shared/services/comum/processo.service";
import { Pedido } from "app/shared/models/comum/pedido";
import { ValidacaoDocumentoPedidoService } from "app/shared/services/comum/validacao-documento-pedido.service";
import { SelectItem } from "primeng/api";
import { TipoValidacaoDTO } from "../../../../models/dto/tipo-validacao";
import { CustomOperatorsRxUtil } from "../../../../util/custom-operators-rx-util";
import { forkJoin, of } from "rxjs";
import { ValidacaoDocumentoPedido } from "../../../../models/comum/validacao-documento-pedido";
import { DocumentoPedidoService } from "app/shared/services/comum/documento-pedido.service";
import { AscComponenteAutorizadoMessage } from "../../asc-componente-autorizado-message";
import { Util } from "../../../../../arquitetura/shared/util/util";
import { SessaoService } from "../../../../../arquitetura/shared/services/seguranca/sessao.service";
import { StatusProcessoEnum } from "../../../../enums/status-processo.enum";
import { PerfilEnum } from "../../../../enums/perfil.enum";
import { ActivatedRoute } from "@angular/router";
import { DocumentoPedidoDTO } from "app/shared/models/dto/documento-pedido";

interface ArquivoModal {
  arquivos: Arquivo[];
  arquivo: Arquivo;
  modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
  event: any;
}

@Component({
  selector: "asc-documento-card",
  templateUrl: "./asc-documento-card.component.html",
  styleUrls: [
    "./asc-documento-card.component.scss",
    "./asc-documento-card-resumo.scss",
  ],
  animations: [...fadeAnimation],
})
export class AscDocumentoCardComponent
  extends AscComponenteAutorizadoMessage
  implements OnInit {
  @Input()
  habilitarValidacao = false;

  @Input()
  isInResumo = false;

  @Input()
  loading = false;

  @Input()
  disableRemoveButton = false;

  @Input()
  isComplementar = false;

  @Input()
  apresentarDadosDocumento = true;

  @Input()
  controls: boolean;

  @Output()
  readonly arquivosSelecionados = new EventEmitter<ArquivoParam>();

  @Output()
  readonly documentoTipoProcessoSelecionado =
    new EventEmitter<DocumentoTipoProcesso>();

  @Output()
  readonly documentosTipoProcessoSelecionados = new EventEmitter<
    DocumentoTipoProcesso[]
  >();

  @Output()
  readonly documentoComArquivoDeletado =
    new EventEmitter<DocumentoTipoProcesso>();

  @Output()
  readonly possuiFaltaDeArquivos = new EventEmitter<boolean>();

  @Output()
  readonly isLoading = new EventEmitter<boolean>();

  @Output()
  readonly loadingDocument = new EventEmitter<boolean>();

  @Output()
  readonly atualizarPedido = new EventEmitter<any>();

  @Output()
  readonly allDocumentsHasFiles = new EventEmitter<boolean>();

  @Output()
  readonly validacaoAtualizada = new EventEmitter<{ idDocumento: number, idTipoValidacao: number }>();

  existeDocumentoParaProcedimentosSelecionados = false;
  itensTipoValidacao: SelectItem[] = [];
  validacoes: any = {};
  situacaoDocValidacao: any = [];
  mapaValidacoesEncontradas = new Map<number, ValidacaoDocumentoPedido>();

  @Output()
  readonly atualizacaoSituacaoDocumento$ = new EventEmitter<any>();

  private readonly validacaoDocumento$ = new ReplaySubject<
    DocumentoTipoProcesso[]
  >();
  private readonly subjectUnsubscription = new Subject<void>();
  private readonly processo$ = new EventEmitter<Pedido>();
  private _isProcessoNovo: boolean;
  private subscriptions = new Subscription();

  constructor(
    protected override readonly messageService: MessageService,
    private readonly documentoTipoProcessoService: DocumentoTipoProcessoService,
    private readonly anexoService: AnexoService,
    private readonly processoService: ProcessoService,
    private readonly sessaoService: SessaoService,
    private readonly tipoValidacaoService: TipoValidacaoService,
    private readonly validacaoDocumentoPedidoService: ValidacaoDocumentoPedidoService,
    private readonly documentoPedidoService: DocumentoPedidoService,
    protected override readonly activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    super(messageService, activatedRoute);
  }

  private _documentos: DocumentoTipoProcesso[];

  get documentos() {
    return this._documentos;
  }

  @Input() set documentos(documentos: DocumentoTipoProcesso[]) {
    this._documentos = documentos;
    this.existeDocumentoParaProcedimentosSelecionados =
      isNotUndefinedNullOrEmpty(documentos);
  }

  private _processo: Pedido;

  get processo() {
    return this._processo;
  }

  @Input() set processo(processo: Pedido) {
    const processoAsObject = new Pedido({ ...processo });
    this.processo$.emit(processoAsObject);
    this._processo = processoAsObject;
    this._isProcessoNovo =
      isUndefinedOrNull(processo) || processoAsObject.isNovo();
  }

  get isEditing(): boolean {
    return false;
  }

  get processoNovo(): boolean {
    return this._isProcessoNovo;
  }

  get todosArquivos(): Arquivo[] {
    return this.documentos
      .map((doc) => doc.arquivos)
      .reduce(
        (total: Arquivo[], arquivo) => [...total, ...arquivo],
        new Array<Arquivo[]>()
      );
  }

  @Input()
  set parametro(parametro: DocumentoParam) {
    this.loading = true;
    // console.log("parametros(asc-documento-card): ", parametro)
    this.definirChamadaDoServiceComBaseNosParametros(parametro)
      .pipe(take(1))
      .subscribe(
        (documentos: DocumentoTipoProcesso[]) => {
          this.loading = false;
          this.isLoading.emit(this.loading);

          this.documentos = documentos.filter(
            (documento) => documento.inativo == "NAO"
          );
          this.documentosTipoProcessoSelecionados.emit(this.documentos);
          this.existeDocumentoParaProcedimentosSelecionados =
            isNotUndefinedNullOrEmpty(documentos) ||
            isNotUndefinedNullOrEmpty(this.documentos);
        },
        (error) => {
          this.loading = false;
          this.isLoading.emit(this.loading);
          this.messageService.addMsgDanger(error.message);
        }
      );
  }

  private getBlobArquivo(arquivoModal: ArquivoModal, blobParts: any): File {
    let mimeType =
      arquivoModal.arquivo.type ||
      Util.extrairMimeTypeFromFileName(arquivoModal.arquivo.name);
    let file = new File([blobParts], arquivoModal.arquivo.name, {
      type: mimeType,
    }) as Arquivo;

    file.usuario = this.sessaoService.getUsuario().login;
    return file;
  }

  private getBlobArquivoDireto(arquivo: Arquivo, blobParts: any): File {
    let mimeType = arquivo.type || Util.extrairMimeTypeFromFileName(arquivo.name);
    let file = new File([blobParts], arquivo.name, {
      type: mimeType,
    }) as Arquivo;

    file.usuario = this.sessaoService.getUsuario().login;
    return file;
  }

  clickAlerarDados(documento: ValidacaoDocumentoPedido, valor: boolean) {
    if (documento) {
      documento.edicao = valor;
    }
  }

  ngOnInit() {
    this.isLoading.emit(this.loading);
    this.buscaValidacoes();
    this.registrarConsultaValidacaoDocumento();

    this.subscriptions.add(
      this.validacaoDocumentoPedidoService.atualizacaoValidacoes$.subscribe(() => {
        this.registrarConsultaValidacaoDocumento();
        this.cdr.detectChanges();
      })
    );

  }

  override ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buscaValidacoes() {
    this.tipoValidacaoService
      .get()
      .pipe(
        tap((tv: TipoValidacaoDTO[]) =>
          this.generateSelectItensTipoValidacao(tv)
        ),
        tap(() => this.consultarValidacoesDocumentos()),
        takeUntil(this.subjectUnsubscription)
      )
      .subscribe();
  }

  public atualizarSituacaoDocumentoProcesso(documento: any): void {
    if (documento.arquivos.length > 0) {
      let idTipoValidacao = this.validacoes[documento.id];
      let idPedido = this.processo.id;
      let idDocumentoTipoProcesso = documento.id;

      if (idTipoValidacao == "" || idTipoValidacao == "Selecione uma opção") {
        this.messageService.showDangerMsg(
          "Favor informar a situação do documento!"
        );
      } else {
        this.loading = true;

        const valDocPed = {
          idTipoValidacao: idTipoValidacao,
          idPedido: idPedido,
          idDocumentoTipoProcesso: idDocumentoTipoProcesso,
        } as ValidacaoDocumentoPedido;

        this.validacaoDocumentoPedidoService
          .post(valDocPed)
          .pipe(take(1))
          .subscribe(
            () => {
              this.loading = false;
              this.messageService.showSuccessMsg("MA095");
              this.atualizacaoSituacaoDocumento$.emit(valDocPed);
              this.mapaValidacoesEncontradas.set(documento.id, valDocPed);
              this.onChangeSituacao(documento.id, idTipoValidacao);
              this.atualizarPedido.emit()
              this.validacaoDocumentoPedidoService.emitirAtualizacao();
              this.cdr.detectChanges();

            },
            (error) => {
              this.loading = false;
              this.messageService.addMsgDanger(error.error);
            }
          );
      }
    } else {
      this.messageService.showDangerMsg("Não existe documento para validar!");
    }
  }

  removerArquivo(arquivo: Arquivo, index: number) {
    this.messageService.addConfirmYesNo(
      this.bundle("MA129"),
      (): void => this.removerArquivo$(arquivo, index),
      null,
      null,
      "Sim",
      "Não"
    );
  }

  arquivos(uploadFileParam: ArquivoParam) {
    if (this.isInResumo) {
      const documento = uploadFileParam.param as DocumentoTipoProcesso;

      uploadFileParam.files.forEach((file: Arquivo) => {
        file.isNew = true;
        file.data = new Date();
        documento.arquivos.push(file);
      });
      this.documentoTipoProcessoSelecionado.emit(documento);
      this.emitirFaltaDeDocumentos();
    } else {
      this.arquivosSelecionados.emit(uploadFileParam);
    }
    this.registrarConsultaValidacaoDocumento();
  }

  click(documentoTipoProcesso: DocumentoTipoProcesso) {
    this.documentoTipoProcessoSelecionado.emit(documentoTipoProcesso);
  }

  abrirModalVisualizarDocumentos(
    event: any,
    arquivo: Arquivo,
    modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent,
    arquivos: Arquivo[]
  ) {console.log(arquivo);
    const arquivoModal: ArquivoModal = {
      event,
      arquivo,
      arquivos,
      modalVisualizarDocumentoComponent,
    };

    if (arquivo && arquivo.id) {
      this.abrirArquivo(arquivoModal);
    } else {
      this.actionToOpenModel(arquivoModal);
    }
  }

  isPermiteUpload(documento: number): boolean {

    // Verificação combinada se processo é nulo, última situação não existe ou documento é nulo
    if (!this.processo || !this.processo.ultimaSituacao || !documento) {
      return true;
    }

    // Verificação se o documento é considerado válido ou dispensado
    const situacaoDocumento = this.mostraSituacao(documento);
    if (situacaoDocumento === 'VÁLIDO' || situacaoDocumento === 'DISPENSADO') {
      return false;
    }

    // Verificação se o usuário é "analista" usando a função isTituloAnalista
    if (this.tituloAnalise) {
      // Se for analista, verifica se a ação é nula
      if (this.processo.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente == null) {
        return false;
      } else {
        return true;
      }
    } else {
      // Se não for analista, verifica se a ação é igual a 1
      if (this.processo.ultimaSituacao.situacaoProcesso.nuAcaoRequeridaAgente === 1) {
        return true;
      } else {
        return false;
      }
    }
  }

  isPermiteRemover(arquivo: Arquivo, documento: DocumentoTipoProcesso): boolean {
    
    if (this.disableRemoveButton) {
      return false;
    }

    const dataCadastramento = this.processo && this.processo.ultimaSituacao ? new Date(this.processo.ultimaSituacao.dataCadastramento) : new Date();
    
    // Adiciona 5 segundos à dataCadastramento
    const dataCadastramentoMais5Segundos = new Date(dataCadastramento.getTime() - 5000);

    // Verifica se a remoção é permitida pelo método isPermiteUpload e se a data do arquivo é mais recente que 5 segundos antes da dataCadastramento
    return this.processo && this.processo.ultimaSituacao ? this.isPermiteUpload(documento.id) && new Date(arquivo.data) > dataCadastramentoMais5Segundos : true;
  }



  private isPossuiPermissao(permissao: string): boolean {
    if (this.permissoes && this.permissoes.perfil) {
      return this.permissoes.perfil.some((x) => x.codigo == permissao);
    }

    return false;
  }

  private isSituacaoProcesso(situacao): boolean {
    return this.processo.ultimaSituacao.situacaoProcesso.id == situacao;
  }

  get statusAComparar(){
    return [
      StatusProcessoEnum.PEDIDO_DEFERIDO,
      StatusProcessoEnum.PEDIDO_INDEFERIDO,
      StatusProcessoEnum.CANCELADO_PELO_TITULAR,
      StatusProcessoEnum.PEDIDO_DEFERIDO_AUTOMATICAMENTE,
      StatusProcessoEnum.PROCESSO_ENCERRADO,
      StatusProcessoEnum.INDEFERIMENTO_RATIFICADO,
      StatusProcessoEnum.AUTORIZ_PREVIA_NEGADA,
      StatusProcessoEnum.AUTORIZACAO_PREVIA,
      StatusProcessoEnum.AUTORIZACAO_PREVIA_LIB_PARC,
      StatusProcessoEnum.AGUARD_CONS_PROFISSIONAL,
      StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_ASSIT,
      StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_DESMP,
      StatusProcessoEnum.BENEF_CONV_PERICIA,
      StatusProcessoEnum.MIGRAR_SIST_SAUDE,
      StatusProcessoEnum.EM_PROCESSAMENTO_SIST_SAUDE,
      StatusProcessoEnum.FALHA_PROC_SIST_SAUDE,
      StatusProcessoEnum.EM_CONFERENCIA_SIST_SAUDE,
      StatusProcessoEnum.AGUARD_CAD_PROFISSIONAL_LIVRE,
      StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE,
    ]
  }

  private validaUpload(): boolean {
    return (
      !this.permissoes ||
      this.processoNovo ||
      !this.processo ||
      (this.permissoes.upload && this.permissoes.editar)
    );
  }

  public removerDocumento(documento: any): void {
    this.messageService.addConfirmYesNo(
      this.bundle("MA096"),
      (): void => {
        let idPedido = this.processo.id;
        let idDocumentoTipoProcesso = documento.id;

        this.documentoPedidoService
          .excluirPorIdPedidoAndIdDocumentoTipoProcesso(
            idPedido,
            idDocumentoTipoProcesso
          )
          .subscribe(
            () => {
              this.messageService.showSuccessMsg("MA039");
              this.atualizarPedido.emit();
            },
            (error) => {
              this.messageService.showDangerMsg(error.error);
              this.loading = false;
            }
          );
      },
      null,
      null,
      "Sim",
      "Não"
    );
  }

  public validacaoDocPedido(idDocumentoTipoProcesso: number): boolean {
    return !this.validacoes[idDocumentoTipoProcesso];
  }

  public mostraSituacao(idDocumentoTipoProcesso: number): string {

    if (this.validacoes[idDocumentoTipoProcesso]) {
      let index = this.validacoes[idDocumentoTipoProcesso];
      return this.situacaoDocValidacao[index];
    } else {
      return "—";
    }
  }

  emitirFaltaDeDocumentos() {
    this.possuiFaltaDeArquivos.emit(this.verificarFaltaDeDocumentos());
  }

  existeDocumentoParaProcedimentos(): boolean {
    return !isUndefinedNullOrEmpty(this.documentos);
  }

  verificarFaltaDeDocumentos() {
    return (
      this.existeDocumentoParaProcedimentos() &&
      this.documentos &&
      this.documentos.some((doc) => isUndefinedNullOrEmpty(doc.arquivos))
    );
  }

  private consultarValidacoesDocumentos() {
    if (this.documentos) {
      this.validacaoDocumento$.next(this.documentos);
    }
  }
  

  private registrarConsultaValidacaoDocumento(): void {
    this.validacaoDocumento$
      .pipe(
        CustomOperatorsRxUtil.filterBy(
          (docs: DocumentoTipoProcesso[]) => this.processo && docs && docs.length > 0
        ),
        distinctUntilChanged(),
        switchMap((docs: DocumentoTipoProcesso[]) =>
          this.mapToObservablesValidacaoListaDocumentoPedido(docs)
        ),
        tap(({ obrigatorios, complementares }) => {
          let todosObrigatoriosValidos = true;
          let todosComplementaresValidos = true;
  
          obrigatorios.forEach((validacao) => {
            this.atualizarEstadoDocumento(validacao);
            if (!this.isDocumentoValidoOuDispensado(validacao)) {
              todosObrigatoriosValidos = false;
            }
          });
  
          complementares.forEach((validacao) => {
            this.atualizarEstadoDocumento(validacao);
            if (!this.isDocumentoValidoOuDispensado(validacao)) {
              todosComplementaresValidos = false;
            }
          });

          this.itensTipoValidacao = [...this.itensTipoValidacao];
  
          const estadoAtualObrigatorios = this.documentoPedidoService.getAvisoSituacaoPedidoState();
          if (estadoAtualObrigatorios !== todosObrigatoriosValidos && obrigatorios.length > 0) {
            this.documentoPedidoService.setAvisoSituacaoPedido(todosObrigatoriosValidos);
          }
  
          const estadoAtualComplementares = this.documentoPedidoService.getAvisoSituacaoPedidoComplementaresState();
          if (estadoAtualComplementares !== todosComplementaresValidos && complementares.length > 0) {
            this.documentoPedidoService.setAvisoSituacaoPedidoComplementares(todosComplementaresValidos);
          }
        }),
        takeUntil(this.subjectUnsubscription)
      )
      .subscribe({
        next: () => {
          this.atualizarPedido.emit();
          // console.log("Consulta de validação registrada e executada.");
        },
        error: (err) => {
          console.error("Erro ao registrar consulta de validação:", err);
        },
      });
  }  
  
     
  
  private atualizarEstadoDocumento(validacao: ValidacaoDocumentoPedido): void {
    this.mapaValidacoesEncontradas.set(validacao.idDocumentoTipoProcesso, validacao);
    this.validacoes[validacao.idDocumentoTipoProcesso] = validacao.idTipoValidacao;
    this.situacaoDocValidacao = { ...this.situacaoDocValidacao };
  }

  private isDocumentoValidoOuDispensado(validacao: ValidacaoDocumentoPedido): boolean {
    const situacaoDocumento = this.mostraSituacao(validacao.idDocumentoTipoProcesso);

    // console.log("Validacao recebida:", validacao);
    // console.log("Situação do documento:", situacaoDocumento);

    // Verifica se a situação é "VÁLIDO" ou "DISPENSADO"
    if (situacaoDocumento === 'VÁLIDO' || situacaoDocumento === 'DISPENSADO') {
        // console.log(
        //     `Documento ID ${validacao.idDocumentoTipoProcesso} é considerado válido ou dispensado pela situação: ${situacaoDocumento}`
        // );
        return true;
    }

    // Buscar o documento correspondente
    const documento = this.documentos.find(
        (doc) => doc.id === validacao.idDocumentoTipoProcesso
    );

    if (!documento) {
      // console.log(
      //   `Documento ID ${validacao.idDocumentoTipoProcesso} não encontrado na lista de documentos locais.`
      // );
  
      // Se o documento não existe, verificar o tipo pela validação negativa
      if (validacao.codigoUsuarioValidacao === '1') {
        // Documento obrigatório
        const estadoAtualObrigatorios = this.documentoPedidoService.getAvisoSituacaoPedidoState();
        // console.log(
        //   `Documento obrigatório. Estado atual do aviso de obrigatórios: ${estadoAtualObrigatorios}`
        // );
        return estadoAtualObrigatorios;
      } else if (validacao.codigoUsuarioValidacao === '2') {
        // Documento complementar
        const estadoAtualComplementares = this.documentoPedidoService.getAvisoSituacaoPedidoComplementaresState();
        // console.log(
        //   `Documento complementar. Estado atual do aviso de complementares: ${estadoAtualComplementares}`
        // );
        return estadoAtualComplementares;
      }
  
      // console.log(
      //   `Documento ID ${validacao.idDocumentoTipoProcesso} possui um código de validação desconhecido: ${validacao.codigoUsuarioValidacao}`
      // );
      return false;
    }

    if (!documento.arquivos || documento.arquivos.length === 0) {
        // console.log(
        //     `Documento ID ${validacao.idDocumentoTipoProcesso} não possui anexos.`
        // );
        return false;
    }

    // Verifica se o documento existe e possui anexos
    if (!documento || !documento.arquivos || documento.arquivos.length === 0) {
        // console.log(
        //     `Documento ID ${validacao.idDocumentoTipoProcesso} é considerado inválido porque não possui anexos.`
        // );
        return false;
    }

    if (this.processo && this.processo.ultimaSituacao) {
        // Obtém a data da última situação do pedido
        const dataUltimaSituacao = new Date(this.processo.ultimaSituacao.dataCadastramento);
        // console.log("Data da última situação do pedido:", dataUltimaSituacao);

        // Subtrai 5 segundos da data da última situação
        const dataLimite = new Date(dataUltimaSituacao.getTime() - 10000);
        // console.log("Data limite (última situação - 10 segundos):", dataLimite);

        // Verifica se algum anexo é mais recente que a data limite
        const anexoRecente = documento.arquivos.some(
            (arquivo) => new Date(arquivo.data) > dataLimite
        );

        if (anexoRecente) {
            // console.log(
            //     `Documento ID ${validacao.idDocumentoTipoProcesso} possui ao menos um anexo mais recente do que a data limite.`
            // );
            return true;
        } else {
            // console.log(
            //     `Documento ID ${validacao.idDocumentoTipoProcesso} não possui anexos mais recentes do que a data limite.`
            // );
        }
    } else {
        // console.log("Processo ou última situação do pedido não encontrada.");
    }

    // console.log("situacao", situacaoDocumento)

    if (situacaoDocumento == '—') {
      // console.log(
      //     `Situação do documento é nula para o documento ID ${validacao.idDocumentoTipoProcesso}.`
      // );
  
      const documento = this.documentos.find(
          (doc) => doc.id === validacao.idDocumentoTipoProcesso
      );
  
      if (!documento || !documento.arquivos || documento.arquivos.length === 0) {
          // console.log(
          //     `Documento ID ${validacao.idDocumentoTipoProcesso} não possui anexos. Considerado inválido.`
          // );
          return false;
      }
  
      if (validacao.codigoUsuarioValidacao === '1') {
          // console.log(
          //     `Documento ID ${validacao.idDocumentoTipoProcesso} é obrigatório e possui anexos. Considerado válido.`
          // );
          return true;
      } else if (validacao.codigoUsuarioValidacao === '2') {
          // console.log(
          //     `Documento ID ${validacao.idDocumentoTipoProcesso} é complementar. Considerado inválido.`
          // );
          return true;
      }
  
      // console.log(
      //     `Documento ID ${validacao.idDocumentoTipoProcesso} possui um código de validação desconhecido: ${validacao.codigoUsuarioValidacao}`
      // );
      return false;
  }

    // Caso nenhuma das regras acima seja atendida, o documento não é válido
    // console.log(
    //     `Documento ID ${validacao.idDocumentoTipoProcesso} é considerado inválido após todas as verificações.`
    // );
    return false;
}


  

  // private mapToObservablesValidacaoDocumentoPedido(
  //   docs: DocumentoTipoProcesso[]
  // ): Observable<ValidacaoDocumentoPedido>[] {
  //   console.log("mapToObservablesValidacaoDocumentoPedido-this.validacaoDocumentoPedidoService.consultarValidacaoDocumentoPedido "+this.processo.id);
  //   //this.mapToObservablesValidacaoListaDocumentoPedido(docs);
  //   console.log("-------------------------------------------------");
  //   return docs.map((d) =>
  //     this.validacaoDocumentoPedidoService.consultarValidacaoDocumentoPedido(
  //       this.processo.id,
  //       d.id
  //     )
  //   );
  // }

  //Validacao de documentos em lote
  private mapToObservablesValidacaoListaDocumentoPedido(
    docs: DocumentoTipoProcesso[]
  ): Observable<{ obrigatorios: ValidacaoDocumentoPedido[]; complementares: ValidacaoDocumentoPedido[] }> {
    const idPedido = this.processo.id;
  
    const listaIdDocumentos = docs.map((d) => ({
      idPedido: idPedido,
      idDocumentoTipoProcesso: d.id,
    }));
  
    const obrigatorios$ = this.documentoPedidoService.consultarDocumentosObrigatoriosPorPedido(idPedido);
    const complementares$ = this.documentoPedidoService.consultarDocumentosComplementaresPorPedido(idPedido);
  
    return forkJoin([obrigatorios$, complementares$]).pipe(
      switchMap(([obrigatorios, complementares]) =>
        this.validacaoDocumentoPedidoService.consultarValidacaoListaDocumentoPedido(listaIdDocumentos).pipe(
          map((vdps: ValidacaoDocumentoPedido[]) => {
            const obrigatoriosIds = new Set(obrigatorios.map((doc) => doc.idDocumentoTipoProcesso));
            const complementaresIds = new Set(complementares.map((doc) => doc.idDocumentoTipoProcesso));
  
            // Ajuste no Map para garantir conformidade com os tipos esperados
            const mapaValidacoesExistentes = new Map<number, ValidacaoDocumentoPedido>(
              vdps.map((validacao): [number, ValidacaoDocumentoPedido] => [
                validacao.idDocumentoTipoProcesso,
                validacao,
              ])
            );
  
            const validacoesObrigatorias: ValidacaoDocumentoPedido[] = [];
            const validacoesComplementares: ValidacaoDocumentoPedido[] = [];
  
            obrigatorios.forEach((doc) => {
              const validacaoExistente = mapaValidacoesExistentes.get(doc.idDocumentoTipoProcesso);
  
              if (validacaoExistente) {
                validacoesObrigatorias.push(validacaoExistente);
              } else/* if (!doc.anexos || doc.anexos.length === 0)*/ {
                validacoesObrigatorias.push(this.criarValidacaoNegativa(doc, idPedido, '1'));
              }
            });
  
            complementares.forEach((doc) => {
              const validacaoExistente = mapaValidacoesExistentes.get(doc.idDocumentoTipoProcesso);
  
              if (validacaoExistente) {
                validacoesComplementares.push(validacaoExistente);
              } else {
                validacoesComplementares.push(this.criarValidacaoNegativa(doc, idPedido, '2'));
              }
            });
  
            return { obrigatorios: validacoesObrigatorias, complementares: validacoesComplementares };
          })
        )
      )
    );
  }
  
  private criarValidacaoNegativa(documento: DocumentoPedidoDTO, idPedido: number, valor: string): ValidacaoDocumentoPedido {
    return {
      idTipoValidacao: null, // Valor fixo para indicar validação negativa
      idPedido: idPedido,
      idDocumentoTipoProcesso: documento.idDocumentoTipoProcesso,
      dataValidacao: new Date(), // Data atual
      codigoUsuarioValidacao: valor, // Não há usuário para validação negativa
      edicao: false,
    } as ValidacaoDocumentoPedido;
  }

  onChangeSituacao(idDocumento: number, novaSituacao: any): void {
    this.validacoes = { ...this.validacoes, [idDocumento]: novaSituacao };

    this.itensTipoValidacao = [...this.itensTipoValidacao];
}

  private generateValidacoesDocumento(vdps: ValidacaoDocumentoPedido[]) {
    for (let v of vdps) {
      // Só entra direto no modo de edição se o tipo não for válido.
      v.edicao = false;
      this.mapaValidacoesEncontradas.set(v.idDocumentoTipoProcesso, v);
    }
    return vdps.reduce(
      (acc, current) => ({
        ...acc,
        [current.idDocumentoTipoProcesso]: current.idTipoValidacao,
      }),
      {}
    );
  }

  private generateSelectItensTipoValidacao(res: TipoValidacaoDTO[]) {
    this.itensTipoValidacao = [];
    for (let i of res) {
      this.itensTipoValidacao.push({ label: i.nome, value: i.id });
      this.situacaoDocValidacao[i.id] = i.nome;
    }
  }

  private definirChamadaDoServiceComBaseNosParametros(
    parametro: DocumentoParam
  ): Observable<DocumentoTipoProcesso[]> {
    console.log(parametro);
    if (parametro && parametro.idPedido) {
      return this.documentoTipoProcessoService.consultarRequeridosPorIdPedido(
        parametro.idPedido
      );
    }
    if (parametro && parametro.idTipoProcesso && parametro.idTipoBeneficiario) {
      return this.documentoTipoProcessoService.consultarPorTipoProcessoAndTipoBeneficiario(
        parametro
      );
    }

    console.log("Nenhum parâmetro fornecido.");
    return of([]);
  }

  private removerArquivo$(arquivo, index) {
    let documento = this.documentos[index];

    ArrayUtil.remove(documento.arquivos, arquivo);
    arquivo.idDocTipoProcesso = documento.id;
    this.documentosTipoProcessoSelecionados.emit(this.documentos);
    arquivo.isToDelete = true;
    this.emitirFaltaDeDocumentos();
    this.documentoComArquivoDeletado.emit({
      ...documento,
      arquivos: [arquivo],
    });
    this.registrarConsultaValidacaoDocumento();
  }

  private actionToOpenModel(arquivoModal: ArquivoModal) {
    localStorage.clear()
     const {
       arquivos,
       arquivo,
       modalVisualizarDocumentoComponent: component,
     } = arquivoModal;
     const index = arquivos.findIndex((file) => arquivo === file);
     component.infoExibicao = { itens: arquivos, index, item: arquivo };
    //this.data.storage = { arquivoModal };
    //console.log("this.data.storage - actionToOpenModel(arquivoModal: ArquivoModal) ");
    //console.log(this.data.storage);

    //[INICIO] Abrir em nova janela
    //localStorage.setItem('arquivos', JSON.stringify(arquivoModal.arquivos));
    //localStorage.setItem('idPedido', JSON.stringify(this.processo.id));
    //localStorage.setItem('arquivoAtual', JSON.stringify(arquivoModal.arquivo.name));
    //console.log("actionToOpenModel(arquivoModal: ArquivoModal) {");
    //this.abrirArquivoEmNovaJanela(arquivoModal.arquivo);
    //[FIM] Abrir em nova janela
  }

  private abrirArquivo(arquivoModal: ArquivoModal): void {
    if(arquivoModal && arquivoModal.arquivo && arquivoModal.arquivo.idDocumentoGED){
      this.abrirArquivoGED(arquivoModal);
    }else{
      this.abrirArquivoProcessado(arquivoModal);
    }
  }

  private abrirArquivoProcessado(arquivoModal: ArquivoModal): void {
    console.log("private abrirArquivoProcessado(arquivoModal: ArquivoModal): void { ==============");
    this.anexoService
    .obterArquivoPorNome(arquivoModal.arquivo.name)
    .subscribe(
      (arquivo) => {
        const index = 0;
        console.log("this.anexoService.obterArquivoPorNome(arquivoModal.arquivo.name) ==============");
        console.log(arquivoModal.arquivo);
        console.log(arquivoModal.arquivos);
        console.log(arquivo);
        arquivoModal.arquivo = this.getBlobArquivo(arquivoModal, arquivo);
        arquivoModal.modalVisualizarDocumentoComponent.infoExibicao = {
          itens: arquivoModal.arquivos,
          index,
          item: arquivoModal.arquivo,
        };

        //[INICIO] Abrir em nova janela
        localStorage.setItem('arquivos', JSON.stringify(arquivoModal.arquivos));
        localStorage.setItem('idPedido', JSON.stringify(this.processo.id));
        localStorage.setItem('arquivoAtual', JSON.stringify(arquivoModal.arquivo.name));
        //console.log("abrirArquivoGED(arquivoModal: ArquivoModal): void {");
        //this.abrirArquivoEmNovaJanela(this.getBlobArquivo(arquivoModal, arquivo));
        //[FIM]Abrir em nova janela
      },
      (error) => {
        // Mensagens do tipo 403 já são tratadas pela arquitetura, não duplicar.
        
        if (error.status === 408) {
          this.messageService.addMsgDanger(
            "Tempo de espera esgotado. Favor, tente novamente."
          );
        } else if (error.status === 404) {
          console.log(error);
          this.messageService.addMsgDanger("Arquivo não encontrado nos diretórios.");
        } else if (error.status !== 403) {
          this.messageService.addMsgDanger(error.statusText || error.message);
        }
      }
    );
  }

  private abrirArquivoGED(arquivoModal: ArquivoModal): void {
    console.log("arquivoModal.arquivo ==============================================");
    console.log(arquivoModal.arquivo);
    this.anexoService
      .obterArquivoPorIdGED(arquivoModal.arquivo.idDocumentoGED)
      .subscribe(
        (arquivo) => {
          const index = arquivoModal.arquivos.findIndex(
            (a) => a.id == arquivoModal.arquivo.id
          );
          arquivoModal.arquivo = this.getBlobArquivo(arquivoModal, arquivo);
          arquivoModal.modalVisualizarDocumentoComponent.infoExibicao = {
            itens: arquivoModal.arquivos,
            index,
            item: arquivoModal.arquivo,
          };

          //[INICIO] Abrir em nova janela
          localStorage.setItem('arquivos', JSON.stringify(arquivoModal.arquivos));
          localStorage.setItem('idPedido', JSON.stringify(this.processo.id));
          localStorage.setItem('arquivoAtual', JSON.stringify(arquivoModal.arquivo.name));
          //console.log("abrirArquivoGED(arquivoModal: ArquivoModal): void {");
          //this.abrirArquivoEmNovaJanela(this.getBlobArquivo(arquivoModal, arquivo));
          //[FIM]Abrir em nova janela
        },
        (error) => {
          // Mensagens do tipo 403 já são tratadas pela arquitetura, não duplicar.
          if (error.status === 408) {
            this.messageService.addMsgDanger(
              "Tempo de espera esgotado. Favor, tente novamente."
            );
          } else if (error.status !== 403) {
            this.messageService.addMsgDanger(error.statusText || error.message);
          }
        }
      );
  }

  private abrirArquivoEmNovaJanela(arquivo:any):void{
    const baseUrl = window.location.origin;
    console.log(baseUrl);

    const largura = 850;
    const altura = 600;
    const topPosition = 100;
    const leftPosition = window.screen.width - largura;
    const novaJanela = window.open(baseUrl+"/#/downloadArquivo", '_blank', `width=${largura},height=${altura},resizable=yes,scrollbar=yes, top=${topPosition}, left=${leftPosition}`);
    //const novaJanela = window.open(baseUrl+"/#/downloadArquivo", '_blank', `width=${largura},height=${altura},resizable=yes,scrollbar=yes`);
    
    if(novaJanela){
      novaJanela.focus();
    }
  }

  verificaSituacaoParaExibirOuNao(id: number){
    if(this.tituloAnalise){
      this.mostraOcultaSituacao = true
    }else{
      this.mostraOcultaSituacao = false
      if( this.mostraSituacao(id) != '—' ){
        this.mostraOcultaSituacao =  true
      }
    }
    return this.mostraOcultaSituacao
  }

  buscarArquivosProcessados(event: any, arquivo: Arquivo):void{

    this.anexoService.obterArquivoPorNome(arquivo.name).subscribe( (arquivoBaixado) => {
      console.log("arquivo ***********************************************");
      console.log(arquivo);
        let arquivoDownload = this.getBlobArquivoDireto(arquivo, arquivoBaixado);
        this.downloadFile(arquivoDownload, arquivo.name);
        
      },
      (error) => {
        // Mensagens do tipo 403 já são tratadas pela arquitetura, não duplicar.
        
        if (error.status === 408) {
          this.messageService.addMsgDanger(
            "Tempo de espera esgotado. Favor, tente novamente."
          );
        } else if (error.status === 404) {
          console.log(error);
          this.messageService.addMsgDanger("Arquivo não encontrado nos diretórios.");
        } else if (error.status !== 403) {
          this.messageService.addMsgDanger(error.statusText || error.message);
        }
      }
    )
  }

  downloadFile(file: Blob | File, nome: string): void {
    if(file){
      let a = document.createElement('a');
      a.href = window.URL.createObjectURL(file);
      a.download = nome;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
  
}
