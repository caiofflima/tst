import {BaseComponent} from "../../base.component";
import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Procedimento} from "../../../models/comum/procedimento";
import {GrauProcedimento} from "../../../models/comum/grau-procedimento";
import {PedidoProcedimento} from "../../../models/comum/pedido-procedimento";
import {Pedido} from "../../../models/comum/pedido";
import {Especialidade} from "../../../models/credenciados/especialidade";
import {Laboratorio} from "../../../models/credenciados/laboratorio";
import {TipoProcessoEnum} from "../models/tipo-processo.enum";
import {Config, profileComponent} from "./models/asc-tipo-formulario-settings";
import {TipoAcaoProcedimentoEngine} from "../../asc-select/models/tipo-acao-procedimento-engine";
import {AscSelectGrausProcedimentoParams} from "../../asc-select/models/asc-select-graus-procedimento.params";
import {AscSelectAutorizacaoPreviaParams} from "../../asc-select/models/asc-select-autorizacao-previa-params";
import {AscSelectEspecialidadeParam} from "../../asc-select/models/asc-select-especialidade.param";
import {AscSelectMedicamentoParam} from "../../asc-select/models/asc-select-medicamento.param";
import {Patologia} from "../../../models/comum/patologia";
import {AscSelectComponentProcedimentosParams} from "../../asc-select/models/asc-select-component-procedimentos.params";
import {Subject} from "rxjs";
import {PedidoProcedimentoFormModel} from "../models/pedido-procedimento-form.model";
import {Medicamento} from "../../../models/comum/medicamento";
import {AbstractControl, FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import {MessageService} from "../../messages/message.service";
import {catchError, debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from "rxjs/operators";
import {FormUtil} from "../../../util/form-util";
import {
  aplicarAcaoQuandoFormularioValido,
  isNotUndefinedNullOrEmpty,
  isNotUndefinedOrNull,
  isUndefinedNullOrEmpty,
  isUndefinedOrNull
} from "../../../constantes";
import {SessaoService} from "../../../../arquitetura/shared/services/seguranca/sessao.service";
import {ObjectUtils} from "../../../util/object-utils";
import {of} from "rxjs";

@Directive()
export class AscTipoFormularioBase extends BaseComponent implements OnInit, OnDestroy {

  @Input() showButtonResumo = false;
  @Input() isToShowButtons = true;
  @Input() idBeneficiario: number
  @Input() enableAllAction = true;

  @Output() readonly procedimento = new EventEmitter<Procedimento>();
  @Output() readonly grauSelecionado = new EventEmitter<GrauProcedimento>();
  @Output() readonly regiaoOdontologica = new EventEmitter<GrauProcedimento>();
  @Output() readonly pedidoProcedimentos = new EventEmitter<PedidoProcedimento[]>();

  @Output() readonly pedidoProcedimentoForm = new EventEmitter<PedidoProcedimento>();
  @Output() readonly isToshowPanel = new EventEmitter<boolean>();
  @Output() readonly cancelarProcedimento = new EventEmitter();
  @Output() readonly isEditingForm = new EventEmitter<boolean>();
  @Output() readonly pedidoAutorizacaoPreviaSelecionado = new EventEmitter<Pedido>();
  @Output() readonly especialidade = new EventEmitter<Especialidade>();
  @Output() readonly especialidades = new EventEmitter<Especialidade[]>();
  @Output() readonly laboratorio = new EventEmitter<Laboratorio>();
  @Output() readonly laboratorios = new EventEmitter<Laboratorio[]>();

  readonly TIPO_PROCESSO_REEMBOLSO_VACINA = TipoProcessoEnum.REEMBOLSO_VACINA

  isToShowForm = false;
  grauSelecionadoAsObject: GrauProcedimento;
  regiaoOdontologicaAsObject: GrauProcedimento;

  procedimentoAsObject: Procedimento;
  pedidoAutorizacaoAsObject: Pedido;
  laboratorioAsObject: Laboratorio;
  especialidadeAsObject: Especialidade;

  formSettings: Config;

  readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO = TipoAcaoProcedimentoEngine.CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO;
  displayDataDoAtendimento = false;

  readonly form = this.formBuilder.group({
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
  isEditing = false;
  parametrosSelectGrauProcedimento: AscSelectGrausProcedimentoParams;
  autorizacaoPreviaParams: AscSelectAutorizacaoPreviaParams;
  especialidadeParams: AscSelectEspecialidadeParam;
  medicamentoParam: AscSelectMedicamentoParam = {};
  medicamentoApresentacaoParam: AscSelectMedicamentoParam = {};
  disableButtonAdicionarProcedimento = true;
  displayValorUnitarioPago = false;
  displayQuantidadeSolicitada = false;
  patologia: Patologia;
  _parametroSelectProcedimento: AscSelectComponentProcedimentosParams;
  private readonly subjectUnsubscription = new Subject<void>();
  private pedidoProcedimento: PedidoProcedimentoFormModel;
  private medicamento: Medicamento;
  private medicamentoApresentacao: Medicamento;
  private readonly managementInputform = new Subject<PedidoProcedimentoFormModel>()
  private autorizacaoPrevias: Pedido[] = [];


  constructor(
    private readonly formBuilder: FormBuilder,
    messageService: MessageService
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.exibirFormularioComBaseNoIdProcedimento();
    this.bloquearBotaoAdicionarProcedimentoQuandoGrauProcedimentoInvalido();
    this.gerenciarExibicaoDoCampoDataDoAtendimento();
    this.registrarInputForm();
    this.limparControlsSelectQuandoNaoPossuirValores();
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
    )
    .subscribe();
  }


  private atualizarParametrosDoCampoDeBuscaDeAutorizacaoPrevia() {
    return (value) => {
      if (this.formSettings.idAutorizacaoPrevia && this.formSettings.idAutorizacaoPrevia.display) {
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

  private exibirFormularioEhPainel() {
    this.isToShowForm = true;
    this.isToshowPanel.emit(this.isToShowForm);
  }

  enableWhenDirtyOrTouchedAndValid(controlName: string): boolean {
    return FormUtil.isValidAndTouchedOrDirty(this.form, controlName);

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

  grauProcedimentoCarregado(grauProcedimento: GrauProcedimento[]) {
    const idGrauProcedimentoControl = this.form.get('idGrauProcedimento');
    this.disableButtonWhenHasNoData(grauProcedimento, idGrauProcedimentoControl);
  }

  private disableButtonWhenHasNoData(grauProcedimento: GrauProcedimento[], control: AbstractControl): void {
    if (isUndefinedNullOrEmpty(grauProcedimento)) {
      this.disableButtonAdicionarProcedimento = false;
      control.clearValidators();
    } else {
      this.disableButtonAdicionarProcedimento = true;
      control.setValidators(Validators.required);
    }
    control.updateValueAndValidity();
  }

  procedimentoSelecionando(procedimento?: Procedimento) {
    if (isNotUndefinedOrNull(procedimento)) {
      this.procedimentoAsObject = procedimento;
      this.procedimento.emit(procedimento);
    }

  }

  grauProcedimentoSelecionado(grauProcedimentoSelecionado?: GrauProcedimento) {
    this.grauSelecionadoAsObject = grauProcedimentoSelecionado;
    this.grauSelecionado.emit(grauProcedimentoSelecionado);
  }

  regiaoOdontologicaSelecionada(regiaoOdontologica?: GrauProcedimento) {
    this.regiaoOdontologicaAsObject = regiaoOdontologica;
    this.regiaoOdontologica.emit(regiaoOdontologica);
  }

  override ngOnDestroy(): void {
    this.isToShowForm = false;
    this.isToshowPanel.emit(this.isToShowForm);
    this.subjectUnsubscription.next();
    this.subjectUnsubscription.complete();
  }

  adicionarProcedimento(formDirective: FormGroupDirective, $event: MouseEvent): void {
    aplicarAcaoQuandoFormularioValido(this.form, () => {
      const pedidoProcedimento = this.form.value as PedidoProcedimento;
      pedidoProcedimento.grauProcedimento = this.grauSelecionadoAsObject;
      pedidoProcedimento.regiaoOdontologica = this.regiaoOdontologicaAsObject;
      pedidoProcedimento.procedimento = this.procedimentoAsObject;
      pedidoProcedimento.pedido = this.pedidoAutorizacaoAsObject;
      pedidoProcedimento.laboratorio = this.laboratorioAsObject;
      pedidoProcedimento.medicamento = this.medicamentoApresentacao
      pedidoProcedimento.especialidade = this.especialidadeAsObject;
      pedidoProcedimento.patologia = this.patologia;
      this.pedidoProcedimentoForm.emit(pedidoProcedimento);
      this.isToShowForm = true;
      this.isEditing = false;
      this.isEditingForm.emit(this.isEditing)
      formDirective.resetForm();
      this.resetarForm();
      $event.preventDefault()
    });
  }

  @Input()
  set pedidoProcedimentoFormInput(pedidoProcedimento: PedidoProcedimentoFormModel) {
    this.managementInputform.next(pedidoProcedimento)
  }


  laboratorioSelecionado(laboratorio: Laboratorio) {
    if (isNotUndefinedOrNull(laboratorio)) {
      this.laboratorioAsObject = laboratorio;
      this.medicamentoParam = {laboratorioId: laboratorio.id}
      this.laboratorio.emit(laboratorio)
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

  @Input() set parametroSelectProcedimento(parametroSelectProcedimento: AscSelectComponentProcedimentosParams) {
    this._parametroSelectProcedimento = parametroSelectProcedimento
    this.profile = profileComponent[parametroSelectProcedimento.idTipoProcesso]
  }

  get parametroSelectProcedimento() {
    return this._parametroSelectProcedimento;
  }

  get parametroSelectPatologia() {
    return {
      codigoBeneficiario: SessaoService.usuario.matriculaFuncional
    }
  }

  private resetarForm() {
    FormUtil.limparTodosFormControls(this.formSettings, this.form)
    this.form.reset();
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


  autorizacaoPreviaSelecionado(pedido: Pedido): void {
    this.pedidoAutorizacaoAsObject = pedido;
    this.pedidoAutorizacaoPreviaSelecionado.emit(pedido);
  }

  autorizacoesPreviasSelecionados(pedidos: Pedido[]) {
    this.autorizacaoPrevias = pedidos;
    if (!pedidos || (pedidos && !pedidos.length)) {
      const idAutorizacaoPrevia = this.form.get('idAutorizacaoPrevia')
      idAutorizacaoPrevia.setValidators(null);
      idAutorizacaoPrevia.updateValueAndValidity();
    }
    this.displayValorUnitarioPago = true;
    this.displayQuantidadeSolicitada = true;
  }

  especialidadeSelecionado(especialidade: Especialidade) {
    this.especialidadeAsObject = especialidade;
    this.especialidade.emit(especialidade)
  }

  especialidadesSelecionados(especialidades: Especialidade[]) {
    this.especialidades.emit(especialidades)
  }

  medicamentoSelecionado(medicamento: Medicamento) {

    this.medicamento = medicamento;

    if (isUndefinedNullOrEmpty(medicamento)) {
      this.medicamentoApresentacaoParam = {}
    } else {
      this.medicamentoApresentacaoParam = {medicamentoId: medicamento.id}
    }

  }

  laboratoriosSelecionados(laboratorios: Laboratorio[]) {
    this.laboratorios.emit(laboratorios)
  }

  regiaoOdontologicaSelecionados(grauProcedimentos: GrauProcedimento[]): void {
    const regiaoOdontologicaControl = this.form.get('idRegiaoOdontologica');
    this.disableButtonWhenHasNoData(grauProcedimentos, regiaoOdontologicaControl)
  }

  cleanAllPropertyUndefined(pedidoProcedimento: PedidoProcedimentoFormModel): PedidoProcedimentoFormModel {
    return Object.keys(pedidoProcedimento).reduce((acc, currentKey) => {
      if (isUndefinedOrNull(pedidoProcedimento[currentKey])) {
        return {...acc, [currentKey]: null}
      }
      return {...acc, [currentKey]: pedidoProcedimento[currentKey]}
    }, {})
  }

  private updateAndValidateform(pedidoProcedimento: any) {
    this.form.setValue({...pedidoProcedimento});
    // this.form.markAsDirty();
    // this.form.markAsTouched();

    FormUtil.markAsTouchedAndDirtyEachControl(pedidoProcedimento, this.form)
    this.form.updateValueAndValidity();
  }

  private gerenciarExibicaoDoCampoDataDoAtendimento(): void {
    const valorUnitarioPagoControl = this.form.get('valorUnitarioPago');
    valorUnitarioPagoControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      takeUntil(this.subjectUnsubscription)
    ).subscribe((value: string) => {
      this.displayDataDoAtendimento = !!(value && value.length);
    });
  }

  private atualizarParametrosParaGrauProcedimento() {
    return (idProcedimento: number) => {
      this.extraValueFromIdProcedimentoByFormSettings('idGrauProcedimento', () => {
        this.parametrosSelectGrauProcedimento = {idProcedimento};
      })
    };
  }

  patologiaSelecionado(patologia: Patologia) {
    this.patologia = patologia;

  }

  private extraValueFromIdProcedimentoByFormSettings(key: string, action: () => void): void {
    const value = ObjectUtils
    .readValueFromPossibilityEmpty(() => this.formSettings[key].display);
    if (isNotUndefinedOrNull(value)) {
      action();
    }
  }

  medicamentoApresentacaoSelecionado(medicamentoApresentacao: Medicamento) {
    this.medicamentoApresentacao = medicamentoApresentacao;
  }

  private registrarInputForm() {
    const atualizarParametroGrauProcedimento = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.parametrosSelectGrauProcedimento = {
      idProcedimento: pedidoProcedimento.idProcedimento
    };

    const atualizarMedicamentoParam = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.medicamentoParam = {
      laboratorioId: pedidoProcedimento.idLaboratorio,
      medicamentoId: pedidoProcedimento.idMedicamento
    };
    const atualizarPatologia = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.patologia = {
      id: pedidoProcedimento.idPatologia,
      codigo: null
    } as Patologia;
    const atualizarMedicamentoApresentacaoParam = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.medicamentoApresentacaoParam = {
      laboratorioId: pedidoProcedimento.idLaboratorio,
      medicamentoId: pedidoProcedimento.idMedicamento
    };
    const atualizarPedidoProcedimento = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.pedidoProcedimento = pedidoProcedimento;
    const atualizarFormulario = (pedidoProcedimento: PedidoProcedimentoFormModel) => this.updateAndValidateform(pedidoProcedimento);
    const emitirEdicaoDeFormulario = (pedidoProcedimento: PedidoProcedimentoFormModel) => {
      this.isEditing = isNotUndefinedOrNull(pedidoProcedimento.index);
      this.isEditingForm.emit(this.isEditing);
    };
    this.managementInputform.pipe(
      distinctUntilChanged(),
      filter(isNotUndefinedNullOrEmpty),
      map(this.cleanAllPropertyUndefined),
      tap(() => this.isToShowForm = true),
      tap(atualizarParametroGrauProcedimento),
      tap(atualizarMedicamentoParam),
      tap(atualizarPatologia),
      tap(atualizarMedicamentoApresentacaoParam),
      tap(atualizarPedidoProcedimento),
      tap(atualizarFormulario),
      tap(emitirEdicaoDeFormulario),
      takeUntil(this.subjectUnsubscription),
      catchError(error => {
        console.error('error', error)
        return of()
      })
    ).subscribe()
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
}
