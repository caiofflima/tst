import {ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from "../../services/services";
import {Beneficiario} from "../../models/comum/beneficiario";
import {AscAutoCompleteComponent} from "./asc-auto-complete.component";

@Component({
    selector: 'asc-auto-complete-beneficiario',
    templateUrl: './asc-auto-complete.component.html',
    styleUrls: ['./asc-auto-complete.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscAutoCompleteBeneficiarioComponent extends AscAutoCompleteComponent<Beneficiario> implements OnInit {

    @Input()
    solicitacaoCredenciado: boolean;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService, changeDetectorRef, (b: Beneficiario) => b.nome, (b: Beneficiario) => b.id, "Beneficiário");
    }

    search(_: any) {
        this.selectItems = [{
            label: "Testando o resultado", value: 1
        }];
    }

    initAutoComplete(params: any): void {
        //TODO: remover se não mais necessário.
        console.log('initAutoComplete');
    }
}
