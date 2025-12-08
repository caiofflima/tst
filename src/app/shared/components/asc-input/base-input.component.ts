import {MessageService} from 'app/shared/components/messages/message.service';
import {BaseComponent} from '../base.component';
import {
    ChangeDetectorRef,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList
} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms';
import {SelectItem} from 'primeng/api';
import * as constantes from '../../constantes';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {debounceTime, map, takeUntil, tap} from 'rxjs/operators';
import {Util} from '../../../arquitetura/shared/util/util';
import {of} from 'rxjs';
import { Option } from 'sidsc-components/dsc-select';

@Directive({
    selector: 'asc-input-error'
})
export class InputError {
    @Input()
    nomeErro: string;
    @Input()
    msgErro: string;
}

@Directive()
export abstract class BaseInputComponent extends BaseComponent implements OnInit {

    @ContentChildren(InputError)
    _errors: QueryList<InputError>;

    @Input()
    inputId: string = null;

    @Input()
    label: string;

    @Input()
    hint: string;

    @Input()
    requiredMsg: string;

    @Input()
    control: any;

    @Input()
    hide: boolean;

    @Output()
    valor$ = new EventEmitter<any>();

    @Input()
    required: boolean = false;

    @Input()
    disabled: boolean = false;

    @Input()
    index: number = null;

    @Input()
    uppercase: boolean = false;

    @Input()
    size: 'small' | 'standard' | 'large' = 'large';

    get errors(): InputError[] {
        return this._errors.filter(e => this.control && this.control.errors[e.nomeErro]);
    }

    protected constructor(
        messageService: MessageService,
        protected defaultLabel?: string
    ) {
        super(messageService);
        this.hide = false;
        this.requiredMsg = this.bundle('MA007');
        this.label = defaultLabel;
        this.control = new FormControl();
    }

    ngOnInit(): void {
        this.hint = this.hint ? this.bundle(this.hint) : null;
        this.requiredMsg = this.bundle(this.requiredMsg);
        this.control.valueChanges
        .pipe(
            debounceTime(500),
            tap(next => this.valor$.emit(next)),
            takeUntil(this.unsubscribe$)
        )
        .subscribe();
    }

    protected executeEmiter(emitter: EventEmitter<any>, e: any): void {
        if (emitter) {
            emitter.emit(e);
        }
    }

    public disable(): void {
        if (this.control) {
            this.control.disable();
        }
    }

    public enable(): void {
        if (this.control) {
            this.control.enable();
        }
    }

    get compStyle(): any {
        return !this.hide ? {'display': 'block'} : {'display': 'none'};
    }
}

@Directive()
export abstract class BaseSelectComponent<T> extends BaseInputComponent implements OnInit, OnDestroy {

    @Input()
    id: string;

    @Input()
    selectId: string;

    @Input()
    multiple: boolean;

    @Input()
    override hint: string;

    @Input()
    maxSelectedLabels: number;

    @Input()
    itemClass: string;

    @Output()
    onKeyup: EventEmitter<any>;

    @Output()
    onKeydown: EventEmitter<any>;

    @Output()
    onFocus: EventEmitter<any>;

    @Output()
    onBlur: EventEmitter<any>;

    @Output()
    onChange: EventEmitter<any>;

    @Output()
    onSelect: EventEmitter<any>;

    @Output()
    dados = new EventEmitter<T[]>();

    @Output()
    dadoSelecionado = new EventEmitter<T>();

    @Output()
    dadosCombo = new EventEmitter<SelectItem[]>();

    @Input()
    override index: number = null;

    @Input()
    placeholder: string;

    selectItems: SelectItem[];
    options: Option[] = [];

    showProgressBar = false;
    protected labelPadrao: (si: T) => string;
    protected valuePadrao: (si: T) => any;
    private readonly subscriptions: Subscription[] = [];
    private items: any[] = [];

    protected constructor(
        override readonly messageService: MessageService,
        protected readonly changeDetectorRef: ChangeDetectorRef,
        labelPadrao: (si: T) => string,
        valuePadrao: (si: T) => any,
        protected override  readonly  defaultLabel?: string,
    ) {
        super(messageService, defaultLabel);
        this.initEmitters();
        this.itemClass = '';
        this.selectItems = [];
        this.maxSelectedLabels = 4;
        this.requiredMsg = 'MA005';
        this.labelPadrao = labelPadrao;
        this.valuePadrao = valuePadrao;
    }

