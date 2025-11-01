import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {BaseSelectComponent} from '../base-input.component';
import {LocalidadeService, MessageService} from '../../../services/services';
import {Municipio} from '../../../models/entidades';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, switchMap, tap} from 'rxjs/operators';
import {isNotUndefinedNullOrEmpty, isNotUndefinedOrNull} from '../../../constantes';
import {of} from "rxjs";

@Component({
    selector: 'asc-select-municipio',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectMunicipioComponent extends BaseSelectComponent<Municipio> implements OnInit {

    private readonly parametroEmitter = new BehaviorSubject<AscSelectMunicipioParams>(null);

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: LocalidadeService) {
        super(messageService, changeDetectorRef, m => m.nome, m => m.id, 'Município');
    }

    override ngOnInit() {
        super.ngOnInit();
    }

    protected override carregarListOperator(): Observable<Municipio[]> {
        return this.parametroEmitter.pipe(
            distinctUntilChanged(),
            tap(() => this.showProgressBar = true),
            switchMap((param: AscSelectMunicipioParams) => {
                if (isNotUndefinedNullOrEmpty(param) && isNotUndefinedOrNull(param.idMunicipio)) {
                    return this.service.consultarMunicipiosPorUF(param.idMunicipio);
                }

                return of([]);
            }),
            tap(() => this.showProgressBar = false),
        );
    }

    @Input()
    set parametro(params: AscSelectMunicipioParams) {
        setTimeout(() => this.parametroEmitter.next(params), 0);
    }
}

export interface AscSelectMunicipioParams {
    idMunicipio: number
}
