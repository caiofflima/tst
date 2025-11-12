import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Pedido } from "../../../models/comum/pedido";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { SituacaoPedidoService } from "../../../services/comum/situacao-pedido.service";
import { SituacaoPedido } from "../../../models/comum/situacao-pedido";
import { delay, switchMap, takeUntil, tap } from "rxjs/operators";
import { HttpUtil } from "../../../util/http-util";
import { MessageService } from "../../messages/message.service";
import { Subject } from "rxjs";
import { AscModalComponent } from "../../asc-modal/asc-modal/asc-modal.component";
import { ArquivoParam } from '../../asc-file/models/arquivo.param';
import { Arquivo } from 'app/shared/models/dto/arquivo';
import { DocumentoTipoProcesso } from 'app/shared/models/entidades';
import { isUndefinedNullOrEmpty } from 'app/shared/constantes';
import { BundleUtil } from 'app/arquitetura/shared/util/bundle-util';
import { AscModalVisualizarDocumentoComponent } from '../asc-documentos/modal-visualizar-documento/asc-modal-visualizar-documento.component';
import { FileUploadService, SessaoService } from 'app/shared/services/services';

interface ArquivoModal {
    arquivos: Arquivo[];
    arquivo: Arquivo;
    modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent;
    event: any;
}

@Component({
    selector: 'asc-modal-ocorrencia',
    templateUrl: './asc-modal-ocorrencia.component.html',
    styleUrls: ['./asc-modal-ocorrencia.component.scss']
})
export class AscModalOcorrenciaComponent implements OnInit, OnDestroy {

    isButtonDisabled: boolean = false;

    private readonly arquivo$ = new EventEmitter<ArquivoModal>();

    isModalFaded: boolean = false;
    loading: boolean = false;

    @Input()
    inputId: string;

    @Input()
    readonly documento: DocumentoTipoProcesso;

    extensions: string = '.jpg,.png,.gif,.pdf';

    @Input()
    limitLengthFile: number;

    @Input()
    multiple = true;

    @Input()
    isInResumo = false;

    @Input()
    disabled = false;

    @Output()
    arquivos = new EventEmitter<ArquivoParam>();

    files: Set<File> = new Set<File>();
    private extensionsAsArray: string[] = [];
    private _index: number;

    private _processo: Pedido;
    form: FormGroup;
    private onAdicionar$: EventEmitter<SituacaoPedido> = new EventEmitter<SituacaoPedido>();
    private readonly subjecUnsubscribe = new Subject();
    fileUpload?: any | Set<Arquivo> | Arquivo[] = [];

    situacaoPedido: SituacaoPedido;

    @ViewChild("modalComponent")
    modal: AscModalComponent;

    @Output("onMudancaConcluida")
    onMudancaConcluida$ = new EventEmitter<void>();

    @Output()
    readonly onUpdate = new EventEmitter<SituacaoPedido>();

    constructor(private readonly messageService: MessageService, 
                private _fb: FormBuilder, private msgService: MessageService, 
                private service: SituacaoPedidoService,
                private sessaoService: SessaoService,
                private uploadService: FileUploadService) {
        this.form = this._fb.group({
                idPedido: _fb.control(null),
                idTipoOcorrencia: _fb.control(null),
                descricaoHistorico: _fb.control(""),
                tipoOcorrencia: _fb.control(null)
            }
        );
        this.tipoOcorrencia.valueChanges
        .subscribe(next => {
            if (next) {
                this.idTipoOcorrencia.setValue(next.id);
            } else {
                this.idTipoOcorrencia.reset();
            }
        });
    }

    get tipoOcorrencia(): AbstractControl {
        return this.form.get("tipoOcorrencia");
    }

    get idTipoOcorrencia(): AbstractControl {
        return this.form.get("idTipoOcorrencia");
    }

    get descricaoHistorico(): AbstractControl {
        return this.form.get("descricaoHistorico");
    }

    @Input()
    set processo(processo: Pedido) {
        this._processo = processo;
        if (processo) {
            this.form.get("idPedido").setValue(processo.id);
        }

        this.service.consultarUltimaMudancaStatusPedido(processo.id).subscribe(res => {
            this.situacaoPedido = res;
        });
    }

    ngOnInit() {
        this.onAdicionar$.pipe(
            switchMap((situacao: SituacaoPedido) => this.service.incluirOcorrenciaPedido(situacao)),
            delay(200),
            tap((situacao: SituacaoPedido) => this.onUpdate.emit(situacao)),
            tap(() => {
                this.messageService.showSuccessMsg("Ocorrência adicionada ao pedido!");
                this.modal.fechar();
                this.fecharModal();
            }),
            HttpUtil.catchError(this.msgService, () => {
                this.isButtonDisabled = false;
            }),
            takeUntil(this.subjecUnsubscribe)
        ).subscribe();
    
        if (this.extensions) {
            this.extensionsAsArray = this.extensions.split(',');
        }
    }
    

    get usuarioMatricula(): string {
        const matricula = SessaoService.getMatriculaFuncional();
        if (matricula) {
          const truncatedMatricula = matricula.substring(0, 6);
          return `c${truncatedMatricula}`;
        }
        return '';
      }

    show() {
        this.modal.abrir();
    }

    hide() {
        this.modal.fechar();
        this.fecharModal();
    }

    ngOnDestroy(): void {
        this.subjecUnsubscribe.next({});
        this.subjecUnsubscribe.complete();
    }

    fecharModal(): void {
        this.form.reset();
        this.files.clear();
        this.fileUpload = [];
        this.isButtonDisabled = false;
    }

