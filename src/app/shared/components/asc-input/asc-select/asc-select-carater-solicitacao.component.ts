import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MessageService} from '../../../services/services';
import {CaraterSolicitacao} from '../../../models/comum/carater-solicitacao';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import { CaraterSolicitacaoService } from 'app/shared/services/comum/carater-solicitacao.service';

@Component({
    selector: 'asc-select-carater-solicitacao',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectCaraterSolicitacaoComponent extends BaseSelectComponent<CaraterSolicitacao> implements OnInit {
    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly caraterSolicitacaoService: CaraterSolicitacaoService
    ) {
        super(
            messageService,
            changeDetectorRef,
            (caraterSolicitacao: CaraterSolicitacao) => caraterSolicitacao.nome,
            (caraterSolicitacao: CaraterSolicitacao) => caraterSolicitacao.id,
            ''
        );
    }

    protected override carregarListOperator(): Observable<CaraterSolicitacao[]> {
        return this.caraterSolicitacaoService.consultarTodos();
    }
}
