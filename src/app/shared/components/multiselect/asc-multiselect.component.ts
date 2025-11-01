import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'asc-multiSelect',
    templateUrl: './asc-multiselect.component.html',
    styleUrls: ['./asc-multiselect.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AscMultiSelectComponent),
        multi: true
    }]
})
export class AscMultiSelectComponent implements ControlValueAccessor {

    @Output() public onChange: EventEmitter<any> = new EventEmitter();

    @Input('options') options: any;

    @Input() _value: any;

    @Input()
    control: AbstractControl;

    @Input('required')
    required: boolean = false;

    @Input('limit')
    limit: number;

    @Input()
    disabled: boolean = false;


    @Input() selected: any;

    @Input() loading = false

    constructor() {
        this.limit = 4;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this._onChange(this._value);
    }

    writeValue(value: any) {
        if (value !== undefined) {
            this.value = value;
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(_: any): void {
        // Não usado.
    }

    _onChange(_: any) {
        // Não usado.
    }

    onChangeCallback(event: any) {
        this.onChange.emit(event);
    }

}
