import {Component, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {MessageService} from "../../../messages/message.service";
import {AbstractControl} from '@angular/forms';

@Component({
    selector: 'asc-card-info-adicional',
    templateUrl: './asc-card-info-adicional.component.html',
    styleUrls: ['./asc-card-info-adicional.component.scss']
})
export class AscCardInfoAdicionalComponent extends BaseComponent {

    @Input()
    titleCardInfoAdicional = "Deseja adicionar alguma informação?";

    @Input()
    infoAdicional: AbstractControl;

    constructor(protected override readonly messageService: MessageService) {
        super(messageService)
    }
}

