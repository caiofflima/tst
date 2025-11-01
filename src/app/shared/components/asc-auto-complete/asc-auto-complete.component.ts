import {ChangeDetectorRef, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from "../../services/services";
import {BaseSelectComponent} from "../asc-input/base-input.component";

@Directive()
export abstract class AscAutoCompleteComponent<T> extends BaseSelectComponent<T> implements OnInit {

    @Input()
    placeHolder: string;
    @Input()
    size: string;
    @Input()
    minlength: number;
    @Output()
    override onSelect: EventEmitter<any>;
    selecionado: string;

    protected constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        labelPadrao: (t: T) => string,
        valuePadrao: (t: T) => any,
        protected override readonly defaultLabel?: string) {
        super(messageService, changeDetectorRef, labelPadrao, valuePadrao, defaultLabel);
        this.onSelect = new EventEmitter<any>();
        this.labelPadrao = labelPadrao;
        this.valuePadrao = valuePadrao;
        this.requiredMsg = "MA007";
    }

    public abstract initAutoComplete(params: any): void;

    onSelectAction(evt: any): void {
        this.onSelect.emit(evt);
        this.control.setValue(evt.value);
        this.selecionado = evt.label;
    }
}
