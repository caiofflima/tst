import {ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {BeneficiarioService, MessageService} from '../../../services/services';
import {Beneficiario} from '../../../models/comum/beneficiario';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import {HttpUtil} from "../../../util/http-util";
import {tap} from "rxjs/operators";

@Component({
    selector: 'asc-select-beneficiario-ativo-cancelado',
    templateUrl: 'asc-select.component.html',
    styleUrls: ['./asc-select.component.scss']

})
export class AscSelectBeneficiarioAtivoCanceladoComponent extends BaseSelectComponent<Beneficiario> implements OnInit {

    @Input()
    solicitacaoCredenciado: boolean;

    @Input()
    matricula: string;

    @Input()
    titular = true;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly beneficiarioService: BeneficiarioService
    ) {
        super(messageService, changeDetectorRef, (b: Beneficiario) => b.nome, (b: Beneficiario) => b.id, 'Beneficiário');
    }

    protected override carregarListOperator(): Observable<Beneficiario[]> {
        return this.beneficiarioService.consultarBeneficiarioETitularContratoPorMatricula(this.matricula).pipe(
            HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error'),
            tap(() => this.changeDetectorRef.detectChanges())
        );
    }
}
