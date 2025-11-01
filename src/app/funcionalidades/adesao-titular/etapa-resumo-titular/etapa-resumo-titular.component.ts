import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {filter, take, takeUntil} from 'rxjs/operators';

import { FileUploadService } from 'app/shared/services/services';
import { BeneficiarioService, InscricaoDependenteService, MessageService, SessaoService, TipoDeficienciaService } from 'app/shared/services/services';

import {Subject} from 'rxjs';
import { ObjectUtils } from 'app/shared/util/object-utils';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ArquivoParam } from 'app/shared/components/asc-file/models/arquivo.param';
import { Arquivo } from 'app/shared/models/dto/arquivo';
import { fadeAnimation } from 'app/shared/animations/faded.animation';
import { Beneficiario, EstadoCivil, MotivoSolicitacao, Municipio } from 'app/shared/models/entidades';
import { DocumentoTipoProcesso } from 'app/shared/models/entidades';
import { isUndefinedNullOrEmpty, somenteNumeros } from 'app/shared/constantes';
import { TipoDeficiencia } from 'app/shared/models/comum/tipo-deficiencia';
import { TipoDependente } from 'app/shared/models/comum/tipo-dependente';
import { ReciboModel } from 'app/funcionalidades/dependente/models/recibo-form.model';
import { ComplementoDependenteFormModel } from 'app/funcionalidades/dependente/models/complemento-dependente.form.model';
import { DadosDependenteFormModel } from 'app/funcionalidades/dependente/models/dados-dependente-form.model';
import { BeneficiarioDependenteFormModel } from 'app/funcionalidades/dependente/models/beneficiario-dependente-form.model';
import { AscValidators } from 'app/shared/validators/asc-validators';
import { BaseComponent } from 'app/shared/components/base.component';
import {SelectItem} from "primeng/api";
import { DadoComboDTO } from 'app/shared/models/dtos';
import { Util } from 'app/arquitetura/shared/util/util';
import { AscStepperComponent } from 'app/shared/components/asc-stepper/asc-stepper/asc-stepper.component';
import { ContatoEnderecoFormModel } from '../models/contato-endereco-form-model';

@Component({
    selector: 'asc-etapa-resumo-titular',
    templateUrl: './etapa-resumo-titular.component.html',
    styleUrls: ['./etapa-resumo-titular.component.scss'],
    animations: [...fadeAnimation],
})
export class EtapaResumoTitularComponent extends BaseComponent implements OnInit, OnDestroy {
   
    @Input() beneficiarioDependente: BeneficiarioDependenteFormModel;
    @Input() dadoDependente: DadosDependenteFormModel;
    @Input() complementoDependente: ComplementoDependenteFormModel;
    @Input() stepper: AscStepperComponent;
    @Input() tipoDeficiencia: TipoDeficiencia;
    @Input() tipoDependente: TipoDependente;
    @Input() estadoCivil: EstadoCivil;
    @Input() beneficiario: Beneficiario;
    @Input() motivoSolicitacao: MotivoSolicitacao;
    @Input() idTipoProcessoResumo = 0;
    @Input() municipio: Municipio;
    @Input() estado: DadoComboDTO;
    
    @Input() contatoEndereco: ContatoEnderecoFormModel;

    @Output() reiniciarEvent = new EventEmitter<void>();
    @Output() processoEnviadoEvent = new EventEmitter<ReciboModel>();

    estadoAlterar: DadoComboDTO;
    showModal: boolean = false;
    estadoCivilAlterar: EstadoCivil;
    tipoDeficienciaAlterar: TipoDeficiencia;
    municipioAlt: Municipio;
    campoMunicipio = new FormControl(null);

    readonly sexos: SelectItem[] = [{
        value: 'M',
        label: "Masculino"
    }, {
        value: 'F',
        label: "Feminino"
    }];

    documentoSelecionadoControl = new FormControl();
    documentosCadastrados: DocumentoTipoProcesso[];
    tipoDeficiencias: TipoDeficiencia[];
    showProgress = false;
    documentoNaoPossuiArquivos = true;

