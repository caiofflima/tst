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
})
export class AscDropdownComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input()
    disabled = false;
    @Input()
    id: string;
    @Input()
    label: string;
    @Input()
    requiredMsg: string;
    @Input()
    control: any;
    @Input()
    selectId: string;
    @Input()
    required = false;
    @Input()
    showProgressBar = false;
    @Input()
    filterBy: string = 'label';
    @Input()
    placeholder: string = '';
    @Output()
    selected = new EventEmitter();
    @Output()
    filter = new EventEmitter<string>();
    @ViewChild("dropdownElement")
    private dropDown: any;
    @Input()
    index: number = null;

    private inputFilter: HTMLInputElement;
    private readonly value$ = new EventEmitter<any>()

    options: Option[] = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];

    private readonly unsubscribeSubject = new Subject<void>();

    constructor(
        private readonly messageService: MessageService,
    ) {
        this.requiredMsg = 'MA007';
    }

    @Input()
    set items(items: any[]) {
        this.options = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];
        if (isNotUndefinedNullOrEmpty(items)) {
            // Converter para formato Option se necessário
            const converted = items.map(item => {
                if (item.label && item.value !== undefined) {
                    return item as Option;
                }
                // Se for DadoComboDTO ou similar
                return {
                    label: item.label || item.descricao || '',
                    value: item.value !== undefined ? item.value : item.id
                } as Option;
            });
            this.options = [...this.options, ...converted];
        }
    }

    ngOnInit(): void {
        this.requiredMsg = this.bundle(this.requiredMsg);
        this.registerOnChangeValue();
    }

    ngAfterViewInit() {
        // DSC-SELECT não precisa de manipulação manual do filtro
        // O componente já tem filtro integrado via showFilter
        if (this.control) {
            this.control.statusChanges.subscribe(() => {
                if (!this.control.touched) {
                    this.filter.emit("");
                }
            });
        }
    }

    private onFiltro = (event: KeyboardEvent): void => {
        if (event.key.toUpperCase().startsWith("ARROW")) {
            return;
        }

        this.filter.emit(this.inputFilter.value);
    }

    public mostarMsgErro(): boolean {
        return this.control && this.control.invalid && (this.control.dirty || this.control.touched);
    }

    ngOnDestroy(): void {
        this.unsubscribeSubject.next();
        this.unsubscribeSubject.complete();
    }

    bundle(key: string, args?: any): string {
        return this.messageService.fromResourceBundle(key, args);
    }

    @Input()
    set value(value) {
        if (this.control) {
            this.control.setValue(value);
        }
    }

    onChange(valor: any): void {
        // DSC-SELECT emite o valor diretamente, não um objeto {value: ...}
        this.value$.emit(valor)
    }

    private registerOnChangeValue(): void {
        this.value$.pipe(
            tap(value => this.selected.emit(value)),
            takeUntil(this.unsubscribeSubject)
        ).subscribe()
    }
}
