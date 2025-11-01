import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {filter, take, takeUntil} from 'rxjs/operators';
import {FileUploadService} from '../../../../shared/services/comum/file-upload.service';
import {
    BeneficiarioService,
    InscricaoDependenteService,
    MessageService,
    SessaoService,
    TipoDeficienciaService
} from '../../../../shared/services/services';
import {Subject} from 'rxjs';
import {ObjectUtils} from '../../../../shared/util/object-utils';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {Arquivo} from "../../../../shared/models/dto/arquivo";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {Municipio} from '../../../../shared/models/comum/municipio';
import {Beneficiario, EstadoCivil, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {isUndefinedNullOrEmpty,} from '../../../../shared/constantes';
import {TipoDeficiencia} from 'app/shared/models/comum/tipo-deficiencia';
import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import {ReciboModel} from '../../models/recibo-form.model';
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {ComplementoDependenteFormModel} from "../../models/complemento-dependente.form.model";
import {DadosDependenteFormModel} from "../../models/dados-dependente-form.model";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {AscValidators} from "app/shared/validators/asc-validators";
import {BaseComponent} from "../../../../shared/components/base.component";
import {Util} from "../../../../arquitetura/shared/util/util";
import {SelectItem} from "primeng/api";
import {AscStepperComponent} from "../../../../shared/components/asc-stepper/asc-stepper/asc-stepper.component";

@Component({
    selector: 'asc-etapa-resumo-alterar',
    templateUrl: './etapa-resumo-alterar.component.html',
    styleUrls: ['./etapa-resumo-alterar.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaResumoAlterarComponent extends BaseComponent implements OnInit, OnDestroy {
    @Input() beneficiarioDependente: BeneficiarioDependenteFormModel;
    @Input() dadoDependente: DadosDependenteFormModel;
    @Input() complementoDependente: ComplementoDependenteFormModel;
    @Input() stepper: AscStepperComponent;
    @Input() municipio: Municipio;
    @Input() tipoDeficiencia: TipoDeficiencia = null;
    @Input() tipoDependente: TipoDependente;
    @Input() estadoCivil: EstadoCivil;
    @Input() beneficiario: Beneficiario;
    @Input() motivoSolicitacao: MotivoSolicitacao;
    @Input() idTipoProcessoResumo = 0;

    @Output() reiniciarEvent = new EventEmitter<void>();
    @Output() processoEnviadoEvent = new EventEmitter<ReciboModel>();

    showModal: boolean = false;
    estadoCivilAlterar: EstadoCivil;
    municipioAlterar: Municipio;
    tipoDeficienciaAlterar: TipoDeficiencia;

      readonly sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'MASCULINO',
        label: "MASCULINO"
    }, {
        value: 'F',
        descricao: 'FEMININO',
        label: "FEMININO"
    }];

    readonly TIPO_PROCESSO_ALTERAR = 13;
    readonly TIPO_PROCESSO_INCLUIR = 11;

    documentoSelecionadoControl = new FormControl();
    documentosCadastrados: DocumentoTipoProcesso[];
    tipoDeficiencias: SelectItem[];
    showProgress = false;
    documentoNaoPossuiArquivos = true;

    isEditingBeneficiario = false;
    isEditingDadosBasicos = false;
    isEditingDadosComplementos = false;
    declaracaoNascidoVivoRequired = false;
    cpfRequired = false;

    private readonly subjecUnsubscribe = new Subject();
    private _arquivos: any | Set<Arquivo> | Arquivo[];
    private indexSelecionado = 0;

    readonly formularioSolicitacao = new FormGroup({
        informacaoAdicional: new FormControl(null),
    });

    get showMatricula(): boolean {
        return (!this.tipoDependente || this.tipoDependente.id != 86);
    }

    readonly formularioBeneficiario = this.idTipoProcessoResumo == this.TIPO_PROCESSO_ALTERAR ? new FormGroup({
        nomeCompleto: new FormControl(null),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        idMotivoSolicitacao: new FormControl(null, Validators.required)

    }) : new FormGroup({
        nomeCompleto: new FormControl(null),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        idMotivoSolicitacao: new FormControl(null)
    });

    readonly formularioDadosBasicos = new FormGroup({
        nomeCompleto: new FormControl(null, Validators.required),
        cpf: new FormControl(null, AscValidators.cpf),
        dataNascimento: new FormControl(null, [Validators.required, AscValidators.dataMenorIgualAtual]),
        nomeMae: new FormControl(null, Validators.required),
        sexo: new FormControl(null, Validators.required),
        nomePai: new FormControl(null),
        declaracaoNascidoVivo: new FormControl(null),
        idEstadoCivil: new FormControl(null, Validators.required)
    });

    readonly formularioDadosComplementares = new FormGroup({
        rg: new FormControl(null, AscValidators.somenteAlfaNumericos()),
        orgaoEmissor: new FormControl(null),
        dataExpedicaoRg: new FormControl(null, AscValidators.dataMenorIgualAtual),
        estado: new FormControl(null),
        municipio: new FormControl(null),
        cartaoNacionalSaude: new FormControl(null, AscValidators.somenteNumeros()),
        cartaoUnimed: new FormControl(null, AscValidators.somenteNumeros()),
        renda: new FormControl(null),
        idTipoDeficiencia: new FormControl(null),
        emailDependente: new FormControl(null, AscValidators.email()),
    });

    readonly matricula = SessaoService.usuario.matriculaFuncional;

    constructor(
        override readonly messageService: MessageService,
        private readonly service: InscricaoDependenteService,
        private readonly tipoDeficienciaService: TipoDeficienciaService
    ) {
        super(messageService)
        this.getTipoDeficiencia();
    }

    getTipoDeficiencia() {
        this.tipoDeficienciaService.consultarTodos().subscribe(
            result => {
                this.tipoDeficiencias = [{label: 'Selecione', value: null}];
                this.tipoDeficiencias = result.map(i => ({
                    label: i.descricao,
                    value: i
                } as SelectItem));
            }
        );
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

    get nomeSexo(): string {
        if (this.dadoDependente) {
            const s = this.sexos.find(sexo => sexo.value == this.dadoDependente.sexo);
            return s ? s.label : null;
        }

        return null;
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

    cancelarAlterarDadosComplementares() {
        this.isEditingDadosComplementos = false;
        this.formularioDadosComplementares.reset();
    }

    alterDadosComplementos() {
        this.isEditingDadosComplementos = true;
        this.municipioAlterar = this.municipio;
        this.tipoDeficienciaAlterar = this.tipoDeficiencia;

        if (this.complementoDependente) {
            this.formularioDadosComplementares.setValue({
                rg: this.complementoDependente.rg,
                orgaoEmissor: this.complementoDependente.orgaoEmissor,
                dataExpedicaoRg: this.complementoDependente.dataExpedicaoRg,
                estado: this.municipio && this.municipio.estado ? this.municipio.estado.id : null,
                municipio: this.municipio ? this.municipio.id : null,
                idTipoDeficiencia: this.tipoDeficiencia ? this.tipoDeficiencia.id : null,
                cartaoNacionalSaude: this.complementoDependente.cartaoNacionalSaude,
                cartaoUnimed: this.complementoDependente.cartaoUnimed,
                renda: this.complementoDependente.renda,
                emailDependente: this.complementoDependente.emailDependente,
            });
        }

        this.formularioDadosComplementares.controls['orgaoEmissor'].setValidators(null);
        this.formularioDadosComplementares.controls['dataExpedicaoRg'].setValidators(null);
        this.formularioDadosComplementares.controls['rg'].setValidators(AscValidators.somenteAlfaNumericos());

        this.formularioDadosComplementares.controls['rg'].updateValueAndValidity();
        this.formularioDadosComplementares.controls['orgaoEmissor'].updateValueAndValidity();
        this.formularioDadosComplementares.controls['dataExpedicaoRg'].updateValueAndValidity();
    }

    salvarDadosComplementos() {
        this.isEditingDadosComplementos = false;
        this.complementoDependente.rg = this.formularioDadosComplementares.get('rg').value;
        this.complementoDependente.orgaoEmissor = this.formularioDadosComplementares.get('orgaoEmissor').value;
        this.complementoDependente.dataExpedicaoRg = this.formularioDadosComplementares.get('dataExpedicaoRg').value;
        this.municipio = this.municipioAlterar;
        this.tipoDeficiencia = this.tipoDeficienciaAlterar;
        this.complementoDependente.cartaoNacionalSaude = this.formularioDadosComplementares.get('cartaoNacionalSaude').value;
        this.complementoDependente.cartaoUnimed = this.formularioDadosComplementares.get('cartaoUnimed').value;
        this.complementoDependente.renda = this.formularioDadosComplementares.get('renda').value;
        this.complementoDependente.emailDependente = this.formularioDadosComplementares.get('emailDependente').value;
    }

    get rgRequired(): boolean {
        return !!(this.formularioDadosComplementares.get('rg').value || this.formularioDadosComplementares.get('orgaoEmissor').value
            || this.formularioDadosComplementares.get('dataExpedicaoRg').value);
    }

    cancelarAlterarDadosBasicos() {
        this.isEditingDadosBasicos = false;
        this.formularioDadosBasicos.reset();
    }

    alterarDadosBasicos() {
        this.isEditingDadosBasicos = true;
        this.validDataNascimento();
        if (this.dadoDependente) {
            this.formularioDadosBasicos.setValue({
                nomeCompleto: this.dadoDependente.nomeCompleto,
                cpf: this.dadoDependente.cpf,
                dataNascimento: this.dadoDependente.dataNascimento,
                nomeMae: this.dadoDependente.nomeMae,
                sexo: this.dadoDependente.sexo,
                nomePai: this.dadoDependente.nomePai,
                declaracaoNascidoVivo: this.dadoDependente.declaracaoNascidoVivo,
                idEstadoCivil: this.dadoDependente.idEstadoCivil,
                
            });
        }
    }

    salvarDadosBasicos() {
        this.isEditingDadosBasicos = false;
        this.dadoDependente.nomeCompleto = this.formularioDadosBasicos.get('nomeCompleto').value;
        this.dadoDependente.cpf = this.formularioDadosBasicos.get('cpf').value;
        this.dadoDependente.dataNascimento = this.formularioDadosBasicos.get('dataNascimento').value;
        this.dadoDependente.sexo = this.formularioDadosBasicos.get('sexo').value;
        this.dadoDependente.nomeMae = this.formularioDadosBasicos.get('nomeMae').value;
        this.dadoDependente.nomePai = this.formularioDadosBasicos.get('nomePai').value;
        this.dadoDependente.declaracaoNascidoVivo = this.formularioDadosBasicos.get('declaracaoNascidoVivo').value;
        this.estadoCivil = this.estadoCivilAlterar;
        this.dadoDependente.idEstadoCivil = this.estadoCivil.id;
        
    }

    cancelarAlterarBeneficiarios() {
        this.isEditingBeneficiario = false;
        this.formularioBeneficiario.reset();
    }

    salvarBeneficiarios() {
        this.isEditingBeneficiario = false;
        this.dadoDependente.nomeCompleto = this.formularioBeneficiario.get('nomeCompleto').value;
        this.beneficiarioDependente.email = this.formularioBeneficiario.get('email').value;
        this.beneficiarioDependente.telefoneContato = Util.somenteNumeros(this.formularioBeneficiario.get('telefoneContato').value);
    }

    alterarBeneficiarios() {
        this.isEditingBeneficiario = true;
        if (this.dadoDependente) {
            this.formularioBeneficiario.setValue({
                nomeCompleto: this.dadoDependente.nomeCompleto,
                email: this.beneficiarioDependente.email,
                telefoneContato: this.beneficiarioDependente.telefoneContato,
                idMotivoSolicitacao: this.idTipoProcessoResumo === this.TIPO_PROCESSO_ALTERAR ? this.motivoSolicitacao.id : null
            });
        }
    }

    validDataNascimento() {
        const dataNascimento = this.formularioDadosBasicos.get('dataNascimento').value;
        if (dataNascimento) {
            let data = Util.getDate(dataNascimento);
            let after14Year: Date = new Date();

            data.setHours(0, 0, 0, 0);
            after14Year.setHours(0, 0, 0, 0);
            after14Year.setFullYear(after14Year.getFullYear() - 14);

            if (data <= after14Year) {
                this.formularioDadosBasicos.get('cpf').setValidators([Validators.required, AscValidators.cpf]);
                this.formularioDadosBasicos.get('cpf').updateValueAndValidity();
                this.cpfRequired = true;
            } else {
                this.formularioDadosBasicos.get('cpf').setValidators(AscValidators.cpf);
                this.formularioDadosBasicos.get('cpf').updateValueAndValidity();
                this.cpfRequired = false;
            }

            let date31122009: Date = new Date();
            date31122009.setHours(0, 0, 0, 0);
            date31122009.setUTCFullYear(2009, 11, 31);
            if (data > date31122009) {
                this.formularioDadosBasicos.get('declaracaoNascidoVivo').setValidators([Validators.required]);
                this.formularioDadosBasicos.get('declaracaoNascidoVivo').updateValueAndValidity();
                this.declaracaoNascidoVivoRequired = true;
            } else {
                this.formularioDadosBasicos.get('declaracaoNascidoVivo').setValidators(null);
                this.formularioDadosBasicos.get('declaracaoNascidoVivo').updateValueAndValidity();
                this.declaracaoNascidoVivoRequired = false;
            }
        }
    }

    onSubmit() {
        if (!this.showProgress) {
            this.showProgress = true;
            const formData = new FormData();
            let pedidoDependente = {
                idBeneficiario: this.beneficiario != undefined ? this.beneficiario.id : null,
                idTipoProcesso: this.idTipoProcessoResumo,
                idTipoBeneficiario: this.tipoDependente.id,
                idEstadoNaturalidade: this.municipio && this.municipio.estado ? this.municipio.estado.id : null,
                idMunicipioNaturalidade: this.municipio ? this.municipio.id : null,
                idEstadoCivil: this.estadoCivil.id,
                idTipoDeficienca: this.tipoDeficiencia != undefined ? this.tipoDeficiencia.id : null,
                nomeDependente: this.dadoDependente.nomeCompleto,
                cpfDependente: this.dadoDependente.cpf,
                nomeMaeDependente: this.dadoDependente.nomeMae,
                nomePaiDependente: this.dadoDependente.nomePai,
                dataNascimento: this.dadoDependente.dataNascimento,
                sexoDependente: this.dadoDependente.sexo,
                declaracaoNascidoVivo: this.dadoDependente.declaracaoNascidoVivo,
                rg: this.complementoDependente.rg,
                rgOrgaoEmissor: this.complementoDependente.orgaoEmissor,
                dataExpedicaoRg: this.complementoDependente.dataExpedicaoRg,
                cartaoNacionalSaude: this.complementoDependente.cartaoNacionalSaude,
                cartaoDependete: this.complementoDependente.cartaoUnimed,
                valorRenda: this.complementoDependente.renda,
                email: this.beneficiarioDependente.email,
                telefone: this.beneficiarioDependente.telefoneContato,
                idMotivoSolicitacao: this.motivoSolicitacao != undefined ? this.motivoSolicitacao.id : null,
                dsInfoAdicional: this.formularioSolicitacao.get('informacaoAdicional').value,
                emailDependente: this.complementoDependente.emailDependente,
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

            formData.append('data', btoa(JSON.stringify(pedidoDependente)));

            this.service.salvar(formData).pipe(
                take(1)
            ).subscribe(res => {
                this.processoEnviadoEvent.emit(res);
            }, error => {
                this.showProgress = false;
                this.messageService.addMsgDanger(error.error);
            });
        }
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }

    override ngOnDestroy(): void {
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

    municipioSelecionado(municipio: Municipio) {
        this.municipioAlterar = municipio;
    }

    estadoCivilSelecionado(estadoCivil: EstadoCivil) {
        this.estadoCivilAlterar = estadoCivil;
    }

    setModal(bool: boolean): void {
        this.showModal = bool;
    }

    reiniciarForm(): void {
        this.stepper.reset();
        this.reiniciarEvent.emit();
        this.showModal = false;
    }
}