    isEditingBeneficiario = false;
    isEditingDadosBasicos = false;
    isEditingDadosComplementos = false;
    isEditingDadosContato = false;
    isEditingDadosEndereco = false;
    cpfRequired = false;

    private readonly subjecUnsubscribe = new Subject();
    private _arquivos: any | Set<Arquivo> | Arquivo[];
    private indexSelecionado = 0;

    readonly formularioSolicitacao = new FormGroup({
        informacaoAdicional: new FormControl(null),
    });

    get showMatricula(): boolean {
        return this.tipoDependente && this.tipoDependente.id == 86;
    }

    get nomeSexo(): string {
        if (this.beneficiarioDependente) {
            const s = this.sexos.find(sexo => sexo.value == this.beneficiarioDependente.sexo.value);
            return s ? s.label : null;
        }
        return null;
    }

    get descricaoEstadoCivil(): string {
        if (this.estadoCivil) {
            return this.estadoCivil.descricao;
        } else {
            return this.beneficiario ? this.beneficiario.estadoCivil.descricao : null;
        }
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    readonly formularioBeneficiario = new FormGroup({
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
        idEstadoCivil: new FormControl(null)
    });

    readonly formularioDadosComplementares:any = new FormGroup({
        rg: new FormControl(null, AscValidators.somenteAlfaNumericos()),
        orgaoEmissor: new FormControl(null),
        dataExpedicaoRg: new FormControl(null, AscValidators.dataMenorIgualAtual),
        estado: new FormControl(null),
        municipio: this.campoMunicipio,
        idTipoDeficiencia: new FormControl(null),
        cartaoNacionalSaude: new FormControl(null, AscValidators.somenteNumeros()),
        cartaoUnimed: new FormControl(null, AscValidators.somenteNumeros()),
        renda: new FormControl(null)
    });

    readonly formularioDadosContato = new FormGroup({
        telefone: new FormControl(null),
        email: new FormControl(null)
    });

    readonly formularioDadosEndereco = new FormGroup({
        cep: new FormControl(null),
        logradouro: new FormControl(null),
        numero: new FormControl(null),
        complemento: new FormControl(null),
        bairro: new FormControl(null),
        estado: new FormControl(null),
        municipio: new FormControl(null)
    });

    readonly matricula = SessaoService.usuario.matriculaFuncional;

    constructor(
        override readonly messageService: MessageService,
        private readonly service: InscricaoDependenteService,
        private readonly tipoDeficienciaService: TipoDeficienciaService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService)
        this.getTipoDeficiencia();
    }

