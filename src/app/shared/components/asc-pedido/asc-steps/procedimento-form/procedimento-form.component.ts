import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AscSelectComponentProcedimentosParams} from '../../../asc-select/models/asc-select-component-procedimentos.params';
import {TipoAcaoProcedimentoEngine} from '../../../asc-select/models/tipo-acao-procedimento-engine';
import {Procedimento} from '../../../../models/comum/procedimento';
import {FormBuilder, FormGroupDirective} from '@angular/forms';
import {PedidoProcedimento} from '../../../../models/comum/pedido-procedimento';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, takeUntil, tap} from 'rxjs/operators';
import {AscSelectGrausProcedimentoParams} from '../../../asc-select/models/asc-select-graus-procedimento.params';
import {GrauProcedimento} from '../../../../models/comum/grau-procedimento';
import {
    aplicarAcaoQuandoFormularioValido,
    isNotUndefinedNullOrEmpty,
    isNotUndefinedOrNull,
    isUndefinedNullOrEmpty
} from '../../../../constantes';
import {PedidoProcedimentoFormModel} from '../../models/pedido-procedimento-form.model';
import {BaseComponent} from '../../../../../../app/shared/components/base.component';
import {ObjectUtils} from '../../../../util/object-utils';
import {MessageService} from '../../../../../../app/shared/components/messages/message.service';
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {AscSelectAutorizacaoPreviaParams} from "../../../asc-select/models/asc-select-autorizacao-previa-params";
import {Beneficiario, Patologia, Pedido} from "../../../../models/entidades";
import {AscSelectEspecialidadeParam} from "../../../asc-select/models/asc-select-especialidade.param";
import {Especialidade} from "../../../../models/credenciados/especialidade";
import {FormUtil} from "../../../../util/form-util";
import {AscSelectMedicamentoParam} from "../../../asc-select/models/asc-select-medicamento.param";
import {Medicamento} from "../../../../models/comum/medicamento";
import {Laboratorio} from '../../../../models/credenciados/laboratorio';
import {of} from "rxjs";
import {fadeAnimation} from "../../../../animations/faded.animation";
import {inOutAnimation} from "../../../../animations/inOutAnimation.animation";
import {Config, profileComponent} from "../../asc-tipo-procedimento-form/models/asc-tipo-formulario-settings";
import {HttpUtil} from "../../../../util/http-util";
import {MedicamentoPatologiaPedido} from "../../../../models/comum/medicamento-patologia-pedido";
import {MedicamentoPatologiaPedidoService} from "../../../../services/comum/medicamento-patologia-pedido.service";
import {AscFormularioReembolsoOdontologicoComponent} from "../../asc-tipo-procedimento-form/asc-formulario-reembolso-odontologico/asc-formulario-reembolso-odontologico.component";
import {AscFormularioReembolsoVacinaComponent} from "../../asc-tipo-procedimento-form/asc-formulario-reembolso-vacina/asc-formulario-reembolso-vacina.component";
import {AscFormularioReembolsoMedicamentoComponent} from "../../asc-tipo-procedimento-form/asc-formulario-reembolso-medicamento/asc-formulario-reembolso-medicamento.component";
import {AscFormularioProcedimentoBase} from "../../asc-tipo-procedimento-form/models/asc-formulario-procedimento-base";
import {AscReembolsoAssistencialComponent} from "../../asc-tipo-procedimento-form/asc-reembolso-assistencial/asc-reembolso-assistencial.component";
import {NumberUtil} from "../../../../util/number-util";
import { Observable } from 'rxjs';
import { ProcedimentoPedidoService } from 'app/shared/services/comum/procedimento-pedido.service';
import { AutorizacaoPreviaService } from 'app/shared/services/comum/pedido/autorizacao-previa.service';
import { SessaoService } from 'app/shared/services/services';

@Component({
    selector: 'asc-procedimento-form',
    templateUrl: './procedimento-form.component.html',
    styleUrls: ['./procedimento-form.component.scss'],
    animations: [...fadeAnimation, ...inOutAnimation]
})
export class ProcedimentoFormComponent extends BaseComponent implements OnInit, OnDestroy {

    @Input() showButtonResumo = false;
    @Input() isToShowButtons = true;
    @Input() idTipoProcesso: number;
    @Input() idBeneficiario: number
    @Input() beneficiario: Beneficiario;
    @Input() enableAllAction = true;
    @Input() loading = false;
    @Input() pedido: Pedido;
    @Input() isToClean: boolean;
    @Input() isEditing = false;
    @Input() limparForm: boolean = false;
    
