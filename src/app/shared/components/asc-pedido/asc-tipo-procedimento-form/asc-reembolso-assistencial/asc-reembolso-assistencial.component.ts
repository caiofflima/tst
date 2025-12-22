import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AscFormularioProcedimentoBase} from "../models/asc-formulario-procedimento-base";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "../../../messages/message.service";
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {FormGroup} from "@angular/forms";
import {AscSelectGrausProcedimentoParams} from "../../../asc-select/models/asc-select-graus-procedimento.params";
import {GrauProcedimento} from "../../../../models/comum/grau-procedimento";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {SituacaoPedidoProcedimentoService} from "../../../../services/comum/situacao-pedido-procedimento.service";
import {AscValidators} from "../../../../validators/asc-validators";
import {
    PedidoProcedimentoFormModel,
    pedidoProcedimentoFormModelIsNotEmpty
} from "../../models/pedido-procedimento-form.model";
import {GrauProcedimentoService} from "../../../../services/comum/grau-procedimento.service";
import {ProcedimentoService} from "../../../../../../app/shared/services/comum/procedimento.service";
import { ProcedimentoPedidoService } from 'app/shared/services/comum/procedimento-pedido.service';

@Component({
    selector: 'asc-reembolso-assistencial',
    templateUrl: './asc-reembolso-assistencial.component.html',
    styleUrls: ['./asc-reembolso-assistencial.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscReembolsoAssistencialComponent extends AscFormularioProcedimentoBase implements OnInit {

    @Input() override enableAllAction = true;
    @Input() override isToShowButtons = true;
    @Input() parametrosSelectGrauProcedimento: AscSelectGrausProcedimentoParams;

    override form = this._formBuilder.group({
        idProcedimento: [null, [Validators.required]],
        idGrauProcedimento: [null, [Validators.required]],
        tsOperacao:[new Date()],
        qtdSolicitada: [null, [
            Validators.required,
            Validators.min(1),
            Validators.minLength(1,),
            Validators.max(999),
            Validators.maxLength(3)]
        ],
        idAutorizacaoPrevia: [null, this.deveBloquearAutorizacaoPrevia() ? 
            [Validators.required,] : []],
        valorUnitarioPago: [null, [
            Validators.required,
            AscValidators.min(0.001),
            AscValidators.maxLengthAsNumber(8)
        ]],
        dataAtendimento: [null, [Validators.required, AscValidators.dataAtualMenor]],
        index: [null]
    });
    grausProcedimentos: GrauProcedimento[] = [];

    @Output() readonly grausProcedimentoSelecionado$ = new EventEmitter<GrauProcedimento>();
    private grauProcedimento: GrauProcedimento;

    constructor(
        private readonly _formBuilder: FormBuilder,
        protected override readonly messageService: MessageService,
        protected override readonly situacaoPedidoProcedimentoService: SituacaoPedidoProcedimentoService,
        protected readonly grauProcedimentoService: GrauProcedimentoService,
        override readonly procedimentoService: ProcedimentoService,
        protected readonly procedimentoProcedimentoService: ProcedimentoPedidoService
    ) {
        super(messageService, situacaoPedidoProcedimentoService, null, null, procedimentoProcedimentoService);
        this.autorizacaoPreviaValidacaoObrigatorio.subscribe(valor => {
            if (valor) {
                this.dependenciasCampos.set('qtdSolicitada', [
                    this.form.get('idProcedimento'),
                    this.form.get('idGrauProcedimento'),
                    this.form.get('idAutorizacaoPrevia')
                ]);
            } else {
                this.dependenciasCampos.set('qtdSolicitada', [
                    this.form.get('idProcedimento'),
                    this.form.get('idGrauProcedimento')
                ]);
            }
        })
    }

    override ngOnInit(): void {
    
        super.ngOnInit();
        
        if(this.pedido && this.pedido.valorDocumentoFiscal){
            this.valorDocumentoFiscal = this.pedido.valorDocumentoFiscal
            this.validarCamposQtdeValorUnitarioPago()
        }
    }

    protected override atualizarFormulario(pedidoProcedimento: any) {
        super.atualizarFormulario(pedidoProcedimento);
        if (pedidoProcedimentoFormModelIsNotEmpty(pedidoProcedimento)) {
            this.form.get("idGrauProcedimento").setValue(pedidoProcedimento.idGrauProcedimento);
            this.form.get("idGrauProcedimento").markAsTouched();
            this.form.get("idGrauProcedimento").markAsDirty();
            this.form.get("idGrauProcedimento").updateValueAndValidity();
            this.grauProcedimentoService.consultarPorId(pedidoProcedimento.idGrauProcedimento, pedidoProcedimento.idProcedimento).subscribe(grau => this.grauProcedimento = grau);
            this.form.get("dataAtendimento").setValue(pedidoProcedimento.dataAtendimento);

            // Setar quantidade solicitada
            if (pedidoProcedimento.qtdSolicitada) {
                this.form.get("qtdSolicitada").setValue(pedidoProcedimento.qtdSolicitada);
                this.form.get("qtdSolicitada").markAsTouched();
                this.form.get("qtdSolicitada").markAsDirty();
                this.form.get("qtdSolicitada").updateValueAndValidity();
            }

            // Setar valor unitario pago com formatacao BRL
            if (pedidoProcedimento.valorUnitarioPago) {
                const valor = typeof pedidoProcedimento.valorUnitarioPago === 'number'
                    ? pedidoProcedimento.valorUnitarioPago
                    : Number(pedidoProcedimento.valorUnitarioPago);
                this.form.get("valorUnitarioPago").setValue(valor.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));
                this.form.get("valorUnitarioPago").markAsTouched();
                this.form.get("valorUnitarioPago").markAsDirty();
                this.form.get("valorUnitarioPago").updateValueAndValidity();
            }
        }
    }

    construirFormulario(): PedidoProcedimento {
        const pedidoProcedimento = this.form.getRawValue() as any;
        pedidoProcedimento.procedimento = this.procedimento || pedidoProcedimento.procedimento;
        pedidoProcedimento.grauProcedimento = this.grauProcedimento || pedidoProcedimento.grauProcedimento;
        pedidoProcedimento.autorizacaoPrevia = this.autorizacaoPrevia || pedidoProcedimento.autorizacaoPrevia;
        return pedidoProcedimento;
    }

    protected override parametrosComProcedimento(idProcedimento: number) {
        this.especialidadeParams = {idProcedimento};
        this.autorizacaoPreviaParams = {
            idProcedimento,
            idBeneficiario: this.idBeneficario
        };
        this.parametrosSelectGrauProcedimento = {idProcedimento}
    }

    getForm(): FormGroup {
        return this.form;
    }

    grauProcedimentoCarregado(grausProcedimentos: GrauProcedimento[]) {
        this.grausProcedimentos = grausProcedimentos;
    }

    grauProcedimentoSelecionado(grausProcedimento: GrauProcedimento) {
        this.grauProcedimento = grausProcedimento;
        this.grausProcedimentoSelecionado$.emit(grausProcedimento)
    }

    protected getTipoProcedimento() {
        return TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL
    }

    bundle(msg: string, args?: any): string {
        return BundleUtil.fromBundle(msg, args);
    }

    hasGrauProcedimento(){
        if(this.grauProcedimento !== null && this.grauProcedimento !== undefined && this.grauProcedimento.id){
            return true;
        }else return false;
    }

    protected override registrarDependenciasPreenchimento() {
        this.dependenciasCampos.set('idGrauProcedimento', [
            this.form.get('idProcedimento')
        ]);
        this.dependenciasCampos.set('idAutorizacaoPrevia', [
            this.form.get('idProcedimento'),
            this.form.get('idGrauProcedimento')
        ]);
        this.dependenciasCampos.set('qtdSolicitada', [
            this.form.get('idProcedimento'),
            this.form.get('idGrauProcedimento'),
            this.form.get('idAutorizacaoPrevia')
        ]);
        this.dependenciasCampos.set('valorUnitarioPago', [
            this.form.get('qtdSolicitada')
        ]);
        this.dependenciasCampos.set('dataAtendimento', [
            this.form.get('valorUnitarioPago')
        ]);
    }
}
