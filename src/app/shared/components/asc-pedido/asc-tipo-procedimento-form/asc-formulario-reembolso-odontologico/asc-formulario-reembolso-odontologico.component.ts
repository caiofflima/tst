import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AscFormularioProcedimentoBase} from "../models/asc-formulario-procedimento-base";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {Especialidade} from "../../../../models/credenciados/especialidade";
import {MessageService} from "../../../messages/message.service";
import {Procedimento} from "../../../../models/comum/procedimento";
import {AscSelectGrausProcedimentoParams} from "../../../asc-select/models/asc-select-graus-procedimento.params";
import {GrauProcedimento} from "../../../../models/comum/grau-procedimento";
import {isUndefinedNullOrEmpty} from "../../../../constantes";
import {TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {SituacaoPedidoProcedimentoService} from "../../../../services/comum/situacao-pedido-procedimento.service";
import {AscValidators} from "../../../../validators/asc-validators";
import {PedidoProcedimentoFormModel} from "../../models/pedido-procedimento-form.model";
import {GrauProcedimentoService} from "../../../../services/comum/grau-procedimento.service";
import {ProcedimentoService} from "app/shared/services/comum/procedimento.service";
import { AutorizacaoPreviaService, ProcedimentoPedidoService } from 'app/shared/services/services';
import { Pedido } from 'app/shared/models/entidades';

@Component({
    selector: 'asc-formulario-reembolso-odontologico',
    templateUrl: './asc-formulario-reembolso-odontologico.component.html',
    styleUrls: ['./asc-formulario-reembolso-odontologico.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscFormularioReembolsoOdontologicoComponent extends AscFormularioProcedimentoBase implements OnInit {

    @Input()
   override enableAllAction = true;

    @Input()
    override isToShowButtons = true;

    @Output()
    readonly especialidade$ = new EventEmitter<Especialidade>();

    @Output()
    readonly especialidades = new EventEmitter<Especialidade[]>();
   
    override form = this._formBuilder.group({
        idProcedimento: [null, [Validators.required]],
        idAutorizacaoPrevia: [null, []],
        idAutorizacaoProcedimento: [null, []],
        idRegiaoOdontologica: [null, [Validators.required]],
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
            AscValidators.min(0.001),
            AscValidators.maxLengthAsNumber(8)
        ]],
        dataAtendimento: [null, [
            Validators.required,
            AscValidators.dataAtualMenor
        ]],
        index: [null],
        tipoAutorizacao: [null],
    });
    

    especialidadeAsObject: Especialidade;
    parametrosSelectGrauProcedimento: AscSelectGrausProcedimentoParams = {};
    private regiaoOdontoligica: GrauProcedimento;

    constructor(
        private readonly _formBuilder: FormBuilder,
        protected override readonly messageService: MessageService,
        protected override readonly situacaoPedidoProcedimentoService: SituacaoPedidoProcedimentoService,
        private readonly grausProcedimentoService: GrauProcedimentoService,
        override readonly  procedimentoService: ProcedimentoService,
        protected override readonly procedimentoPedidoService: ProcedimentoPedidoService,
        protected override readonly autorizacaoPreviaService?: AutorizacaoPreviaService,
    ) {
        super(messageService, situacaoPedidoProcedimentoService, null, autorizacaoPreviaService, procedimentoPedidoService);

        this.autorizacaoPreviaValidacaoObrigatorio.subscribe(valor => {
            if (valor) {
                this.dependenciasCampos.set('idRegiaoOdontologica', [
                    this.form.get('idProcedimento'),
                    this.form.get('idAutorizacaoPrevia')
                ]);
            } else {
                this.dependenciasCampos.set('idRegiaoOdontologica', [
                    this.form.get('idProcedimento')
                ]);
            }
        })
    }

    override ngOnInit(): void {
        super.ngOnInit()
        
        
        if(this.pedido && this.pedido.valorDocumentoFiscal){
            this.valorDocumentoFiscal = this.pedido.valorDocumentoFiscal
            this.validarCamposQtdeValorUnitarioPago()
            
        }
    }

    construirFormulario(): PedidoProcedimento {
        const pedidoProcedimento:any = this.form.getRawValue();
        pedidoProcedimento.procedimento = pedidoProcedimento.procedimento || this.procedimento;
        pedidoProcedimento.grauProcedimento = pedidoProcedimento.regiaoOdontologica || this.regiaoOdontoligica;
        pedidoProcedimento.regiaoOdontologica = pedidoProcedimento.regiaoOdontologica || this.regiaoOdontoligica;
        pedidoProcedimento.autorizacaoPrevia = pedidoProcedimento.autorizacaoPrevia || this.autorizacaoPrevia;
        return pedidoProcedimento;
    }

    protected override atualizarFormulario(pedidoProcedimento: any) {
        super.atualizarFormulario(pedidoProcedimento);
        this.id = pedidoProcedimento.id

        if (pedidoProcedimento.idRegiaoOdontologica) {
            this.grausProcedimentoService.consultarPorId(pedidoProcedimento.idRegiaoOdontologica, pedidoProcedimento.idProcedimento).subscribe(regiao => {
                this.regiaoOdontoligica = regiao;
            });

            setTimeout(() => {

                this.form.get("idRegiaoOdontologica").setValue(pedidoProcedimento.idRegiaoOdontologica);
            }, 6500);
        }

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

    override especialidadeSelecionado(especialidade: Especialidade) {
        this.especialidadeAsObject = especialidade;
        this.especialidade$.emit(especialidade)
    }

    override procedimentoSelecionado(procedimento?: Procedimento) {
        if (procedimento) {
            super.procedimentoSelecionado(procedimento)
            this.parametrosSelectGrauProcedimento = {idProcedimento: procedimento.id};
        }
    }

    getForm(): FormGroup {
        return this.form;
    }

    protected override parametrosComProcedimento(idProcedimento: number): void {
        if (idProcedimento) {
            this.autorizacaoPreviaParams = {
                idProcedimento,
                idBeneficiario: this.idBeneficario
            };
        } else {
            this.especialidadeParams = {};
            this.autorizacaoPreviaParams = {};
        }
    }

    regiaoOdontologicaSelecionados(grauProcedimentos: GrauProcedimento[]) {
        if (isUndefinedNullOrEmpty(grauProcedimentos)) {
            const idRegiaoOdontologica = this.form.get('idRegiaoOdontologica');
            idRegiaoOdontologica.clearValidators();
            idRegiaoOdontologica.updateValueAndValidity();
        }
    }

    regiaoOdontologicaSelecionada(grauProcedimento: GrauProcedimento) {
        this.regiaoOdontoligica = grauProcedimento;
    }

    protected getTipoProcedimento() {
        return TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO;
    }

    bundle(msg: string, args?: any): string {
        return BundleUtil.fromBundle(msg, args);
    }

    protected override registrarDependenciasPreenchimento() {
        this.dependenciasCampos.set('idAutorizacaoPrevia', [
            this.form.get('idProcedimento')
        ]);
        this.dependenciasCampos.set('idRegiaoOdontologica', [
            this.form.get('idProcedimento'),
            this.form.get('idAutorizacaoPrevia')
        ]);
        this.dependenciasCampos.set('qtdSolicitada', [
            this.form.get('idProcedimento'),
            this.form.get('idAutorizacaoPrevia'),
            this.form.get('idRegiaoOdontologica')
        ]);
        this.dependenciasCampos.set('valorUnitarioPago', [
            this.form.get('idProcedimento'),
            this.form.get('idAutorizacaoPrevia'),
            this.form.get('idRegiaoOdontologica'),
            this.form.get('qtdSolicitada')
        ]);
        this.dependenciasCampos.set('dataAtendimento', [
            this.form.get('idProcedimento'),
            this.form.get('idAutorizacaoPrevia'),
            this.form.get('idRegiaoOdontologica'),
            this.form.get('qtdSolicitada'),
            this.form.get('valorUnitarioPago')
        ]);
    }

    hasProcedimento(){
        if(this.form.get('idProcedimento') && this.form.get('idProcedimento').value){
            return true;
        } return false;
    }

    hasRegiaoOdontoligica(){
        if(this.regiaoOdontoligica !== null && this.regiaoOdontoligica !== undefined && this.regiaoOdontoligica.id){
            return true;
        } return false;
    }

    
}