    _idMotivoSolicitacao : number;

    resultDataAtendimento: number;

    @Input("idMotivoSolicitacao")
    set idMotivoSolicitacao(idMotivoSolicitacao: number) {
        this._idMotivoSolicitacao = idMotivoSolicitacao;
    }

    get idMotivoSolicitacao() : number{
        return this._idMotivoSolicitacao;
    }

    @Output() readonly procedimento = new EventEmitter<Procedimento>();
    @Output() readonly grauSelecionado = new EventEmitter<GrauProcedimento>();
    @Output() readonly regiaoOdontologica = new EventEmitter<GrauProcedimento>();
    @Output() readonly pedidoProcedimentos = new EventEmitter<PedidoProcedimento[]>();

    @Output() readonly pedidoProcedimentoForm = new EventEmitter<PedidoProcedimento>();
    @Output() readonly isToShowPanel = new EventEmitter<boolean>();
    @Output() readonly cancelarProcedimento = new EventEmitter();
    @Output() readonly isEditingForm = new EventEmitter<boolean>();
    @Output() readonly pedidoAutorizacaoPreviaSelecionado = new EventEmitter<Pedido>();
    @Output() readonly especialidade = new EventEmitter<Especialidade>();
    @Output() readonly especialidades = new EventEmitter<Especialidade[]>();
    @Output() readonly laboratorio = new EventEmitter<Laboratorio>();
    @Output() readonly loading$ = new EventEmitter<boolean>();
    @Output() readonly formValid = new EventEmitter<boolean>();

    @Output() readonly laboratorios = new EventEmitter<Laboratorio[]>();
    isToShowForm = false;
    grauSelecionadoAsObject: GrauProcedimento;
    regiaoOdontologicaAsObject: GrauProcedimento;
    procedimentoAsObject: Procedimento;
    pedidoAutorizacaoAsObject: Pedido;
    laboratorioAsObject: Laboratorio;
    especialidadeAsObject: Especialidade;
    formSettings: Config;
    readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO = TipoAcaoProcedimentoEngine
        .CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO;
    displayDataDoAtendimento = false;
    readonly form = this.formBuilder.group({
        id: [null],
        idProcedimento: [null],
        idGrauProcedimento: [null],
        qtdSolicitada: [null],
        dataAtendimento: [null],
        valorUnitarioPago: [null],
        idAutorizacaoPrevia: [null],
        idLaboratorio: [null],
        idVacina: [null],
        idEspecialidade: [null],
        idRegiaoOdontologica: [null],
        idPatologia: [null],
        idMedicamento: [null],
        codigoMedicamento: [null],
        dosagemMedicamento: [null],
        diasAtendidosPelaQuantidade: [null],
        tsOperacao: [new Date()],
        index: [null],
    });
    parametrosSelectGrauProcedimento: AscSelectGrausProcedimentoParams;
    autorizacaoPreviaParams: AscSelectAutorizacaoPreviaParams;
    especialidadeParams: AscSelectEspecialidadeParam;
    medicamentoParam: AscSelectMedicamentoParam = {};
    medicamentoApresentacaoParam: AscSelectMedicamentoParam = {};
    disableButtonAdicionarProcedimento = true;
    displayValorUnitarioPago = false;
    displayQuantidadeSolicitada = false;
    isTipoProcessoReembolso = false;
    isTipoProcessoReembolsoAssistencial = false;
    isTipoProcessoReembolsoMedicamento = false;
    isTipoProcessoReembolsoOdontologico = false;
    isTipoProcessoReembolsoVacina = false;
    patologia: Patologia;
    pedidoProcedimento: PedidoProcedimentoFormModel;

    private medicamentoApresentacao: Medicamento;
    private autorizacaoPrevias: Pedido[] = [];
    private readonly subjectUnsubscription = new Subject<void>();

    constructor(
        private readonly formBuilder: FormBuilder,
        messageService: MessageService,
        private readonly procedimentoPedidoService: ProcedimentoPedidoService,
        private readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected readonly autorizacaoPreviaService?: AutorizacaoPreviaService
    ) {
        super(messageService);
    }

