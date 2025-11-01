import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AscFormularioProcedimentoBase} from "../models/asc-formulario-procedimento-base";
import {PedidoProcedimento} from "../../../../models/entidades";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MessageService} from "../../../messages/message.service";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {AscValidators} from "../../../../validators/asc-validators";
import {ProcedimentoService} from "../../../../../../app/shared/services/comum/procedimento.service";
import { ProcedimentoPedidoService } from 'app/shared/services/comum/procedimento-pedido.service';

@Component({
    selector: 'asc-formulario-reembolso-vacina',
    templateUrl: './asc-formulario-reembolso-vacina.component.html',
    styleUrls: ['./asc-formulario-reembolso-vacina.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscFormularioReembolsoVacinaComponent extends AscFormularioProcedimentoBase implements OnInit {

    override readonly  form = this._formBuilder.group({
        idProcedimento: [null, [Validators.required]],
        idAutorizacaoPrevia: [null, []],
        tsOperacao: [new Date()],
        qtdSolicitada: [null, [
            Validators.required,
            Validators.min(1),
            Validators.minLength(1,),
            Validators.max(999),
            Validators.maxLength(3)]
        ],
        valorUnitarioPago: [null, [
            Validators.required,
            Validators.required,
            AscValidators.min(0.001),
            AscValidators.maxLengthAsNumber(8)
        ]],
        dataAtendimento: [null, [
            Validators.required,
            AscValidators.dataAtualMenor
        ]],
        index: [null]
    });

    constructor(
        private readonly _formBuilder: FormBuilder,
        protected override readonly messageService: MessageService,
        override readonly procedimentoService: ProcedimentoService,
        protected override readonly procedimentoPedidoService: ProcedimentoPedidoService
    ) {
        super(messageService, null, null, null, procedimentoPedidoService);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        
        if(this.pedido && this.pedido.valorDocumentoFiscal){
            this.valorDocumentoFiscal = this.pedido.valorDocumentoFiscal
            this.validarCamposQtdeValorUnitarioPago()
        }
    }

    protected construirFormulario(): PedidoProcedimento {
        const pedidoProcedimento = this.getForm().getRawValue() as PedidoProcedimento;
        pedidoProcedimento.procedimento = this.procedimento || pedidoProcedimento.procedimento;
        return pedidoProcedimento;
    }

    protected getForm(): FormGroup {
        return this.form;
    }

    protected getTipoProcedimento() {
        return TipoProcessoEnum.REEMBOLSO_VACINA;
    }

    bundle(msg: string, args?: any): string {
        return BundleUtil.fromBundle(msg, args);
    }

    protected override registrarDependenciasPreenchimento() {
        this.dependenciasCampos.set('idAutorizacaoPrevia', [
            this.form.get('idProcedimento')
        ]);
        this.dependenciasCampos.set('qtdSolicitada', [
            this.form.get('idProcedimento')
        ]);
        this.dependenciasCampos.set('valorUnitarioPago', [
            this.form.get('idProcedimento'),
            this.form.get('qtdSolicitada')
        ]);
        this.dependenciasCampos.set('dataAtendimento', [
            this.form.get('idProcedimento'),
            this.form.get('qtdSolicitada'),
            this.form.get('valorUnitarioPago')
        ]);
    }
}
