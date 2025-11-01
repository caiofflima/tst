import {Component, Input} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GrauProcedimento} from "../../../../shared/models/comum/grau-procedimento";
import {Procedimento} from "../../../../shared/models/comum/procedimento";
import {TipoProcesso} from "../../../../shared/models/comum/tipo-processo";
import {AscSelectComponentProcedimentosParams} from "../../../../shared/components/asc-select/models/asc-select-component-procedimentos.params";
import {PedidoProcedimentoFormModel} from "../../../../shared/components/asc-pedido/models/pedido-procedimento-form.model";

import {profileComponent} from "../../../../shared/components/asc-pedido/asc-tipo-procedimento-form/models/asc-tipo-formulario-settings";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";
import {Pedido} from "../../../../shared/models/comum/pedido";

@Component({
    selector: 'asc-reembolso-procedimento',
    templateUrl: './reembolso-procedimento.component.html',
    styleUrls: ['./reembolso-procedimento.component.scss']
})
export class ReembolsoProcedimentoComponent {

    @Input() pedido: Pedido;
    @Input() tipoProcesso: TipoProcesso;
    @Input() parametroSelectProcedimento: AscSelectComponentProcedimentosParams;
    @Input() pedidoProcedimentoForm: PedidoProcedimentoFormModel;

    readonly formularioProcedimento = new FormGroup({
        procedimento: new FormControl(null, Validators.required),
        grau: new FormControl(null, Validators.required),
        valorUnitarioPago: new FormControl(null, [Validators.required, Validators.min(1)]),
        quantidade: new FormControl(null, [Validators.required, Validators.min(1)]),
        data: new FormControl(null, Validators.required),
    });

    grauProcedimento: GrauProcedimento;
    procedimento: Procedimento;

    PROFILE_REEMBOLSO = profileComponent[TipoProcessoEnum.REEMBOLSO_CONSULTA]

    grauProcedimentoSelecionado(grauProcedimento: GrauProcedimento) {
        this.grauProcedimento = grauProcedimento;
    }

    procedimentoSelecionado(procedimento: Procedimento) {
        this.procedimento = procedimento;
    }
}