    _parametroSelectProcedimento: AscSelectComponentProcedimentosParams;

    get parametroSelectProcedimento() {
        return this._parametroSelectProcedimento;
    }

    @Input() set parametroSelectProcedimento(
        parametroSelectProcedimento: AscSelectComponentProcedimentosParams
    ) {
        this._parametroSelectProcedimento = parametroSelectProcedimento;
        this.isTipoProcessoReembolso = this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_CONSULTA;
        this.isTipoProcessoReembolsoAssistencial = this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL;
        this.isTipoProcessoReembolsoMedicamento = this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO;
        this.isTipoProcessoReembolsoOdontologico = this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO;
        this.isTipoProcessoReembolsoVacina = this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_VACINA;
        this.profile = profileComponent[parametroSelectProcedimento.idTipoProcesso]
    }

    @Input()
    set pedidoProcedimentoFormInput(pedidoProcedimento: PedidoProcedimentoFormModel) {
        if (pedidoProcedimento) {
            this.pedidoProcedimento = this.cleanAllPropertyUndefined(pedidoProcedimento);
            this.isToShowForm = true;
            this.parametrosSelectGrauProcedimento = {
                idProcedimento: this.pedidoProcedimento.idProcedimento
            } as AscSelectGrausProcedimentoParams;

            this.medicamentoParam = {
                laboratorioId: this.pedidoProcedimento.idLaboratorio,
                medicamentoId: this.pedidoProcedimento.idMedicamento
            } as AscSelectMedicamentoParam;

            this.patologia = {
                id: this.pedidoProcedimento.idPatologia,
                codigo: null
            } as Patologia;

            this.medicamentoApresentacaoParam = {
                laboratorioId: this.pedidoProcedimento.idLaboratorio,
                medicamentoId: this.pedidoProcedimento.idMedicamento
            } as AscSelectMedicamentoParam;

            this.updateAndValidateform(this.pedidoProcedimento);

            this.isEditing = isNotUndefinedOrNull(pedidoProcedimento.index);
            this.isEditingForm.emit(this.isEditing);
        }
    }

    set isToResetForm(reset: boolean) {
        if (reset) {
            this.resetarForm();
        }
    }

    @Input()
    set autorizacaoPreviaParam(autorizacaoPreviaParam: AscSelectAutorizacaoPreviaParams) {
        this.autorizacaoPreviaParams = autorizacaoPreviaParam
    }

    get parametroSelectPatologia() {
        return {
            codigoBeneficiario: SessaoService.usuario.matriculaFuncional
        }
    }

    @Input()
    set profile(config: Config) {
        if (isNotUndefinedOrNull(config)) {
            this.formSettings = config;
            this.displayQuantidadeSolicitada = true;
            this.displayValorUnitarioPago = true;
            this.displayDataDoAtendimento = true;
            FormUtil.registrarPropriedadesDoFormulario(this.formSettings, this.form)
        }
    }

    ngOnInit() {
        this.exibirFormularioComBaseNoIdProcedimento();
        this.bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido();
        this.gerenciarExibicaoDoCampoDataDoAtendimento();
        this.limparControlsSelectQuandoNaoPossuirValores();
    }

    override ngOnDestroy(): void {
        this.isToShowForm = false;
        this.isToShowPanel.emit(this.isToShowForm);
        this.subjectUnsubscription.next();
        this.subjectUnsubscription.complete();
    }

    enableWhenDirtyOrTouchedAndValid(controlName: string): boolean {
        return FormUtil.isValidAndTouchedOrDirty(this.form, controlName);
    }

    grauProcedimentoSelecionado(grauProcedimentoSelecionado?: GrauProcedimento) {
        this.grauSelecionadoAsObject = grauProcedimentoSelecionado;
        this.grauSelecionado.emit(grauProcedimentoSelecionado);
    }

    @ViewChild("formularioReembolsoAssistencial")
    ascFormularioReembolsoAssistencial: AscReembolsoAssistencialComponent;

    @ViewChild("formularioReembolsoOdontologico")
    ascformularioReembolsoOdontologico: AscFormularioReembolsoOdontologicoComponent;

    @ViewChild("formularioReembolsoVacinaComponent")
    ascFormularioReembolsoVacinaComponent: AscFormularioReembolsoVacinaComponent;

    @ViewChild("formularioReembolsoMedicamentoComponent")
    ascFormularioReembolsoMedicamentoComponent: AscFormularioReembolsoMedicamentoComponent;

