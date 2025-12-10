import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {fadeAnimation} from "../../../../animations/faded.animation";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "../../../messages/message.service";
import {AscSelectEspecialidadeParam} from "../../../asc-select/models/asc-select-especialidade.param";
import {Especialidade} from "../../../../models/credenciados/especialidade";
import {AscFormularioProcedimentoBase} from "../models/asc-formulario-procedimento-base";
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {delay, distinctUntilChanged, takeUntil, tap} from "rxjs/operators";
import {Util} from "../../../../../arquitetura/shared/util/util";
import {Procedimento} from "../../../../models/comum/procedimento";
import {PedidoProcedimentoFormModel} from "../../models/pedido-procedimento-form.model";
import {isNotUndefinedOrNull} from "../../../../constantes";
import {AscValidators} from "../../../../validators/asc-validators";
import {SituacaoPedidoProcedimentoService} from "../../../../services/comum/situacao-pedido-procedimento.service";
import {ProcedimentoService} from "app/shared/services/comum/procedimento.service";
import { AutorizacaoPreviaService, ProcedimentoPedidoService } from 'app/shared/services/services';
import { BundleUtil } from 'app/arquitetura/shared/util/bundle-util';

@Component({
  selector: 'asc-formulario-reembolso-consulta',
  templateUrl: './asc-formulario-reembolso-consulta.component.html',
  styleUrls: ['./asc-formulario-reembolso-consulta.component.scss'],
  animations: [...fadeAnimation],
  encapsulation: ViewEncapsulation.None
})
export class AscFormularioReembolsoConsultaComponent extends AscFormularioProcedimentoBase implements OnInit {

  @Input() override enableAllAction = true;
  @Input() override isToShowButtons = true;

  @Output() readonly especialidade$ = new EventEmitter<Especialidade>();
  @Output() readonly especialidades$ = new EventEmitter<Especialidade[]>();

  readonly formConsulta = this._formBuilder.group({
    idProcedimento: [null, [Validators.required]],
    tsOperacao: [new Date()],
    idEspecialidade: [null, [Validators.required]],
    idAutorizacaoPrevia: [null, []],
    idAutorizacaoProcedimento: [null, []],
    valorUnitarioPago: [null, [
      Validators.required,
      AscValidators.min(0.001),
      AscValidators.maxLengthAsNumber(8)
    ]],
    dataAtendimento: [null, [Validators.required, AscValidators.dataAtualMenor]],
    index: [null]
  });

  especialidadeAsObject: any;
  override especialidadeParams: AscSelectEspecialidadeParam;
  showFieldEspecialidade = true;

  constructor(
    private readonly _formBuilder: FormBuilder,
    protected override readonly messageService: MessageService,
    protected override readonly situacaoPedidoProcedimentoService: SituacaoPedidoProcedimentoService,
    protected override readonly procedimentoService: ProcedimentoService,
    protected override readonly procedimentoPedidoService: ProcedimentoPedidoService,
    protected override readonly autorizacaoPreviaService: AutorizacaoPreviaService
  ) {
    super(messageService, situacaoPedidoProcedimentoService, null, autorizacaoPreviaService, procedimentoPedidoService);
  }

  override ngOnInit() {
    this.isToShowForm = false;
    super.ngOnInit();
    this.form = this.formConsulta
    this.registrarOnSubmitFormularioQuandoEstiverValido();
    
    
    if(this.pedido && this.pedido.valorDocumentoFiscal){
      this.valorDocumentoFiscal = this.pedido.valorDocumentoFiscal
      this.validarCamposQtdeValorUnitarioPago()
    }
  }

  construirFormulario(): PedidoProcedimento {
    const pedidoProcedimento:any = this.formConsulta.value;
    pedidoProcedimento.procedimento = this.procedimento || pedidoProcedimento.procedimento;
    pedidoProcedimento.especialidade = this.especialidade || pedidoProcedimento.especialidade;
    pedidoProcedimento.autorizacaoPrevia = this.autorizacaoPrevia || pedidoProcedimento.autorizacaoPrevia;
    pedidoProcedimento.autorizacaoPrevia = (this.autorizacaoPrevia || this.autorizacaoPrevia$.value);
    pedidoProcedimento.especialidade = (this.especialidade || this.especialidadeAsObject);
    return pedidoProcedimento;
  }

