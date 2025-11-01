import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Pedido} from "../../../models/comum/pedido";
import {BehaviorSubject, Observable, Subject, Subscription} from "rxjs";
import {DocumentoTipoProcesso} from "../../../models/dto/documento-tipo-processo";
import {DocumentoPedidoDTO} from "../../../models/dto/documento-pedido";
import {Arquivo} from "../../../models/dto/arquivo";
import {isNotUndefinedNullOrEmpty} from "../../../constantes";
import {distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {AnexoService} from "../../../services/comum/anexo.service";
import {FileUploadService} from "../../../services/comum/file-upload.service";
import {DocumentoPedidoService, HistoricoProcessoService, MessageService} from "../../../services/services";
import {HttpUtil} from "../../../util/http-util";
import {AscComponenteAutorizado} from "../../asc-pedido/asc-componente-autorizado";
import {RetornoSIASC} from "../../../models/dto/retorno-siasc";
import {ArrayUtil} from "../../../util/array-util";

@Directive()
export abstract class DocumentoAcompanhamentoCommon extends AscComponenteAutorizado implements OnInit, OnDestroy {

    @Output()
    readonly atualizarPedido$ = new EventEmitter<any>();

    @Output()
    readonly hasDocumentos = new EventEmitter<boolean>();

    @Output()
    readonly hasDocumentosInvalidos  = new EventEmitter<boolean>();

    @Output()
    readonly listAnexos = new EventEmitter<DocumentoPedidoDTO[]>();

    @Output()
    readonly hasAnexos = new EventEmitter<boolean>();

    @Output()
    onUploadComplete = new EventEmitter<RetornoSIASC>();

    @Input()
    tipoProcessadorUpload: string = "processadorUploadComumPedido";

    @Input()
    tipoUpload: string = "documentoPedidoBeneficiario";

    @Input()
    atualizarProcesso: Subject<void>;

    loading = true;
    documentoTipoProcessos: DocumentoTipoProcesso[] = [];
    documentos: DocumentoPedidoDTO[] = [];
    private atualizarProcessoSubscription: Subscription;

    protected readonly processo$ = new BehaviorSubject<Pedido>(null);
    protected override readonly unsubscribe$ = new Subject<void>();
    private readonly _anexoService: AnexoService;
    private readonly _fileUploadService: FileUploadService;

    protected constructor(
        protected readonly anexoService: AnexoService,
        protected readonly fileUploadService: FileUploadService,
        protected readonly messageService: MessageService,
        protected readonly historicoProcessoService: HistoricoProcessoService,
        protected readonly documentoPedidoService: DocumentoPedidoService
    ) {
        super();
        this._anexoService = anexoService;
        this._fileUploadService = fileUploadService
    }

    protected _processo: Pedido;

    get processo() {
        return this._processo;
    }

    @Input()
    set processo(processo: Pedido) {
        setTimeout(() => {
            this._processo = processo;
            this.processo$.next(processo);
        }, 0);
    }

    private static anexoDoDocumentoComplementaresEmDocumentoTipoProcesso(documentos: DocumentoPedidoDTO[]): DocumentoPedidoDTO[] {
        return documentos.map(doc => {
            doc.documentoTipoProcesso.arquivos = (doc.anexos || []).map(anexo => ({
                id: anexo.id,
                name: anexo.nome,
                data: anexo.dataHoraCadastramento,
                idDocumentoGED: anexo.idDocumentoGED,
                isToDelete: !anexo.valido,
                usuario: anexo.codigoUsuarioCadastramento
            }));

            return doc
        });
    }

    ngOnInit(): void {
        this.registrarConsultaDocumentos();

        if (this.atualizarProcesso) {
            this.atualizarProcessoSubscription = this.atualizarProcesso.subscribe(() => this.processo$.next(this._processo));
        }
    }

    override ngOnDestroy() {
        if (this.atualizarProcessoSubscription) {
            this.atualizarProcessoSubscription.unsubscribe();
        }
    }

    documentoTipoProcessoSelecionado = (documento: DocumentoTipoProcesso): void => {
        const tipoProcessador = this.definirTipoProcessadorUpload()

        let arquivos = documento.arquivos.filter(arquivo => arquivo.isNew);

        const formData = new FormData();
        formData.append('idPedido', this._processo.id.toString());
        formData.append('idDocumentoProcesso', documento.id.toString());
        formData.append('processadorUpload', tipoProcessador);
        formData.append('tipoUpload', 'documentoPedidoBeneficiario');
        formData.append('rascunhoPedido', "true");

        
        this.loading = true;
        this._fileUploadService.realizarUpload(formData, arquivos).subscribe(retorno => {
            this.loading = false;
            
            
            this.historicoProcessoService.consultarUltimaSituacao(this._processo.id).subscribe(situacao => {
                if (this._processo.ultimaSituacao.id != situacao.id) {
                    this.atualizarPedido$.next(this._processo);
                }
                this._processo.ultimaSituacao = situacao;
                this.processo$.next(this.processo);
                this.onUploadComplete.emit(retorno);
                
            });

        }, error => {
            this.loading = false;
            

            arquivos.forEach(arquivo => {
                this.documentoTipoProcessos.filter(d => d.id === documento.id).forEach(d => {
                    ArrayUtil.remove(d.arquivos, arquivo);
                });

                this.messageService.addMsgDanger(error.error || error.message);
            });
        });
    }

    documentoComArquivoDeletado = (documentoTipoProcesso: DocumentoTipoProcesso) => {
        const arquivos = documentoTipoProcesso.arquivos.filter((arquivo: Arquivo) => arquivo.id && arquivo.isToDelete) as Arquivo[];
        if (arquivos) {
            arquivos.forEach((arquivo: Arquivo) => {
                this.loading = true;
                
                
                this._anexoService.delete(arquivo.id).subscribe(() => {
                    this.loading = false;
                    this.onUploadComplete.emit()
                    this.messageService.showSuccessMsg('MA039');
                }, (error) => {
                    this.loading = false;
                    
                    let docTipoDTO = this.documentoTipoProcessos.find(d => d.id == arquivo.idDocTipoProcesso);
                    docTipoDTO.arquivos.push(arquivo);
                    this.messageService.addMsgDanger(error.error || error.message);
                });
            });
        }
    }

    protected registrarConsultaDocumentos() {        
        this.loading = true;    
        const porAtributoIdDoPedido = (p: Pedido): number => p.id;
        const exibirDocumentosPedidoDTO = (docs: DocumentoPedidoDTO[]) => {
            this.documentos = docs;
    
            // Emitir apenas se os documentos realmente mudaram
            if (JSON.stringify(this.documentos) !== JSON.stringify(docs)) {
                this.listAnexos.emit(docs);
                this.hasDocumentos.emit(isNotUndefinedNullOrEmpty(docs));
                this.hasAnexos.emit(isNotUndefinedNullOrEmpty(docs) && docs.every(doc => doc.anexos && doc.anexos.length > 0));
            }
        };
    
        this.processo$
            .pipe(
                filter(isNotUndefinedNullOrEmpty),
                map(porAtributoIdDoPedido),
                distinctUntilChanged(), // Evitar consultas repetidas
                switchMap(this.consultarDocumento()),
                tap(exibirDocumentosPedidoDTO),
                map(DocumentoAcompanhamentoCommon.anexoDoDocumentoComplementaresEmDocumentoTipoProcesso),
                tap((docs: DocumentoPedidoDTO[]) => this.documentoTipoProcessos = docs.map(doc => doc.documentoTipoProcesso)),
                HttpUtil.catchError(this.messageService, () => this.loading = false),
                takeUntil(this.unsubscribe$)
            )
            .subscribe(() => {
                this.loading = false;
            });
    }
    

    protected abstract consultarDocumento<T>(): (idPedido: number) => Observable<T>;

    private definirTipoProcessadorUpload(): string {
        return this.tipoProcessadorUpload
    }

    atualizarPedido(): void {
        this.atualizarPedido$.next('');
    }

    // isDocumentoInvalido(docs: DocumentoPedidoDTO[]){
    //     let isValido: boolean = false;
    //     docs.forEach( (d) => {
    //         if(d.possuiValidacao){
    //         d.anexos.forEach((a) =>{
    //             if(a.valido==false){
    //                 isValido = !a.valido
    //              }
    //         })
    //     }
    //     });
    //     return isValido;
    // }
}