    salvarFormulario() {
        let formularioBase: AscFormularioProcedimentoBase = null;

        if (this.isTipoProcessoReembolsoAssistencial) {
            formularioBase = this.ascFormularioReembolsoAssistencial;
        } else if (this.isTipoProcessoReembolsoOdontologico) {
            formularioBase = this.ascformularioReembolsoOdontologico;
        } else if (this.isTipoProcessoReembolsoVacina) {
            formularioBase = this.ascFormularioReembolsoVacinaComponent;
        } else if (this.isTipoProcessoReembolsoMedicamento) {
            formularioBase = this.ascFormularioReembolsoMedicamentoComponent;
        }

        if (formularioBase) {
            formularioBase.pedido = this.pedido;
            formularioBase.salvarFormularioExterno();
        }
    }

    adicionarProcedimento(formDirective: FormGroupDirective, $event: MouseEvent): void {
        aplicarAcaoQuandoFormularioValido(this.form, () => {
            const pedidoProcedimento = this.form.value as PedidoProcedimento;
            if (!pedidoProcedimento.grauProcedimento) pedidoProcedimento.grauProcedimento = this.grauSelecionadoAsObject;
            if (!pedidoProcedimento.regiaoOdontologica) pedidoProcedimento.regiaoOdontologica = this.regiaoOdontologicaAsObject;
            if (!pedidoProcedimento.procedimento) pedidoProcedimento.procedimento = this.procedimentoAsObject;
            if (!pedidoProcedimento.pedido) pedidoProcedimento.pedido = this.pedidoAutorizacaoAsObject;
            if (!pedidoProcedimento.laboratorio) pedidoProcedimento.laboratorio = this.laboratorioAsObject;
            if (!pedidoProcedimento.medicamento) pedidoProcedimento.medicamento = this.medicamentoApresentacao;
            if (!pedidoProcedimento.especialidade) pedidoProcedimento.especialidade = this.especialidadeAsObject;
            if (!pedidoProcedimento.patologia) pedidoProcedimento.patologia = this.patologia;
            this.pedidoProcedimentoForm.emit(pedidoProcedimento);
            this.isToShowForm = true;
            this.isEditing = false;
            this.isEditingForm.emit(this.isEditing);
            formDirective.resetForm();
            this.resetarForm();
            $event.preventDefault();
        });
    }

