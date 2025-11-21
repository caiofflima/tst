import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {isNotUndefinedNullOrEmpty} from '../../../constantes';
import {AbstractControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {MessageService} from '../../messages/message.service';
import {takeUntil, tap} from "rxjs/operators";

@Component({
    selector: 'asc-dropdown',
    templateUrl: './asc-dropdown.component.html',
    styleUrls: ['./asc-dropdown.component.scss'],
})
export class AscDropdownComponent implements OnInit, OnDestroy {

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
    @Input()
    index: number = null;

    private readonly value$ = new EventEmitter<any>()

    options: SelectItem[] = [{label: this.placeholder || this.bundle('MHSPH'), value: null}];

    get dscOptions(): any[] {
        return (this.options || []).map(item => ({
            label: item.label || '',
            value: item.value,
            disabled: item.disabled
        }));
    }

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
