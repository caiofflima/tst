import {Component} from '@angular/core';
import {BaseInputComponent} from '../base-input.component';
import {MessageService} from '../../../services/services';
import * as  constantes from '../../../../../app/shared/constantes';

@Component({
    selector: 'asc-input-telefone',
    templateUrl: './asc-input-telefone.component.html',
    styleUrls: ['./asc-input-telefone.component.scss']
})
export class AscInputTelefone extends BaseInputComponent {

    constructor(
        messageService: MessageService
    ) {
        super(messageService);
    }

    keyUpAction(_: KeyboardEvent) {
        this.aplicarMascara();
    }

    keyDownAction(_: KeyboardEvent): void {
        this.aplicarMascara();
    }

    changeAction(_: any): void {
        this.aplicarMascara();
    }

    blurAction(_: FocusEvent): void {
        this.aplicarMascara();
    }

    focusAction(_: FocusEvent) {
        this.aplicarMascara();
    }

    private aplicarMascara() {
        let value = this.control.value;
        value = constantes.somenteNumeros(value);
        if (value && value.length == 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3');
        } else if (value && value.length == 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        }
        this.control.setValue(value);
    }
}