    isTipoProcessoOdontologico() {
        return this.parametroSelectProcedimento &&
            this.parametroSelectProcedimento.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    clickButtonCancelarProcedimento(formDirective: FormGroupDirective, $event: MouseEvent) {
        formDirective.resetForm();
        this.resetarForm();
        this.isEditing = false;
        this.isEditingForm.emit(this.isEditing)
        this.cancelarProcedimento.emit();
        this.displayValorUnitarioPago = false;
        this.displayQuantidadeSolicitada = false
        $event.preventDefault()
    }

    buttonCancelarProcedimento() {
        this.isEditing = false;
        this.isEditingForm.emit(this.isEditing)
        this.cancelarProcedimento.emit();
    }

    especialidadeSelecionado(especialidade: Especialidade) {
        this.especialidadeAsObject = especialidade;
        this.especialidade.emit(especialidade)
    }

    especialidadesSelecionados(especialidades: Especialidade[]) {
        this.especialidades.emit(especialidades)
    }

    patologiaSelecionado(patologia: Patologia): void {
        this.patologia = patologia;
    }

    cleanAllPropertyUndefined(pedidoProcedimento: PedidoProcedimentoFormModel): PedidoProcedimentoFormModel {
        return Object.keys(pedidoProcedimento).reduce((acc, currentKey) => ({
            ...acc,
            [currentKey]: pedidoProcedimento[currentKey]
        }), {}) as PedidoProcedimento;
    }

    adicionaProcedimentoDoFormulario(pedidoProcedimento: PedidoProcedimento) {
        this.loading = true;
        this.loading$.emit(this.loading);

        this.salvarPedidoProcedimentoOuMedicamento(pedidoProcedimento).subscribe((pedido: PedidoProcedimento) => {
            this.loading = false;
            this.loading$.emit(this.loading);
            this.isEditing = false;
            this.isEditingForm.emit(this.isEditing);
            this.pedidoProcedimentoForm.emit({...pedido, ...pedidoProcedimento});
        }, () => {
            this.loading = false;
            this.loading$.emit(this.loading);
        });
    }

    estaEditandoFormulario($event: boolean) {
        this.isToShowForm = $event;
    }
    

    formularioValido(event: boolean): void {
        this.formValid.emit(event);
    }

    private atualizarParametrosDoCampoDeBuscaDeAutorizacaoPrevia() {
        return (value) => {
            if (this.formSettings && this.formSettings.idAutorizacaoPrevia && this.formSettings.idAutorizacaoPrevia.display) {
                this.extraValueFromIdProcedimentoByFormSettings('idAutorizacaoPrevia', () => {
                    this.autorizacaoPreviaParams = {
                        idProcedimento: Number(value),
                        idBeneficiario: this.idBeneficiario || this.autorizacaoPreviaParams.idBeneficiario
                    }
                    this.enableFieldAutorizacaoPrevia();
                })
            }
        }
    }

    private enableFieldAutorizacaoPrevia() {
        const idAutorizacaoPreviaControl = this.form.get('idAutorizacaoPrevia');
        idAutorizacaoPreviaControl.markAsTouched()
        idAutorizacaoPreviaControl.markAsDirty()
        idAutorizacaoPreviaControl.updateValueAndValidity()
    }

    private naoExibirCampos(value) {
        if (isUndefinedNullOrEmpty(value)) {
            this.displayValorUnitarioPago = false;
            this.displayQuantidadeSolicitada = false
        }
    }

    private cleanControIdGrauProcedimentoFromControl() {
        const idGrauProcedimento = this.form.get('idGrauProcedimento');
        idGrauProcedimento.reset();
        idGrauProcedimento.markAsUntouched();
        idGrauProcedimento.markAsPristine();
        if (this.isEditing && this.pedidoProcedimento.idGrauProcedimento) {
            idGrauProcedimento.setValue(this.pedidoProcedimento.idGrauProcedimento)
            this.pedidoProcedimento.idGrauProcedimento = null;
        }
    }

    private bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido() {
        this.form.get('idGrauProcedimento').statusChanges
        .pipe(takeUntil(this.subjectUnsubscription))
        .subscribe(status => {
            this.disableButtonAdicionarProcedimento = status === 'INVALID';
        });
    }

    private exibirFormularioEhPainel() {
        this.isToShowForm = true;
        this.isToShowPanel.emit(this.isToShowForm);
    }

    private exibirFormularioComBaseNoIdProcedimento() {
        this.form.get('idProcedimento').valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(this.atualizarParametrosDoCampoDeBuscaDeAutorizacaoPrevia()),
            tap(this.atualizarParametrosParaGrauProcedimento()),
            tap(this.atualizarParametroParaCampoEspecialidade()),
            tap(() => this.exibirFormularioEhPainel()),
            tap(value => this.naoExibirCampos(value)),
            takeUntil(this.subjectUnsubscription),
            tap(() => this.cleanControIdGrauProcedimentoFromControl())
        ).subscribe();
    }

    private updateAndValidateform(pedidoProcedimento: PedidoProcedimentoFormModel) {
        this.pedidoProcedimento = pedidoProcedimento;
        Object.keys(pedidoProcedimento).forEach(key => {
            let campo = this.form.get(key);
            if (campo) {
                campo.setValue(pedidoProcedimento[key]);
            }
        });

        this.form.markAsTouched();
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
    }

    private resetarForm() {
        if (this.formSettings) {
            FormUtil.limparTodosFormControls(this.formSettings, this.form);
            this.form.reset();
            this.form.controls['tsOperacao'].setValue(new Date());
        }

    }

