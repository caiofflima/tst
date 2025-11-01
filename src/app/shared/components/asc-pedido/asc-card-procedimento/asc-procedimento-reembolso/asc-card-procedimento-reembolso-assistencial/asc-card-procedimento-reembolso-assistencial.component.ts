import {Component, OnDestroy} from '@angular/core';
import {AscCardProcedimentoReembolsoBase} from "../models/asc-card-procedimento-reembolso-base";
import {ProcessoService} from "../../../../../services/comum/processo.service";

@Component({
    selector: 'asc-card-procedimento-reembolso-assistencial',
    templateUrl: './asc-card-procedimento-reembolso-assistencial.component.html',
    styleUrls: ['./asc-card-procedimento-reembolso-assistencial.component.scss']
})
export class AscCardProcedimentoReembolsoAssistencialComponent extends AscCardProcedimentoReembolsoBase implements OnDestroy {

    constructor(
        protected override readonly processoService: ProcessoService
    ) {
        super(processoService)
    }

}
