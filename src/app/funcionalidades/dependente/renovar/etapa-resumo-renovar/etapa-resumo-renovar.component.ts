import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {FileUploadService} from '../../../../shared/services/comum/file-upload.service';
import {InscricaoDependenteService, MessageService, SessaoService} from '../../../../shared/services/services';
import {Subject} from 'rxjs';
import {ObjectUtils} from '../../../../shared/util/object-utils';
import {FormControl, FormGroup} from '@angular/forms';
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {Arquivo} from "../../../../shared/models/dto/arquivo";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {Beneficiario, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {isUndefinedNullOrEmpty,} from '../../../../shared/constantes';
import {ReciboModel} from '../../models/recibo-form.model';
import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import {AscStepperComponent} from "../../../../shared/components/asc-stepper/asc-stepper/asc-stepper.component";

@Component({
    selector: 'asc-etapa-resumo-renovar',
    templateUrl: './etapa-resumo-renovar.component.html',
    styleUrls: ['./etapa-resumo-renovar.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaResumoRenovarComponent implements OnInit, OnDestroy {
    @Input() beneficiario: Beneficiario;
    @Input() stepper: AscStepperComponent;
    @Input() motivoSolicitacao: MotivoSolicitacao;

    @Input() tipoDependente: TipoDependente;


    @Output() reiniciarEvent = new EventEmitter<void>();
    @Output() processoEnviadoEvent = new EventEmitter<ReciboModel>();

    documentoSelecionadoControl = new FormControl();
    documentosCadastrados: DocumentoTipoProcesso[];
    showProgress = false;
    documentoNaoPossuiArquivos = true;
    showModal: boolean = false;

    private readonly subjecUnsubscribe = new Subject();
    private _arquivos: any | Set<Arquivo> | Arquivo[];
    private indexSelecionado = 0;

    readonly formularioSolicitacao = new FormGroup({
        informacaoAdicional: new FormControl(null),
    });

    readonly matricula = SessaoService.usuario.matriculaFuncional;

    constructor(
        private readonly fileUploadService: FileUploadService,
        private readonly messageService: MessageService,
        private readonly service: InscricaoDependenteService
    ) {
    }

    ngOnInit() {
        this.gerenciarIndexSelecionado();
    }

    private gerenciarIndexSelecionado() {
        this.documentoSelecionadoControl.valueChanges.pipe(
            filter((documento: DocumentoTipoProcesso) => documento.id !== this.documentosCadastrados[0].id),
            takeUntil(this.subjecUnsubscribe),
        ).subscribe((documento: DocumentoTipoProcesso) => {
            this.indexSelecionado = this.documentosCadastrados.findIndex(doc => documento.id === doc.id);
        });
    }

    @Input()
    set documentos(documentos: DocumentoTipoProcesso[]) {
        ObjectUtils.applyWhenIsNotEmpty(documentos, () => {
            this.documentosCadastrados = documentos;
            this.arquivos = this.documentosCadastrados.reduce((acc, current) => {
                return [...acc, ...current.arquivos];
            }, []);
        });

        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    get arquivos() {
        return this._arquivos;
    }

    set arquivos(arquivos: any | Set<Arquivo> | Arquivo[]) {
        this._arquivos = arquivos;
    }

    onSubmit() {
        if (!this.showProgress) {
            this.showProgress = true;
            const formData = new FormData();
            let pedidoRenovacaoDependente = {
                idTipoProcesso: 14,
                idBeneficiario: this.beneficiario.id,
                idTipoBeneficiario: this.tipoDependente.id,
                idMotivoRenovavao: this.motivoSolicitacao.id,
                nomeDependente: this.beneficiario.nome,
                cpfDependente: this.beneficiario.matricula.cpf,
                nomeMaeDependente: this.beneficiario.matricula.nomeMae,
                nomePaiDependente: this.beneficiario.matricula.nomePai,
                dataNascimento: this.beneficiario.matricula.dataNascimento,
                sexoDependente: this.beneficiario.matricula.sexo,
                idEstadoCivil: this.beneficiario.estadoCivil ? this.beneficiario.estadoCivil.id : null,
                dsInfoAdicional: this.formularioSolicitacao.get('informacaoAdicional').value
            };

            if (this.documentosCadastrados) {
                let i = 0;
                this.documentosCadastrados.forEach(file => {
                    file.arquivos.forEach(f => {
                        formData.append(`arquivo${i}`, f);
                        formData.append(`nomeArquivo${i}`, btoa(f.name));
                        formData.append(`idDocumentoTipoProcesso${i}`, file.id.toString());
                        i++;
                    })
                });
            }

            formData.append('data', btoa(JSON.stringify(pedidoRenovacaoDependente)));

            this.service.renovar(formData).subscribe(res => {
                    this.processoEnviadoEvent.emit(res);
                }, error => {
                    this.showProgress = false;
                    this.messageService.addMsgDanger(error.error || 'Um erro aconteceu. Por favor, entre em contato com o administrador');
                }
            );
        }
    }

    setModal(bool: boolean): void {
        this.showModal = bool;
    }

    reiniciarForm(): void {
        this.stepper.reset();
        this.reiniciarEvent.emit();
        this.showModal = false;
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
        this.stepper.previous();
    }

    ngOnDestroy(): void {
        this.subjecUnsubscribe.next('');
        this.subjecUnsubscribe.complete();
    }

    arquivosSelecionados(arquivo: ArquivoParam) {
        if (this.documentosCadastrados && this.documentosCadastrados.length) {
            if (isUndefinedNullOrEmpty(this.documentosCadastrados[this.indexSelecionado].arquivos)) {
                this.documentosCadastrados[this.indexSelecionado].arquivos = [];
            }
            arquivo.files.forEach(file => {
                if (!this.possuiArquivoNaListagem(this.documentosCadastrados[this.indexSelecionado].arquivos, file)) {
                    this.documentosCadastrados[this.indexSelecionado].arquivos.push(file);
                }
            });
            this.indexSelecionado = 0;
            this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        }
    }

    possuiArquivoNaListagem(lista: Arquivo[], file: Arquivo): boolean {
        let isDuplicado = false;
        lista.forEach(arquivo => {
            if (arquivo.name === file.name && arquivo.size === file.size && arquivo.type === file.type) {
                isDuplicado = true;
            }
        });
        return isDuplicado;
    }

    watchDocumentos(documentos: DocumentoTipoProcesso[]) {
        this.documentosCadastrados = documentos;
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    selecionarTipoDocumento(tipoDocumento: DocumentoTipoProcesso) {
        this.documentoSelecionadoControl.setValue(tipoDocumento);
        this.documentoSelecionadoControl.updateValueAndValidity();
    }

    verificarFaltaDeDocumentos(): boolean {
        return this.documentosCadastrados
            && this.documentosCadastrados.length
            && this.documentosCadastrados.some(doc => isUndefinedNullOrEmpty(doc.arquivos));
    }
}
