import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BaseSelectComponent} from '../base-input.component';
import {ComboService, MessageService} from '../../../services/services';
import {DadoComboDTO} from '../../../models/dto/dado-combo';
import {Observable} from 'rxjs';

@Component({
    selector: 'asc-select-conselho-profissional',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectConselhoProfissionalComponent extends BaseSelectComponent<DadoComboDTO> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: ComboService
    ) {
        super(messageService, changeDetectorRef, (dc: DadoComboDTO) => dc.label, (dc: DadoComboDTO) => dc.value, "Conselho Profissional");
    }

    protected override carregarListOperator(): Observable<DadoComboDTO[]> {
        return this.service.consultarComboConselhosProfissionais();
    }
}
