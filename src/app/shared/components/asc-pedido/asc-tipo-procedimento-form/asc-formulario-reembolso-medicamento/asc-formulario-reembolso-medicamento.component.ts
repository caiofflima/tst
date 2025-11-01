import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Patologia} from "../../../../models/comum/patologia";
import {AscFormularioProcedimentoBase} from "../models/asc-formulario-procedimento-base";
import {Laboratorio, PedidoProcedimento} from "../../../../models/entidades";
import {AscSelectMedicamentoParam} from "../../../asc-select/models/asc-select-medicamento.param";
import {Medicamento} from "../../../../models/comum/medicamento";
import {MessageService} from "../../../messages/message.service";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {AscValidators} from "../../../../validators/asc-validators";
import {
    PedidoProcedimentoFormModel,
    pedidoProcedimentoFormModelIsNotEmpty
} from "../../models/pedido-procedimento-form.model";
import {PatologiaService} from "../../../../services/comum/patologia.service";
import {ProcedimentoService} from "../../../../../../app/shared/services/comum/procedimento.service";
import { NumberUtil } from '../../../../../../app/shared/util/number-util';
import { ProcedimentoPedidoService } from 'app/shared/services/comum/procedimento-pedido.service';

@Component({
    selector: 'asc-formulario-reembolso-medicamento',
    templateUrl: './asc-formulario-reembolso-medicamento.component.html',
    styleUrls: ['./asc-formulario-reembolso-medicamento.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscFormularioReembolsoMedicamentoComponent extends AscFormularioProcedimentoBase implements OnInit {

    override readonly form = this._formBuilder.group({
        idPatologia: [null, [Validators.required]],
        codigoMedicamento: [null, [Validators.required]],
        idLaboratorio: [null, [Validators.required]],
        idMedicamento: [null, [Validators.required]],
        tsOperacao: [new Date()],
        valorUnitarioPago: [null, [
            Validators.required,
            AscValidators.min(0.001),
            AscValidators.maxLengthAsNumber(8)
        ]],
        qtdSolicitada: [null, [
            Validators.required,
            Validators.min(1),
            Validators.minLength(1,),
            Validators.max(999),
            Validators.maxLength(3)
        ]],
        diasAtendidosPelaQuantidade: [null, [
            Validators.required,
            Validators.min(1),
            Validators.minLength(1,),
            Validators.max(999),
            Validators.maxLength(3)
        ]],
        index: [null]
    });

    parametroSelectPatologia: { idBeneficiario: number } = null;

    patologia = new Patologia();

    @Output()
    readonly patologia$ = new EventEmitter<Patologia>();

    @Output()
    readonly laboratorio$ = new EventEmitter<Laboratorio>();

    medicamentoParam: AscSelectMedicamentoParam = {};
    medicamentoApresentacaoParam: AscSelectMedicamentoParam;
    medicamentoApresentacao: Medicamento;
    laboratorio: Laboratorio;
    
    
    constructor(
        private readonly _formBuilder: FormBuilder,
        protected override readonly messageService: MessageService,
        protected readonly patologiaService: PatologiaService,
        protected override readonly procedimentoService: ProcedimentoService,
        protected override readonly procedimentoPedidoService: ProcedimentoPedidoService,
    ) {
        super(messageService, null, null, null, procedimentoPedidoService);
    }

    override ngOnInit() {
        super.ngOnInit();
        
        if(this.pedido && this.pedido.valorDocumentoFiscal){
            this.valorDocumentoFiscal = this.pedido.valorDocumentoFiscal
            this.validarCamposQtdeValorUnitarioPago()
        }

        if (this.beneficiario || this.idBeneficario) {
            this.parametroSelectPatologia = {
                idBeneficiario: this.idBeneficario || this.beneficiario.id
            };
        }
      

    }

    

    patologiaSelecionado(patologia: Patologia) {
        this.patologia = patologia;
        if (patologia && patologia.id) {
            this.patologiaService.consultarPorId(patologia.id).subscribe(p => this.patologia = p,
                error => this.messageService.addMsgDanger(error.error || error.message));
        }

        //this.laboratorioSelecionado(null);
        this.patologia$.emit(patologia);
    }

    construirFormulario(): any {
        const form = this.form.value as any;
        
        form.procedimento = this.procedimento;
        form.qtdMedicamento = form.qtdMedicamento || form.qtdSolicitada;
        form.qtdDiasAtendidosPeloMedicamento = form.qtdDiasAtendidosPeloMedicamento || form.diasAtendidosPelaQuantidade;
        form.patologia = this.patologia || form.patologia;
        form.medicamento = this.medicamentoApresentacao || form.medicamento;
        form.laboratorio = this.laboratorio || form.laboratorio;
        form.medicamentoPatologia = {idMedicamento: form.medicamento.id, idPatologia: form.patologia.id, medicamento: form.medicamento, patologia: form.patologia}
        return form;
    }

    laboratorioSelecionado(laboratorio: any) {
        this.medicamentoParam = {
            laboratorioId: laboratorio ? laboratorio.id : null,
            idPatologia: Number(this.getForm().get('idPatologia').value)
        }
        this.laboratorio$.emit(laboratorio)
        this.laboratorio = laboratorio;
    }

    medicamentoSelecionado(medicamento: Medicamento) {
        this.medicamentoApresentacaoParam = {
            medicamentoId: medicamento ? medicamento.id : null,
            laboratorioId: this.medicamentoParam ? this.medicamentoParam.laboratorioId : null,
            idPatologia: Number(this.getForm().get('idPatologia').value)
        }
    }

    medicamentoApresentacaoSelecionado(medicamentoApresentacao: Medicamento) {
        this.medicamentoApresentacao = medicamentoApresentacao;
    }

    bundle(msg: string, args?: any): string {
        return BundleUtil.fromBundle(msg, args);
    }

    override mostrarCampo(formId: string): boolean {
        let flg = true;
        const controls = this.dependenciasCampos.get(formId);
        if (controls) {
            for (let c of controls) {
                flg = flg && c.valid;
            }
        }
        return flg;
    }

    protected getForm(): FormGroup {
        return this.form;
    }

    protected override parametroComPatologia(idPatologia: number) {
        this.patologia = {id: idPatologia};
    }

    protected getTipoProcedimento() {
        return TipoProcessoEnum.REEMBOLSO_MEDICAMENTO;
    }

    protected override registrarDependenciasPreenchimento() {
        this.dependenciasCampos.set('idLaboratorio', [this.form.get('idPatologia')]);
        this.dependenciasCampos.set('codigoMedicamento', [
            this.form.get('idPatologia'),
            this.form.get('idLaboratorio')
        ]);
        this.dependenciasCampos.set('idMedicamento', [
            this.form.get('idPatologia'),
            this.form.get('idLaboratorio'),
            this.form.get('codigoMedicamento')
        ]);
        this.dependenciasCampos.set('qtdSolicitada', [
            this.form.get('idPatologia'),
            this.form.get('idLaboratorio'),
            this.form.get('codigoMedicamento'),
            this.form.get('idMedicamento')
        ]);
        this.dependenciasCampos.set('diasAtendidosPelaQuantidade', [
            this.form.get('idPatologia'),
            this.form.get('idLaboratorio'),
            this.form.get('codigoMedicamento'),
            this.form.get('idMedicamento'),
            this.form.get('qtdSolicitada')
        ]);
        this.dependenciasCampos.set('valorUnitarioPago', [
            this.form.get('idPatologia'),
            this.form.get('idLaboratorio'),
            this.form.get('codigoMedicamento'),
            this.form.get('idMedicamento'),
            this.form.get('qtdSolicitada'),
            this.form.get('diasAtendidosPelaQuantidade')
        ]);
    }

    protected override atualizarFormulario(pedidoProcedimento: any) {
        super.atualizarFormulario(pedidoProcedimento);
       console.log(pedidoProcedimento);
        if (pedidoProcedimentoFormModelIsNotEmpty(pedidoProcedimento) && (pedidoProcedimento.idPatologia || pedidoProcedimento.medicamentoPatologia)) {
            this.id = pedidoProcedimento.id
            const idPatologia = pedidoProcedimento.idPatologia != null ?  pedidoProcedimento.idPatologia : pedidoProcedimento.medicamentoPatologia.idPatologia;
            const idLaboratorio = pedidoProcedimento.idLaboratorio != null ?  pedidoProcedimento.idLaboratorio : pedidoProcedimento.medicamentoPatologia.medicamento.idLaboratorio;
            const codMedicamento = pedidoProcedimento.codigoMedicamento != null ? pedidoProcedimento.codigoMedicamento : pedidoProcedimento.medicamentoPatologia.medicamento.coMedicamento;
            const idMedicamento = pedidoProcedimento.idMedicamento != null ? pedidoProcedimento.idMedicamento : pedidoProcedimento.medicamentoPatologia.medicamento.id;

            this.parametroComPatologia(idPatologia);
            this.patologiaSelecionado(this.patologia);
            
            this.setarFormulario(pedidoProcedimento, idPatologia, idLaboratorio, idMedicamento);          
        }
    }

    setarFormulario(pedidoProcedimento: any, idPatologia, idLaboratorio, idMedicamento) {
        this.form.get('idPatologia').setValue(idPatologia);

        if (pedidoProcedimento.medicamento && pedidoProcedimento.medicamento.laboratorio) {
            this.laboratorio = pedidoProcedimento.medicamento.laboratorio;
            this.form.get('idLaboratorio').setValue(this.laboratorio.id as any);
            this.laboratorioSelecionado(this.laboratorio)
        } else {
            this.form.get('idLaboratorio').setValue(idLaboratorio);
        }

        if (pedidoProcedimento.medicamento) {
            this.medicamentoApresentacao = pedidoProcedimento.medicamento;
            this.form.get('codigoMedicamento').setValue(this.medicamentoApresentacao.id as any);
            this.form.get('idMedicamento').setValue(this.medicamentoApresentacao.id as any);
        } else {
            this.form.get('codigoMedicamento').setValue(idMedicamento);
            this.form.get('idMedicamento').setValue(idMedicamento);
        }

        this.form.get('qtdSolicitada').setValue(pedidoProcedimento.qtdMedicamento || pedidoProcedimento.qtdSolicitada);
        this.form.get('diasAtendidosPelaQuantidade').setValue(pedidoProcedimento.qtdDiasAtendidosPeloMedicamento || pedidoProcedimento.diasAtendidosPelaQuantidade);
        this.form.get('valorUnitarioPago').setValue( this.formatarParaBRL( Number( pedidoProcedimento.valorUnitarioPago ) ) as any )
    }

    formatarParaBRL(valor: number) {
        return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    

    
}