  override especialidadeSelecionado(especialidade: Especialidade) {
    if (especialidade && especialidade.id) {
      this.especialidadeAsObject = especialidade;
      this.especialidade = especialidade;
      this.formConsulta.patchValue({
        idEspecialidade: especialidade.id
      });
      const idEspecialidadeControl = this.formConsulta.get('idEspecialidade');
      idEspecialidadeControl.markAsTouched();
      idEspecialidadeControl.markAsDirty();
      idEspecialidadeControl.updateValueAndValidity();
      this.especialidade$.emit(especialidade);
      super.especialidadeSelecionado(especialidade);
    }
  }

  getForm(): any {
    return this.formConsulta;
  }

  especialidadesSelecionados(especialidades: Especialidade[]) {
    this.especialidades$.emit(especialidades)
  }

  protected override atualizarFormulario(pedidoProcedimento: PedidoProcedimentoFormModel) {
    super.atualizarFormulario(pedidoProcedimento);

    this.especialidadeAsObject = pedidoProcedimento.especialidade;
    this.procedimento = pedidoProcedimento.procedimento;
    if (this.especialidadeAsObject) {
      this.formConsulta.get("idEspecialidade").setValue(this.especialidadeAsObject.id);
      this.formConsulta.get("idEspecialidade").markAsTouched();
      this.formConsulta.get("idEspecialidade").markAsDirty();
      this.formConsulta.get("idEspecialidade").updateValueAndValidity();
    }
  }

  protected override parametrosComProcedimento(idProcedimento: number): void {
    if (idProcedimento) {
      this.especialidadeParams = {idProcedimento};
      this.autorizacaoPreviaParams = {
        idProcedimento,
        idBeneficiario: this.idBeneficario
      };
    } else {
      this.especialidadeParams = {};
      this.autorizacaoPreviaParams = {};
    }
  }

  protected registrarOnSubmitFormularioQuandoEstiverValido() {
    setTimeout(() => {
      if (!this.isToShowButtons && !this.isEditing) {
        this._registrarOnSubmitFormularioQuandoEstiverValido();
      }
    }, 0);
  }

  /**
   * Utilizar esse método quando o formulário não possui a ação de "Salvar"
   * @protected
   */
  protected _registrarOnSubmitFormularioQuandoEstiverValido() {
    this.getForm().valueChanges.pipe(
      distinctUntilChanged(),
      delay(200),
      tap(() => {
        this.isToShowButtons = true;
        this.isToShowForm = true;
        const procedimentoAsForm = this.construirFormulario();
        procedimentoAsForm.index = 0;
        this.adicionar$.emit({...procedimentoAsForm, isFormValid: this.formConsulta.valid});
        this.isEditing$.emit(this.isEditing);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe();
  }

  protected getTipoProcedimento() {
    return TipoProcessoEnum.REEMBOLSO_CONSULTA;
  }

  override procedimentoSelecionado(procedimento?: Procedimento): void {
    if (this.procedimento !== procedimento) {
      this.procedimento = procedimento;
      super.procedimentoSelecionado(procedimento);
      this.configurarControlEspecialidade(procedimento);
      this.parametrosComProcedimento(procedimento.id)
    }

  }

  protected configurarControlEspecialidade(p: Procedimento): void {
    const obrigaEspecialidade = ['10101012', '10101020', '10101039'];
    if (p) {
      const idEspecialidade = this.getForm().get('idEspecialidade');
      idEspecialidade.clearValidators();
      const found = obrigaEspecialidade.find((estrutNum: string) =>
        Util.somenteNumeros(p.estruturaNumerica).includes(estrutNum));
      if (found) {
        idEspecialidade.setValidators([Validators.required]);
      }
      idEspecialidade.updateValueAndValidity();
    }
  }

  protected override registrarDependenciasPreenchimento() {
    this.dependenciasCampos.set('idEspecialidade', [
      this.formConsulta.get('idProcedimento')
    ]);
    this.dependenciasCampos.set('idAutorizacaoPrevia', [
      this.formConsulta.get('idProcedimento'),
      this.formConsulta.get('idEspecialidade')
    ]);
    this.dependenciasCampos.set('valorUnitarioPago', [
      this.formConsulta.get('idProcedimento'),
      this.formConsulta.get('idEspecialidade')
    ]);
    this.dependenciasCampos.set('dataAtendimento', [
      this.formConsulta.get('idEspecialidade'),
      this.formConsulta.get('valorUnitarioPago')
    ]);
  }

  bundle(msg: string, args?: any): string {
    return BundleUtil.fromBundle(msg, args);
}

}
