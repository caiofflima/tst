import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseSelectComponent} from '../base-input.component';
import {MessageService, MotivoSolicitacaoService} from '../../../services/services';
import {MotivoSolicitacao} from '../../../models/comum/motivo-solicitacao';
import {TipoFinalidadeAcaoService} from '../../../models/comum/tipo-processo-acao-service';
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from '../../../constantes';
import {catchError, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TipoBuscaMotivoSolicitacao} from '../../../models/tipo-busca-motivo-solicitacao';
import {of} from 'rxjs';

@Component({
    selector: 'asc-select-finalidade',
    templateUrl: 'asc-select.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AscSelectFinalidadeComponent extends BaseSelectComponent<MotivoSolicitacao> implements OnInit, OnDestroy {

    private readonly idTipoProcessoAndIdBeneficio$ = new EventEmitter<{
        idTipoProcesso?: number,
        idBeneficiario?: number
    }>();


    @Input()
    tipoAcao: TipoFinalidadeAcaoService;

    constructor(
        override readonly  messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: MotivoSolicitacaoService,
    ) {
        super(messageService, changeDetectorRef, (ms: MotivoSolicitacao) => ms.nome, (ms: MotivoSolicitacao) => ms.id, 'Finalidade');
    }

    protected override carregarListOperator(): Observable<MotivoSolicitacao[]> {
        if (isUndefinedNullOrEmpty(this.tipoAcao)) {
            return TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_TODAS.action(this.service)();
        }
        const action = this.tipoAcao.action(this.service);
        return this.idTipoProcessoAndIdBeneficio$.pipe(
            distinctUntilChanged(),
            filter(isNotUndefinedNullOrEmpty),
            tap(() => this.showProgressBar = true),
            switchMap(({
                           idTipoProcesso,
                           idBeneficiario
                       }) => {
                return action(idTipoProcesso, idBeneficiario);
            }),
            catchError(() => of([])),
            tap(() => this.showProgressBar = false),
        );
    }

    @Input()
    set idTipoProcessoAndIdBeneficiario(idTipoProcessoAndIdBeneficiario: {
        idTipoProcesso?: number,
        idBeneficiario?: number
    }) {
        setTimeout(() => this.idTipoProcessoAndIdBeneficio$.emit(idTipoProcessoAndIdBeneficiario), 0);
    }
}
