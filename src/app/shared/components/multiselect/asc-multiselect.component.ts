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
    size: 'small' | 'standard' | 'large' = 'large';

    @Input() selected: any;

    @Input() loading = false

    constructor() {
        this.limit = 4;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        console.log('asc-multiselect set value - recebido:', val);
        console.log('asc-multiselect set value - dscOptions:', this.dscOptions);
        if (val && Array.isArray(val)) {
            const primeiroItem = val[0];
            if (primeiroItem && typeof primeiroItem !== 'object') {
                this._value = val.map(value => {
                    const option = this.dscOptions.find(opt => opt.value === value);
                    const resultado = option ? { label: option.label, value: option.value } : { label: '', value: value };
                    console.log('asc-multiselect - mapeando primitivo:', value, '-> resultado:', resultado);
                    return resultado;
                });
            } else {
                this._value = val;
            }
        } else {
            this._value = val;
        }
        console.log('asc-multiselect set value - _value final:', this._value);
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
        console.log('asc-multiselect onChangeCallback - event:', event);
        if (event && Array.isArray(event)) {
            const objetosCompletos = event.map(value => {
                const option = this.dscOptions.find(opt => opt.value === value);
                return option ? { label: option.label, value: option.value } : { label: '', value: value };
            });
            console.log('asc-multiselect onChangeCallback - objetosCompletos:', objetosCompletos);
            this.onChange.emit(objetosCompletos);
        } else {
            this.onChange.emit(event);
        }
    }

}
