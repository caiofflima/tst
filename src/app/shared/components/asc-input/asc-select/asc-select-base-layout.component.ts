import {ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MessageService} from '../../../services/services';
import {Beneficiario} from '../../../models/comum/beneficiario';
import {BaseSelectComponent} from '../base-input.component';

type FuncaoValor = (b: Beneficiario) => any;

@Component({
    selector: 'asc-select-base-layout',
    templateUrl: 'asc-select.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AscSelectBaseLayout extends BaseSelectComponent<any> implements OnInit {

    @Input()
    solicitacaoCredenciado: boolean;

    @Input()
    matricula: string;

    @Input()
    funcaoValor: FuncaoValor;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
    ) {
        super(messageService, changeDetectorRef, () => '', () => '', '');
    }
}