    override ngOnInit() {
        super.ngOnInit();
        this._atualizarDadoAtualizado();
        this._carregarLista();
    }

    private _carregarLista(): void {
        this.showProgressBar = true;
        this.carregarListOperator().subscribe((dados: any[]) => {
            this.gerarSelectItems(dados, this.valuePadrao);
            this.options = dados.map(item => ({
                  value: this.valuePadrao(item),
                  label: this.labelPadrao(item)
              }));
            this.executeEmiter(this.dados, dados)
            this.items = dados;
            this.showProgressBar = false;
            //console.log('_carregarLista',this.items)
            if (this.control.value) {
                if(this.items && this.items.length > 0){
                    const valor = this.items.find((item: { id: number, value?: any }) => item.id == this.control.value || item.value == this.control.value);
                    if (valor) {
                        this.dadoSelecionado.emit(valor as T)
                    }
                }
            }
        }, error => {
            this.showProgressBar = false;
            this.messageService.addMsgDanger(error.error)
        });
    }

    protected gerarSelectItems(list: T[], itemValue?: (i: T) => any, itemLabel?: (i: T) => string): void {
        //console.log('gerar select items ',list,itemValue,itemLabel)
        let toLabel = itemLabel ? itemLabel : this.labelPadrao;
        let toValue = itemValue ? itemValue : this.valuePadrao;
        if (!this.multiple) {
            this.selectItems = [];
        } else {
            this.selectItems = [];
        }
        constantes.genSelectItens<T>(list, toLabel, toValue, this.uppercase).forEach(item => this.selectItems.push(item));
        this.posCarregamentoSelectItens(this.selectItems);
    }

    protected carregarLista(observable: Observable<T[]>, selectItemValue?: (sp: T) => void): BehaviorSubject<T[]> {
        let subject = new BehaviorSubject<T[]>(null);
        observable.toPromise().then(next => {
            this.gerarSelectItems(next, selectItemValue);
            subject.next(next);
        });
        return subject;
    }

    protected cleanSelectItems() {
        this.selectItems = [];
    }

    onSelectn(e: any): void {
        this.executeEmiter(this.onSelect, e);
    }

    changeAction(e: any): void {
        this.executeEmiter(this.onChange, e);
    }

    blurAction(e: FocusEvent): void {
        this.executeEmiter(this.onBlur, e);
    }

    focusAction(e: FocusEvent): void {
        this.executeEmiter(this.onFocus, e);
    }

    keyDownAction(e: KeyboardEvent): void {
        this.executeEmiter(this.onKeydown, e);
    }

    keyUpAction(e: KeyboardEvent): void {
        this.executeEmiter(this.onKeyup, e);
    }

    public getLabelFromValue(value: any): string {
        let encontrado = this.selectItems.filter(i => i.value === value);
        if (encontrado && 0 < encontrado.length) {
            return encontrado[0].label;
        }
        return null;
    }

    private initEmitters() {
        this.onKeyup = new EventEmitter<any>();
        this.onKeydown = new EventEmitter<any>();
        this.onFocus = new EventEmitter<any>();
        this.onBlur = new EventEmitter<any>();
        this.onChange = new EventEmitter<any>();
    }

    protected carregarListOperator(): Observable<any> {
        return of({});
    }

    private _atualizarDadoAtualizado(): void {
        this.subscriptions.push(
            this.control.valueChanges.pipe(
                map(value => {
                    if (Array.isArray(this.items)) {
                        return this.items.find((item: { id: number, value?: any }) => item.id === value || item.value === value);
                    } else if (Array.isArray(this.selectItems)) {
                        return this.selectItems.find((s: SelectItem) => s.value === value);
                    }
                    return {};
                }),
            ).subscribe(value => {
                this.dadoSelecionado.emit(value as T);
                this.changeDetectorRef.markForCheck();
            }),
        );
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptions.filter(Util.notIsEmpty).forEach(sub => sub.unsubscribe());
    }

    protected posCarregamentoSelectItens(itensCarregados: SelectItem[]) {
        //no aguardo de funcionalidades
    }
}