    getTipoDeficiencia() {
        this.tipoDeficienciaService.consultarTodos().subscribe(
            result => {
                this.tipoDeficiencias = [{descricao: 'Selecione', id: null, codigo: null}];
                result.forEach(item => this.tipoDeficiencias.push(item));
                console.log(this.tipoDeficiencias);
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
        this.tipoDeficienciaAlterar = this.tipoDeficiencia;

        if (this.constantes.isUndefinedNullOrEmpty(this.complementoDependente)) {
            this.formularioDadosComplementares.patchValue({
                rg: this.complementoDependente.rg,
                orgaoEmissor: this.complementoDependente.orgaoEmissor,
                dataExpedicaoRg: this.complementoDependente.dataExpedicaoRg,
                estado: this.complementoDependente.estado,
                municipio: this.municipio,
                idTipoDeficiencia: this.tipoDeficiencia,
                cartaoNacionalSaude: this.complementoDependente.cartaoNacionalSaude,
                cartaoUnimed: this.complementoDependente.cartaoUnimed,
                renda: this.complementoDependente.renda,
                emailDependente: this.complementoDependente.emailDependente,
            });
        }
    }

    setMunicipio(dados: Municipio[]) {
        if (this.municipio != null && dados.find(m => m.id === this.municipio.id)) {
            this.campoMunicipio.setValue(this.municipio.id);
        } else {
            this.campoMunicipio.reset();
        }
    }

    salvarDadosComplementos() {
        this.isEditingDadosComplementos = false;
        this.complementoDependente.rg = this.formularioDadosComplementares.get('rg').value;
        this.complementoDependente.orgaoEmissor = this.formularioDadosComplementares.get('orgaoEmissor').value;
        this.complementoDependente.dataExpedicaoRg = this.formularioDadosComplementares.get('dataExpedicaoRg').value;
        this.tipoDeficiencia = this.tipoDeficienciaAlterar;
        this.estado = this.estadoAlterar;
        this.complementoDependente.estado = this.estado ? this.estado.value : null;
        this.complementoDependente.cartaoNacionalSaude = this.formularioDadosComplementares.get('cartaoNacionalSaude').value;
        this.complementoDependente.cartaoUnimed = this.formularioDadosComplementares.get('cartaoUnimed').value;
        this.complementoDependente.renda = this.formularioDadosComplementares.get('renda').value;
        this.municipio = this.municipioAlt;
    }

    cancelarAlterarDadosBasicos() {
        this.isEditingDadosBasicos = false;
        this.formularioDadosBasicos.reset();
    }

    alterarDadosBasicos() {
        this.isEditingDadosBasicos = true;
        if (this.beneficiarioDependente) {
            this.formularioDadosBasicos.setValue({
                nomeCompleto: this.beneficiarioDependente.nomeCompleto,
                cpf: this.beneficiarioDependente.cpf,
                dataNascimento: this.beneficiarioDependente.dataNascimento,
                nomeMae: this.beneficiarioDependente.nomeMae,
                sexo: this.beneficiarioDependente.sexo,
                nomePai: this.beneficiarioDependente.nomePai,
                idEstadoCivil: this.beneficiarioDependente.estadoCivil,
            });
            this.estadoCivilAlterar = this.estadoCivil;
        }
        this.validDataNascimento();
    }

    alterarDadosContato() {
        this.isEditingDadosContato = true;
        if (this.contatoEndereco) {
            this.formularioDadosContato.setValue({
                telefone: this.contatoEndereco.telefone,
                email: this.contatoEndereco.email
            });
        }
    }

    salvarDadosContatos() {
        this.isEditingDadosContato = false;
        this.contatoEndereco.telefone = this.formularioDadosContato.get("telefone").value;
        this.contatoEndereco.email = this.formularioDadosContato.get("email").value;
    }

    cancelarAlterarDadosContato() {
        this.isEditingDadosContato = false;
        this.formularioDadosContato.reset();
    }

    salvarDadosBasicos() {
        this.isEditingDadosBasicos = false;
        this.beneficiarioDependente.nomeCompleto = this.formularioDadosBasicos.get('nomeCompleto').value;
        this.beneficiarioDependente.cpf = this.formularioDadosBasicos.get('cpf').value;
        this.beneficiarioDependente.dataNascimento = this.formularioDadosBasicos.get('dataNascimento').value;
        this.beneficiarioDependente.sexo = this.formularioDadosBasicos.get('sexo').value;
        this.beneficiarioDependente.nomeMae = this.formularioDadosBasicos.get('nomeMae').value;
        this.beneficiarioDependente.nomePai = this.formularioDadosBasicos.get('nomePai').value;
        this.estadoCivil = this.estadoCivilAlterar;
        this.beneficiarioDependente.estadoCivil = this.estadoCivil ? this.estadoCivil.id : null;
    }

    cancelarAlterarBeneficiarios() {
        this.isEditingBeneficiario = false;
        this.formularioBeneficiario.reset();
    }

    salvarBeneficiarios() {
        this.isEditingBeneficiario = false;
        this.beneficiarioDependente.email = this.formularioBeneficiario.get('email').value;
        this.beneficiarioDependente.telefoneContato = this.formularioBeneficiario.get('telefoneContato').value;
    }

    validDataNascimento() {
        const dataNascimento = Util.getDate(this.formularioDadosBasicos.get('dataNascimento').value);
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
        }
    }

    onSubmit() {
        if (!this.showProgress) {
            this.showProgress = true;
            const formData = new FormData();
            let pedidoDependente = {
                idMunicipioNaturalidade: this.municipio ? this.municipio.id : null,
                idEstadoNaturalidade: this.complementoDependente ? this.complementoDependente.estado : null,
                idBeneficiario: this.beneficiario ? this.beneficiario.id : null,
                idTipoProcesso: this.idTipoProcessoResumo,
                idTipoBeneficiario: this.beneficiarioDependente.idTipoBeneficiario,
                idEstadoCivil: this.beneficiarioDependente.estadoCivil,
                idTipoDeficienca: this.tipoDeficiencia ? this.tipoDeficiencia.id : null,
                nomeDependente: this.beneficiarioDependente.nomeCompleto,
                cpfDependente: this.beneficiarioDependente.cpf,
                nomeMaeDependente: this.beneficiarioDependente.nomeMae,
                nomePaiDependente: this.beneficiarioDependente.nomePai,
                dataNascimento: this.beneficiarioDependente.dataNascimento,
                sexoDependente: this.beneficiarioDependente.sexo.value,
                rg: this.complementoDependente.rg,
                rgOrgaoEmissor: this.complementoDependente.orgaoEmissor,
                dataExpedicaoRg: this.complementoDependente.dataExpedicaoRg,
                cartaoNacionalSaude: this.complementoDependente.cartaoNacionalSaude,
                cartaoDependete: this.complementoDependente.cartaoUnimed,
                valorRenda: this.complementoDependente.renda,
                email: this.beneficiarioDependente.email,
                telefone: somenteNumeros(this.beneficiarioDependente.telefoneContato),
                idMotivoSolicitacao: this.beneficiarioDependente.idMotivoSolicitacao,
                dsInfoAdicional: this.formularioSolicitacao.get('informacaoAdicional').value,
                coTelefoneTitular: somenteNumeros(this.contatoEndereco.telefone),
                coCepTitular: this.contatoEndereco.cep,
                deLogradouroTitular: this.contatoEndereco.logradouro,
                deComplementoTitular: this.contatoEndereco.complemento,
                noBairroTitular: this.contatoEndereco.bairro,
                nuEnderecoTitular: this.contatoEndereco.numero,
                nuMunicipioEnderecoTitular: this.contatoEndereco.municipio,
                nuEstadoEnderecoTitular: this.contatoEndereco.estado,
                estado: this.contatoEndereco.estado,
                deEmailTitular: this.contatoEndereco.email,
                matricula:  SessaoService.getMatriculaFuncional()

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
            ).subscribe(res => this.processoEnviadoEvent.emit(res), () => {
                this.showProgress = false;
                this.messageService.addMsgDanger('Um erro aconteceu. Por favor, entre em contato com o administrador');
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

    tipoDeficienciaSelecionado(event) {
        if (event.value.id == null) {
            this.tipoDeficienciaAlterar = null;
        } else {
            this.tipoDeficienciaAlterar = event.value;
        }
    }

    selectUf(estado: DadoComboDTO): void {
        this.estadoAlterar = estado;
        if (estado) {
            this.formularioDadosComplementares.get('municipio').setValidators(Validators.required);
        } else {
            this.formularioDadosComplementares.get('municipio').clearValidators();
        }
        this.formularioDadosComplementares.get('municipio').reset();
        this.formularioDadosComplementares.get('municipio').updateValueAndValidity();
    }

    selectMunicipio(municipio: Municipio): void {
        this.municipioAlt = municipio;
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

    get rgRequired(): boolean {
        return this.formularioDadosComplementares.get('rg').value || this.formularioDadosComplementares.get('orgaoEmissor').value
            || this.formularioDadosComplementares.get('dataExpedicaoRg').value
    }
}
