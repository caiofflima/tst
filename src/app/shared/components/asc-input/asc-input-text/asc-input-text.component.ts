import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from "../../../services/services";
import {BaseInputComponent} from "../base-input.component";
import * as allMasks from "../../../util/masks";

@Component({
    selector: 'asc-input-text',
    templateUrl: './asc-input-text.component.html',
    styleUrls: ['./asc-input-text.component.scss'],
})
export class AscInputTextComponent extends BaseInputComponent implements OnInit {
    @Input()
    type: 'text' | 'password' | 'number' = 'text';
    @Input()
    name: string;
    @Input()
    autocomplete: string = "on";
    @Input()
    placeholder: string;
    @Input()
    maskName: allMasks.Mask;
    @Input()
    maxlength: number;
    @Input()
    somenteLetrasMaiusculas: string = '';
    @Input()
    somenteNumeros: boolean;
    @Input()
    isSearch: boolean;
    @Input()
    override size: 'standard' | 'small' | 'large' = 'large';
    @Output()
    onKeyup: EventEmitter<any>;
    @Output()
    onKeydown: EventEmitter<any>;
    @Output()
    onFocus: EventEmitter<any>;
    @Output()
    onBlur = new EventEmitter<any>();
    @Output()
    onChange: EventEmitter<any>;
    @Output()
    onDrop: EventEmitter<any>;

    mask: string = null;

    constructor(messageService: MessageService) {
        super(messageService);
        this.autocomplete = "on";
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.maskName) {
            this.mask = allMasks.registeredMasks[this.maskName];
        }
    }

    private tratarSomenteNumeros() {
        if (this.somenteNumeros) {
            this.constantes.control.somenteNumeros(this.control);
        }
    }
    private setarLetrasMaisculas() {
        if (this.somenteLetrasMaiusculas) {
            this.constantes.control.somenteLetrasMaiusculas(this.control);
        }
    }

    changeAction(e: any): void {
        this.tratarSomenteNumeros();
        this.executeEmiter(this.onChange, e);
    }

    blurAction(e: FocusEvent): void {
        this.tratarSomenteNumeros();
        this.executeEmiter(this.onBlur, e);
    }

    focusAction(e: FocusEvent): void {
        this.tratarSomenteNumeros();
        this.executeEmiter(this.onFocus, e);
    }

    keyDownAction(e: KeyboardEvent): void {
        this.setarLetrasMaisculas();

        this.tratarSomenteNumeros();
        this.executeEmiter(this.onKeydown, e);
    }

    keyUpAction(e: KeyboardEvent): void {
        this.tratarSomenteNumeros();
        this.executeEmiter(this.onKeyup, e);
    }

    dropAction(e: DragEvent) {
        this.tratarSomenteNumeros();
        this.executeEmiter(this.onDrop, e);
    }

    onPaste(e: ClipboardEvent) {
        const dataFromEvent = e.clipboardData.getData("text")
        const isNumber = "0123456789".split('').every(a => Boolean(
            dataFromEvent.split('')
            .filter(s => s !== ',')
            .filter(s => s !== '.')
            .find(s => s === a))
        );
        if (!isNumber) e.preventDefault();
    }

    eventPreventDefaultOnDrag($event: DragEvent) {
        $event.preventDefault();
    }
}


@Component({
    selector: 'asc-input-email',
    templateUrl: './asc-input-email.component.html',
    styleUrls: ['./asc-input-text.component.scss']
})
export class AscInputEmailComponent extends AscInputTextComponent implements OnInit {
    constructor(messageService: MessageService) {
        super(messageService);
    }

    override changeAction(e: any): void {
        super.changeAction(e);
        this.executeEmiter(this.onChange, e);
    }

    override blurAction(e: FocusEvent): void {
        super.blurAction(e);
        this.executeEmiter(this.onBlur, e);
    }

    override focusAction(e: FocusEvent): void {
        super.focusAction(e);
        this.executeEmiter(this.onFocus, e);
    }

    override keyDownAction(e: KeyboardEvent): void {
        super.keyDownAction(e);
        this.executeEmiter(this.onKeydown, e);
    }

    override keyUpAction(e: KeyboardEvent): void {
        super.keyUpAction(e);
        this.executeEmiter(this.onKeyup, e);
    }
}


@Component({
    selector: 'asc-campo-estatico',
    template: `
      <label class="control-label" [ngStyle]="compStyle" for="{{id}}">{{label}}</label>
      <p [ngStyle]="compStyle" id="{{id}}">{{value}}</p>`
})
export class AscCampoEstaticoComponent {
    @Input()
    id: string;
    @Input()
    label: string = "";
    @Input()
    value: string;
    @Input()
    hide: boolean;

    get compStyle(): any {
        return !this.hide ? {'display': 'block'} : {'display': 'none'};
    }
}


@Component({
    selector: 'asc-input-button',
    templateUrl: './asc-input-button.component.html',
    styleUrls: ['./asc-input-text.component.scss']
})
export class AscInputButtonComponent extends AscInputTextComponent implements OnInit {

    @Output()
    buttonClick = new EventEmitter<MouseEvent>();

    constructor(messageService: MessageService) {
        super(messageService);
    }

    override changeAction(e: any): void {
        super.changeAction(e);
        this.executeEmiter(this.onChange, e);
    }

    override blurAction(e: FocusEvent): void {
        super.blurAction(e);
        this.executeEmiter(this.onBlur, e);
    }

    override focusAction(e: FocusEvent): void {
        super.focusAction(e);
        this.executeEmiter(this.onFocus, e);
    }

    override keyDownAction(e: KeyboardEvent): void {
        super.keyDownAction(e);
        this.executeEmiter(this.onKeydown, e);
    }

    override keyUpAction(e: KeyboardEvent): void {
        super.keyUpAction(e);
        this.executeEmiter(this.onKeyup, e);
    }

    doClick(e: any): void {
        this.executeEmiter(this.buttonClick, e);
    }

}

@Component({
    selector: 'asc-input-money',
    templateUrl: './asc-input-money.component.html',
    styleUrls: ['./asc-input-text.component.scss']
})
export class AscInputMoneyComponent extends AscInputTextComponent implements OnInit {

    moneyMask: Function = () => {
        return [];
    };

    constructor(messageService: MessageService) {
        super(messageService);
    }

    override changeAction(e: any): void {
        super.changeAction(e);
        this.executeEmiter(this.onChange, e);
    }

    override blurAction(e: FocusEvent): void {
        super.blurAction(e);
        this.executeEmiter(this.onBlur, e);
    }

    override focusAction(e: FocusEvent): void {
        super.focusAction(e);
        this.executeEmiter(this.onFocus, e);
    }

    override keyDownAction(e: KeyboardEvent): void {
        super.keyDownAction(e);
        this.executeEmiter(this.onKeydown, e);
    }

    override keyUpAction(e: KeyboardEvent): void {
        super.keyUpAction(e);
        this.executeEmiter(this.onKeyup, e);
    }
}
