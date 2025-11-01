import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as constantes from '../../../../../app/shared/constantes';
import {MessageService} from '../../../services/services';
import {BaseInputComponent} from '../base-input.component';

@Component({
    selector: 'asc-cpf-cnpj',
    templateUrl: './asc-input-cpf-cnpj.component.html',
    styleUrls: ['./asc-input-cpf-cnpj.component.scss']
})
export class AscInputCpfCnpjComponent extends BaseInputComponent implements OnInit {

    @Input()
    somenteCnpj: boolean = false;

    @Input()
    somenteCpf: boolean = false;

    @Input()
    somenteNumeros: boolean;

    @Output()
    onKeyup: EventEmitter<any>;

    @Output()
    onKeydown: EventEmitter<any>;

    @Output()
    onFocus: EventEmitter<any>;

    @Output()
    onBlur: EventEmitter<any>;

    constructor(messageService: MessageService) {
        super(messageService, "CPF/CNPJ");
    }

    get cpfCnpjUtil(): any {
        if (this.somenteCnpj) {
            return constantes.cnpjUtil;
        } else if (this.somenteCpf) {
            return constantes.cpfUtil;
        }

        return constantes.cpfCnpjUtil;
    }

    keyUpAction(e: KeyboardEvent) {
        this.controlarCaracteresPermitidosAndTamanho(e);
    }

    keyDownAction(e: KeyboardEvent): void {
        this.controlarCaracteresPermitidosAndTamanho(e);
    }

    blurAction(_: FocusEvent): void {
        this.cpfCnpjUtil.control.configurarMascara(this.control);
    }

    focusAction(_: FocusEvent) {
        this.cpfCnpjUtil.control.limparFormatacao(this.control);
    }

    private controlarCaracteresPermitidosAndTamanho(e: KeyboardEvent) {
        let cleanKeys = ["CLEAR", "BACKSPACE", "ERASEEOF", "PASTE", "UNDO", "TAB",
            "ENTER", "ARROWDOWN", "ARROWLEFT", "ARROWRIGHT", "ARROWUP", "END", "HOME"];
        let elm: any = e.target;
        let value = constantes.somenteNumeros(elm.value);
        if (value.length == 14 && !cleanKeys.includes(e.key ? e.key.toUpperCase() : "")) {
            e.preventDefault();
        } else {
            this.constantes.control.somenteNumeros(this.control);
        }
    }
}
