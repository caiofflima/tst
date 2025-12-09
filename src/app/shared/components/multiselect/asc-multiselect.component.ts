import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Option} from 'sidsc-components/dsc-select';
import {MessageService} from '../messages/message.service';

@Component({
    selector: 'asc-multiSelect',
    templateUrl: './asc-multiselect.component.html',
    styleUrls: ['./asc-multiselect.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => AscMultiSelectComponent),
        multi: true
    }],
})
export class AscMultiSelectComponent implements ControlValueAccessor, OnInit {

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
    control: AbstractControl = new FormControl();

    @Input('required')
    required: boolean = false;

    @Input()
    requiredMsg: string = 'MA007';

    @Input('limit')
    limit: number;

    @Input()
    label: string = '';

    @Input()
    hint: string;

    @Input()
    disabled: boolean = false;

    @Input()
    size: 'small' | 'standard' | 'large' = 'large';

    @Input() selected: any;

    @Input() loading = false

    constructor(private readonly messageService: MessageService) {
        this.limit = 4;
    }

    ngOnInit(): void {
        this.requiredMsg = this.bundle(this.requiredMsg);
        this.hint = this.hint ? this.bundle(this.hint) : null;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (val && Array.isArray(val)) {
            const primeiroItem = val[0];
            if (primeiroItem && typeof primeiroItem !== 'object') {
                const objetosCompletos = val.map(value => {
                    const option = this.dscOptions.find(opt => opt.value === value);
                    const resultado = option ? { label: option.label, value: option.value } : { label: '', value: value };
                    return resultado;
                });
                this._value = objetosCompletos;
                this._onChange(objetosCompletos);
                return;
            } else {
                this._value = val;
            }
        } else {
            this._value = val;
        }
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
        this._onTouched = _;
    }

    _onChange(_: any) {
        // Não usado.
    }

    _onTouched(_: any) {
        // Não usado.
    }

    onChangeCallback(event: any) {
        if (event && Array.isArray(event)) {
            const objetosCompletos = event.map(value => {
                const option = this.dscOptions.find(opt => opt.value === value);
                return option ? { label: option.label, value: option.value } : { label: '', value: value };
            });

            this._value = objetosCompletos;
            this._onChange(objetosCompletos);
            this._onTouched(objetosCompletos);
            this.onChange.emit(objetosCompletos);
        } else {
            this.onChange.emit(event);
        }
    }

    showRequiredError(): boolean {
        return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
    }

    bundle(key: string, args?: any): string {
        return this.messageService.fromResourceBundle(key, args);
    }

}
