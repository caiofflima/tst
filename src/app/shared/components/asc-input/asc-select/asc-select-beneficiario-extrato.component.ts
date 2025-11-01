import {ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {MessageService} from '../../../services/services';
import {Beneficiario} from '../../../models/comum/beneficiario';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import {HttpUtil} from "../../../util/http-util";
import {tap} from "rxjs/operators";
import { HandleBeneficiariosDTO } from '../../../../../app/shared/models/comum/handle-beneficiarios-dto.model';
import { BeneficiarioService } from 'app/shared/services/comum/beneficiario.service';

@Component({
    selector: 'asc-select-beneficiario-extrato',
    templateUrl: 'asc-select.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AscSelectBeneficiarioExtratoComponent extends BaseSelectComponent<Beneficiario> implements OnInit {

    @Input()
    handle: HandleBeneficiariosDTO;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly beneficiarioService: BeneficiarioService
    ) {
        super(messageService, changeDetectorRef, (b: Beneficiario) => b.nome, (b: Beneficiario) => b.id, 'Beneficiário');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['handle']) {
          super.ngOnInit();
        }
      }

    protected override carregarListOperator(): Observable<Beneficiario[]> {
        return this.beneficiarioService.consultarBeneficiariosPorIds(this.handle).pipe(
            HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error'),
            tap(() => this.changeDetectorRef.detectChanges())
        );
    }
}
