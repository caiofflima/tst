import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {isNotUndefinedNullOrEmpty} from '../../../constantes';
import {AbstractControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MessageService} from '../../messages/message.service';
import {takeUntil, tap} from "rxjs/operators";
import {Option} from 'sidsc-components/dsc-select';

@Component({
    selector: 'asc-dropdown',
    templateUrl: './asc-dropdown.component.html',
    styleUrls: ['./asc-dropdown.component.scss'],
    host: {
        '[class.readonly-mode]': 'readonly'
    }
})
export class AscDropdownComponent implements OnInit, OnDestroy, AfterViewInit {

    private _disabled = false;
    private _readonly = false;

    @Input()
    get disabled() {
        return this._disabled;
    }
    set disabled(value: boolean) {
        this._disabled = value;
        this.syncControlDisabledState();
    }

    @Input()
    get readonly() {
        return this._readonly;
    }
    set readonly(value: boolean) {
        this._readonly = value;
    }

    @Input() id: string;
    @Input() label: string;
    @Input() hint: string;
    @Input() requiredMsg: string;
    @Input() control: any;
    @Input() selectId: string;
    @Input() required = false;
    @Input() showProgressBar = false;
    @Input() filterBy: string = 'label';
    @Input() placeholder: string = '';
    @Input() index: number = null;
    @Input() enableBackendFilter: boolean = false;
    @Input() size: 'small' | 'standard' | 'large' = 'large';

    @Output() selected = new EventEmitter();
    @Output() filter = new EventEmitter<string>();

    @ViewChild("dropdownElement") private dropDown: any;

    private inputFilter: HTMLInputElement;
    private readonly value$ = new EventEmitter<any>();
    private readonly unsubscribeSubject = new Subject<void>();

    options: Option[] = [];

    constructor(private readonly messageService: MessageService) {
        this.requiredMsg = 'MA007';
    }

    @Input()
    set items(items: any[]) {
        this.options = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];

        if (isNotUndefinedNullOrEmpty(items)) {
            const converted = this.convertItemsToOptions(items);
            this.options = [...this.options, ...converted];
        }
    }

    @Input()
    set value(value) {
        if (this.control) {
            this.control.setValue(value);
        }
    }

    ngOnInit(): void {
        this.requiredMsg = this.bundle(this.requiredMsg);
        this.hint = this.hint ? this.bundle(this.hint) : null;
        this.registerOnChangeValue();
        this.syncControlDisabledState();
    }

    ngAfterViewInit(): void {
        this.setupControlStatusListener();
        this.setupBackendFilter();
    }

    ngOnDestroy(): void {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    }

    onChange(valor: any): void {
        if (this.disabled || this.readonly) {
            return;
        }

        const emitValue = this.getEmitValue(valor);
        if (this.control) {
            // Ensure form control reflects the selected value
            const newValue = (emitValue as any)?.value !== undefined ? (emitValue as any).value : valor;
            this.control.setValue(newValue);
            this.control.updateValueAndValidity();
            this.control.markAsDirty();
            this.control.markAsTouched();
        }
        this.value$.emit(emitValue);
    }

    public mostarMsgErro(): boolean {
        return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
    }

    bundle(key: string, args?: any): string {
        return this.messageService.fromResourceBundle(key, args);
    }

    private onFiltro = (event: KeyboardEvent): void => {
        if (event.key.toUpperCase().startsWith("ARROW")) {
            return;
        }
        this.filter.emit(this.inputFilter.value);
    }

    // Métodos extraídos para reduzir complexidade

    private convertItemsToOptions(items: any[]): Option[] {
        return items.map(item => this.convertItemToOption(item));
    }

    private convertItemToOption(item: any): Option {
        if (item.label && item.value !== undefined) {
            return item as Option;
        }

        return {
            label: item.label || item.descricao || '',
            value: item.value !== undefined ? item.value : item.id
        } as Option;
    }

    private setupControlStatusListener(): void {
        if (!this.control) {
            return;
        }

        this.control.statusChanges.subscribe(() => {
            if (!this.control.touched) {
                this.filter.emit("");
            }
        });
    }

    private setupBackendFilter(): void {
        if (!this.enableBackendFilter) {
            return;
        }

        setTimeout(() => this.attachFilterListener(), 500);
    }

    private attachFilterListener(): void {
        const filterInput = this.getFilterInput();

        if (filterInput) {
            filterInput.addEventListener('input', (event: Event) => {
                const value = (event.target as HTMLInputElement)?.value || '';
                this.filter.emit(value);
            });
        }
    }

    private getFilterInput(): HTMLInputElement | null {
        if (!this.id) {
            return null;
        }

        const container = document.getElementById(this.id);
        return container?.querySelector<HTMLInputElement>('input[type="text"]') || null;
    }

    private getEmitValue(valor: any): any {
        if (valor === null || valor === undefined) {
            return valor;
        }

        const option = this.options.find(opt => opt.value === valor);
        return option ? { label: option.label, value: option.value } : valor;
    }

    private syncControlDisabledState(): void {
        if (!this.control) {
            return;
        }

        if (this.disabled && !this.control.disabled) {
            this.control.disable({emitEvent: false});
        } else if (!this.disabled && this.control.disabled) {
            this.control.enable({emitEvent: false});
        }
    }

    private registerOnChangeValue(): void {
        this.value$.pipe(
            tap(value => this.selected.emit(value)),
            takeUntil(this.unsubscribeSubject)
        ).subscribe();
    }
}
