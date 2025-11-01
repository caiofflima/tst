import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ComboService, MessageService} from '../../../services/services';
import {BaseSelectComponent} from '../base-input.component';
import {DadoComboDTO} from '../../../models/dto/dado-combo';
import {Observable} from 'rxjs';
import {SelectItem} from "primeng/api";
import {ItensUfStorage} from "../../../../arquitetura/shared/storage/itens-uf-storage";
import {of} from "rxjs";

@Component({
    selector: 'asc-select-uf',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectUfComponent extends BaseSelectComponent<DadoComboDTO> implements OnInit {

    private itensUF = new ItensUfStorage();

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: ComboService
    ) {
        super(messageService, changeDetectorRef, dc => dc.label, dc => dc.value, 'UF');
    }

    protected override carregarListOperator(): Observable<DadoComboDTO[]> {
        let itens: DadoComboDTO[] = this.itensUF.ler();
        if (!itens || itens.length == 0)
            return this.service.consultarComboUF();
        return of(itens);
    }

    protected override posCarregamentoSelectItens(itensCarregados: SelectItem[]) {
        let itens: DadoComboDTO[] = this.itensUF.ler();
        if (!itens || itens.length == 0) {
            let filtrados = itensCarregados.filter(i => i.value && (i.value.length > 0 || i.value > 0));
            this.itensUF.gravar(filtrados);
        }
    }

}
