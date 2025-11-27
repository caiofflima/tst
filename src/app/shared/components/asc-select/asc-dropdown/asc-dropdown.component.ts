import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {isNotUndefinedNullOrEmpty} from '../../../constantes';
import {AbstractControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MessageService} from '../../messages/message.service';
import {takeUntil, tap} from "rxjs/operators";
import {Dropdown} from "primeng/dropdown";

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
    private dropDown: Dropdown;
    @Input()
    index: number = null;

    private inputFilter: HTMLInputElement;
    private readonly value$ = new EventEmitter<any>()

    options: SelectItem[] = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];

    private readonly unsubscribeSubject = new Subject<void>();

    constructor(
        private readonly messageService: MessageService,
    ) {
        this.requiredMsg = 'MA007';
    }

    @Input()
    set items(items: SelectItem[]) {
        this.options = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];
        if (isNotUndefinedNullOrEmpty(items)) {
            this.options = [...this.options, ...items];
        }
    }

    ngOnInit(): void {
        this.requiredMsg = this.bundle(this.requiredMsg);
        this.registerOnChangeValue();
    }

    ngAfterViewInit() {
        this.inputFilter = this.dropDown.containerViewChild.nativeElement.querySelector('input.ui-dropdown-filter') as HTMLInputElement;
        if(!this.inputFilter)
        return
        this.inputFilter.onkeyup = this.onFiltro;
        this.inputFilter.onreset = this.onFiltro;

        this.control.statusChanges.subscribe(() => {
            if (!this.control.touched) {
                this.inputFilter.value = "";
                this.filter.emit("");
            }
        })
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
        this.value$.emit(valor.value)
    }

    private registerOnChangeValue(): void {
        this.value$.pipe(
            tap(value => this.selected.emit(value)),
            takeUntil(this.unsubscribeSubject)
        ).subscribe()
    }
}
