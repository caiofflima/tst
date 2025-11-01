import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from '../../../services/services';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {isUndefinedNullOrEmpty} from "../../../constantes";
import {DadoComboDTO} from "../../../models/dto/dado-combo";
import { TipoBeneficiarioService } from 'app/shared/services/comum/tipo-beneficiario.service';

@Component({
    selector: 'asc-select-tipo-beneficiario',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectTipoBeneficiarioComponent extends BaseSelectComponent<DadoComboDTO> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: TipoBeneficiarioService) {
        super(messageService, changeDetectorRef, (tb: DadoComboDTO) => tb.label, (tb: DadoComboDTO) => tb.value);
    }

    protected override carregarListOperator(): Observable<DadoComboDTO[]> {
        let operation: Observable<DadoComboDTO[]>;
        operation = this.service.consultarTodosBeneficiarios();

        return operation.pipe(this.defaultMessageWheNotFoundTipoBeneficiario());
    }

    private defaultMessageWheNotFoundTipoBeneficiario(): (source: Observable<DadoComboDTO[]>) => Observable<DadoComboDTO[]> {
        return (source: Observable<DadoComboDTO[]>): Observable<DadoComboDTO[]> => source.pipe(tap((tipos: DadoComboDTO[]) => {
            if (isUndefinedNullOrEmpty(tipos))
                this.messageService.addMsgDanger('Não foi encontrando nenhum tipo de beneficiário.');
        }))
    }
}
