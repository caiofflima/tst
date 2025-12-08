import {Entity} from '../../../../arquitetura/shared/models/entity';
import {Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {isNotUndefinedNullOrEmpty, isNotUndefinedOrNull} from '../../../constantes';
import {debounceTime, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MessageService} from "../../../services/services";
import {SelectItem} from "primeng/api";
import {of} from "rxjs";
import {HttpUtil} from "../../../util/http-util";
import { Option } from 'sidsc-components/dsc-select';


@Directive()
export abstract class BaseSelectControlValueAcessor<T extends Entity, P, O> implements OnInit, OnDestroy, ControlValueAccessor {

    @Input()
    id: string;

    @Input()
    label: string;

    @Input()
    isReadonly = false;

    @Input()
    required: boolean = false;

    @Input()
    control: AbstractControl = new FormControl();

    @Input()
    tipoAcaoService: O;

    @Output()
    readonly dadoSelecionado = new EventEmitter<T>();

    @Output()
    readonly dadosBackend = new EventEmitter<T[]>();

    @Output()
    readonly change = new EventEmitter<any>();

    protected resetOnChange = true;

    protected dados: T[];
    params: P;

    protected readonly paramsEmitter = new Subject<P>();

    innerValue: any;
    showProgressBar = false;

    readonly dados$ = this.paramsEmitter.pipe(
        debounceTime(100),
        filter((param: P) => this.filtrarPor(param)),
        tap(() => this.showProgressBar = true),
        switchMap(this.definirServico()),
        tap((data: T[]) => this.dadosBackend.emit(data)),
        tap((data: T[]) => this.adicionarDados(data)),
        map((data: T[]) => this.transformarObjetosParaSelectItems(data)),
        HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService, () => this.showProgressBar = false),
        tap(() => this.showProgressBar = false)
    );
    protected unsubscribingSubject = new Subject<void>();

    protected constructor(protected messageService: MessageService) {
    }

    onChangeCallback: (_: any) => void = () => {
        // Usado pelas classes filhas.
    };

    onTouchedCallback: (_: any) => void = () => {
        // Usado pelas classes filhas.
    };

    updateValue(value) {
        this.value = value;
        this.change.emit(value);
    }

    set value(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;

            if (isNotUndefinedOrNull(this.dados) && value) {
                const dadoSelecionado = this.dados.find(this.predicateToFindItemSelected());
                this.dadoSelecionado.emit(dadoSelecionado);
            } else if (this.resetOnChange) {
                this.control.setValue(null);
                this.dadoSelecionado.emit(null);
            }

            // Propaga para o formulário (ControlValueAccessor)
            this.onChangeCallback(this.innerValue);
            if (this.control && this.control.value !== this.innerValue) {
                this.control.setValue(this.innerValue);
                this.control.updateValueAndValidity();
            }
        }
    }

    protected predicateToFindItemSelected() {
        return (data: T | any) => data && data.id === this.innerValue;
    }

    get value() {
        return this.innerValue;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isReadonly = isDisabled;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }

    ngOnDestroy(): void {
        this.unsubscribingSubject.next();
        this.unsubscribingSubject.complete();
    }

    ngOnInit() {
        this.registrarResultadoDaBuscaNoBackend();
    }

    private registrarResultadoDaBuscaNoBackend() {
        this.dadosBackend.pipe(
            takeUntil(this.unsubscribingSubject)
        ).subscribe((dados: T[]) => {
            if (isNotUndefinedNullOrEmpty(dados)) {
                const dadoSelecionado = dados.find(procedimento => procedimento.id === this.innerValue);
                this.dadoSelecionado.emit(dadoSelecionado);
            } else if (this.resetOnChange) {
                this.control.setValue(null);
                this.dadoSelecionado.emit(null);
            }
        })
    }

    @Input()
    set parametros(params: P) {
        console.log('this.params', this.params);
        console.log('params', params);

        if (JSON.stringify(this.params) !== JSON.stringify(params)) {
            this.params = params;
            setTimeout(() => this.paramsEmitter.next(params), 0);
        }
    }

    @Input()
    set standalone(standalone: boolean) {
        if (standalone) {
            setTimeout(() => this.paramsEmitter.next({} as any), 0);
        }
    }

    /**
     * Caso seja necessário restringir a lista dependendo de algum parâmetro, defina aqui.
     */
    filtrarPor(_param: P): boolean {
        return true;
    }

    definirServico(): (p?: P) => Observable<T[]> {
        return (p1: P) => {
            return this.getServiceObservable(p1);
        };
    }

    /**
     * A sobrescrita desse método ou do 'definirServico' é mandatória.
     */
    getServiceObservable(_p?: P): Observable<T[]> {
        return of([]);
    }

    abstract transformarObjetosParaSelectItems(data: T[]): SelectItem[];


    private adicionarDados(data: T[]) {
        if (data && data.length) {
            this.dados = data;
        }
    }
}