    private gerenciarExibicaoDoCampoDataDoAtendimento(): void {
        const valorUnitarioPagoControl = this.form.get('valorUnitarioPago');
        valorUnitarioPagoControl.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(100),
            takeUntil(this.subjectUnsubscription)
        ).subscribe((value: string) => {
            this.displayDataDoAtendimento = !!(value && value.length);
        })
    }

    private atualizarParametrosParaGrauProcedimento() {
        return (idProcedimento: number) => {
            this.extraValueFromIdProcedimentoByFormSettings('idGrauProcedimento', () => {
                this.parametrosSelectGrauProcedimento = {idProcedimento};
            })
        };
    }

    private extraValueFromIdProcedimentoByFormSettings(key: string, action: () => void): void {
        if (this.formSettings) {
            const value = ObjectUtils.readValueFromPossibilityEmpty(() => this.formSettings[key].display);
            if (isNotUndefinedOrNull(value)) {
                action()
            }
        }
    }

    private atualizarParametroParaCampoEspecialidade() {
        return (idProcedimento: number) => {
            this.extraValueFromIdProcedimentoByFormSettings('idEspecialidade', () => {
                this.especialidadeParams = {idProcedimento};
            })
        };
    }

    private limparControlsSelectQuandoNaoPossuirValores() {
        const idAutorizacaoPreviaControl = this.form.get('idAutorizacaoPrevia');
        idAutorizacaoPreviaControl.statusChanges.pipe(
            filter(status => status === 'INVALID'),
            filter(() => isNotUndefinedNullOrEmpty(this.autorizacaoPrevias)),
            tap(() => idAutorizacaoPreviaControl.clearValidators()),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    private salvarPedidoProcedimentoOuMedicamento(pedidoProcedimento: PedidoProcedimento) {
        if (this.pedido) {
            return this.definirServiceoParaIncluirOuAtualizarPedidoProcedimentoOUMedicamentoPatologia(pedidoProcedimento).pipe(
                HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService)
            )
        }
        return of({});
    }

    private definirServiceoParaIncluirOuAtualizarPedidoProcedimentoOUMedicamentoPatologia(
        pedidoProcedimento: PedidoProcedimento | MedicamentoPatologiaPedido | any
    ) {
        const resultado = this.carregarAutorizacoesComDataAtentimentoValida(pedidoProcedimento);
        if(resultado !== null && resultado !== undefined) {
            resultado.subscribe(
                value => {
                    this.resultDataAtendimento = value;
                    if(this.resultDataAtendimento !== null && this.resultDataAtendimento !== undefined) {
                        this.messageService.addMsgDanger("Data de atendimento posterior à validade da autorização prévia selecionada.");
                    }
                });
        }

        if (this.pedido && this.pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            const medicamentoPatologiaPedido = {
                ...pedidoProcedimento,
                idPedido: this.pedido.id
            } as MedicamentoPatologiaPedido;
            medicamentoPatologiaPedido.qtdMedicamento = pedidoProcedimento.qtdSolicitada;
            medicamentoPatologiaPedido.qtdDiasAtendidosPeloMedicamento = pedidoProcedimento.diasAtendidosPelaQuantidade;
            if (pedidoProcedimento.id) {
                this.medicamentoPatologiaPedidoService.incluir(medicamentoPatologiaPedido);
            } else {
                medicamentoPatologiaPedido.idPedido = this.pedido.id;
                return this.medicamentoPatologiaPedidoService.atualizar(medicamentoPatologiaPedido);
            }
        }
        console.log('Aqui 5');
        console.log(pedidoProcedimento);
        return this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento({
            ...pedidoProcedimento,
            valorUnitarioPago: NumberUtil.convertStringToNumber(pedidoProcedimento.valorUnitarioPago),
            idPedido: this.pedido.id
        });
    }

    private carregarAutorizacoesComDataAtentimentoValida(pedidoProcedimento: PedidoProcedimento): Observable<any> {
        if(pedidoProcedimento.autorizacaoPrevia !== null &&
            pedidoProcedimento.autorizacaoPrevia !== undefined) {
            const dataAtendimento = pedidoProcedimento.dataAtendimento;
            const idAutorizacaoPreviaSiags = pedidoProcedimento.autorizacaoPrevia.idAutorizacaoPreviaSiags;

            return this.autorizacaoPreviaService.verificarAutorizacoesComDataAtentimentoValida(idAutorizacaoPreviaSiags,
                this.formatarData(dataAtendimento)).pipe(
                HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error'),
                tap(() => console.log(' carregarAutorizacoesComDataAtentimentoValida '))
            );
        }else {
            return of(null)
        }
    }

    private formatarData(data:Date):string{
        let dataFormatada = '';
        
        if(data) {
          const dia = ('0' + data.getUTCDate()).slice(-2);
          const mes = ('0' + (data.getUTCMonth() + 1)).slice(-2);
          const ano = data.getUTCFullYear();
          
          dataFormatada = `${ano}-${mes}-${dia}`;
        } 
        return  dataFormatada;
      }

}
