import {Component, OnDestroy} from '@angular/core';
import {AscCardProcedimentoReembolsoBase} from "../models/asc-card-procedimento-reembolso-base";
import {ProcessoService} from "../../../../../services/comum/processo.service";

@Component({
    selector: 'asc-card-procedimento-reembolso-vacina',
    templateUrl: './asc-card-procedimento-reembolso-vacina.component.html',
    styleUrls: ['./asc-card-procedimento-reembolso-vacina.component.scss']
})
export class AscCardProcedimentoReembolsoVacinaComponent extends AscCardProcedimentoReembolsoBase implements OnDestroy {

    constructor(
        protected override readonly processoService: ProcessoService
    ) {
        super(processoService)
    }

}
