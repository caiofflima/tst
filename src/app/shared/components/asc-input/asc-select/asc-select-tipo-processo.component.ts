import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MessageService} from '../../../services/services';
import {TipoProcesso} from '../../../models/comum/tipo-processo';
import {BaseSelectComponent} from '../base-input.component';
import {Observable} from 'rxjs';
import {TipoProcessoAcaoService} from '../../../models/comum/tipo-processo-acao-service';
import {isUndefinedNullOrEmpty} from '../../../constantes';
import {TipoBuscaProcesso} from '../../../models/tipo-busca-processo';
import { TipoProcessoService } from 'app/shared/services/comum/tipo-processo.service';

@Component({
    selector: 'asc-select-tipo-processo',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectTipoProcessoComponent extends BaseSelectComponent<TipoProcesso> implements OnInit {

    @Input()
    tipoBusca: TipoProcessoAcaoService;

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: TipoProcessoService,
    ) {
        super(messageService, changeDetectorRef, tp => tp.nome, tp => tp.id, 'Tipo de Pedido');
    }

    protected override carregarListOperator(): Observable<TipoProcesso[]> {
        if (isUndefinedNullOrEmpty(this.tipoBusca)) {
            return TipoBuscaProcesso.CONSULTAR_TODOS.action(this.service);
        }
        console.log(this.tipoBusca)
        return this.tipoBusca.action(this.service);
    }

    public carregarListaTodos(): void {
        this.carregarLista(this.service.consultarTodos());
    }

    public carregarListaProcessoReembolso(): void {
        this.carregarLista(this.service.consultarTiposProcessoReembolso());
    }
}
