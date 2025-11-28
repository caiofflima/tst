import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Option} from 'sidsc-components/dsc-select';

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

    private _options: any;
    dscOptions: Option[] = [];

    @Input('options')
    set options(value: any) {
        this._options = value;
        if (value && Array.isArray(value)) {
            // Convert DadoComboDTO[] to Option[]
            this.dscOptions = value.map((item: any) => ({
                label: item.label || item.descricao || '',
                value: item.value || item.id || item
            }));
        } else {
            this.dscOptions = [];
        }
    }

    get options(): any {
        return this._options;
    }

    @Input() _value: any;

    @Input()
    control: AbstractControl;

    @Input('required')
    required: boolean = false;

    @Input('limit')
    limit: number;

    @Input()
    label: string = '';

    @Input()
    disabled: boolean = false;

    @Input()
    size: 'small' | 'standard' | 'large' = 'standard';

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