    adicionarOcorrencia(_: MouseEvent) {
        if (this.form.valid && !this.isButtonDisabled) {
            this.isButtonDisabled = true;
            if (this.files && this.files.size > 0) {
                this.salvarMudancaComAnexo();
            } else {
                this.onAdicionar$.emit(this.form.value);
            }
        }
    }

    onChangeFile(inputFile: HTMLInputElement): void {
        const selectedFiles = inputFile.files;
        if (!selectedFiles || selectedFiles.length == 0) {
            inputFile.value = '';
            return;
        }

        try {
            if (!this.files) {
                this.files = new Set<File>();
            }
            this.validarArquivosSelecionados(selectedFiles);
            this.arquivos.emit({ files: this.files, param: this.documento });
        } catch (e) {
            for (let msg of e) {
                this.messageService.addMsgDanger(msg);
            }
        }

        inputFile.value = '';
    }

    private validarArquivosSelecionados(selectedFiles: FileList) {
        const erros = [];
        if (selectedFiles && selectedFiles.length > 10) {
            erros.push(BundleUtil.fromBundle("MA025"));
        }
        const fileWithProblem = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles.item(i);
            this.proceedFile(file, fileWithProblem);
        }

        if (fileWithProblem && fileWithProblem.length) {
            const fileErrorExtensions = fileWithProblem.filter(fileError => fileError.typeError === 'ERROR_EXTENSION');
            const fileErrorLength = fileWithProblem.filter(fileError => fileError.typeError === 'ERROR_SIZE');
            if (fileErrorExtensions && fileErrorExtensions.length) {
                erros.push(BundleUtil.fromBundle("MA023"));
            }
            if (fileErrorLength && fileErrorLength.length) {
                erros.push(BundleUtil.fromBundle("MA024"));
            }
        }
        if (erros.length)
            throw erros;
    }

    private proceedFile(file: File, fileWithProblem: any[]) {
        if (this.isNotAllowedExtensions(file)) {
            fileWithProblem.push({ typeError: 'ERROR_EXTENSION', file });
        } else if (file.size > this.limitLengthFile) {
            fileWithProblem.push({ typeError: 'ERROR_SIZE', file });
        } else {
            this.files.add(file);
        }
    }

    private isNotAllowedExtensions(file: File): boolean {
        return isUndefinedNullOrEmpty(this.extensionsAsArray) ? true : !this.extensionsAsArray
        .includes(/(?:\.([^.]+))?$/.exec(file.name.toLocaleLowerCase())[0]);
    }

    @Input()
    set index(index: number) {
        this._index = index
    }

    public bundle(key: string, args?: any): string {
        return BundleUtil.fromBundle(key, args);
    }

    public converterSetParaArray(files: Set<File>): Arquivo[] {
        return Array.from(files) as Arquivo[];
    }

    public abrirModalVisualizarDocumentos(event: any, arquivo: Arquivo, modalVisualizarDocumentoComponent: AscModalVisualizarDocumentoComponent, arquivos: Arquivo[]): void {
        const arquivoModal = {event, arquivo, arquivos, modalVisualizarDocumentoComponent};
        if (arquivo && arquivo.id) {
            this.arquivo$.emit(arquivoModal);
        } else {
            this.actionToOpenModel(arquivoModal);
        }
    }

    private _converterSetFileParaArrayArquivo(files: Set<File>): Arquivo[] {
        const arquivos: Arquivo[] = [];
        files.forEach(file => {
            const arquivo = file as Arquivo;
            arquivos.push(arquivo);
        });
        return arquivos;
    }

    private actionToOpenModel(arquivoModal: ArquivoModal): void {
        const {arquivos, arquivo, modalVisualizarDocumentoComponent: component} = arquivoModal
        const index = Array.from(arquivos).findIndex(file => arquivo === file);
        component.infoExibicao = {itens: Array.from(arquivos), index, item: arquivo};
    }
    
    removerDocumento(file): void {
        this.isModalFaded = true; // Reduz a opacidade da modal
    
        this.messageService.addConfirmYesNo(
          this.bundle('MA129'),
          () => {
            this.files.delete(file);
            this.isModalFaded = false; // Restaura a opacidade após confirmação positiva
            this.messageService.showSuccessMsg('MA039');
          },
          () => {
            this.isModalFaded = false; // Restaura a opacidade após confirmação negativa
          },
          null,
          'Sim',
          'Não'
        );
      }

    salvarMudancaComAnexo() {
        let formData = new FormData();
        formData.append('processadorUpload', 'documentosSituacaoPedido');
        formData.append('situacaoPedido', btoa(JSON.stringify(this.recuperarDadosDoFormulario())));
    
        this.uploadService.realizarUpload(formData, Array.from(this.files)).subscribe(
            res => {
                let msgsAviso = res['msgsAviso'];
    
                if (msgsAviso && msgsAviso.length > 0) {
                    this.messageService.showWarnMsg(msgsAviso);
                }
    
                this.messageService.showSuccessMsg('Ocorrência adicionada ao pedido! ');
    
                this.modal.fechar();
    
                this.onMudancaConcluida$.emit();

                this.onUpdate.emit(this.recuperarDadosDoFormulario());
    
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                this.isButtonDisabled = false;
            },
            error => {
                this.messageService.showDangerMsg(error.error);
                this.isButtonDisabled = false;
            }
        );
    }
    
    
    
    private recuperarDadosDoFormulario(): any {
        return {
            idPedido: this.form.value.idPedido,
            idSituacaoProcesso: this.situacaoPedido.idSituacaoProcesso,  
            situacaoProcesso: this.situacaoPedido,
            tipoOcorrencia: this.form.value.tipoOcorrencia,
            idTipoOcorrencia:  this.form.value.idTipoOcorrencia,
            descricaoHistorico: this.form.value.descricaoHistorico, 
            isAnexoOcorrencia: true 
        };
    }
}