import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {MessageService} from "../../../services/services";
import {BaseSelectComponent} from "../base-input.component";
import {MotivoNegacao} from "../../../models/comum/motivo-negacao";
import { MotivoNegacaoService } from 'app/shared/services/comum/motivo-negacao.service';

@Component({
    selector: 'asc-select-motivo-negacao',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectMotivoNegacaoComponent extends BaseSelectComponent<MotivoNegacao> implements OnInit {

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: MotivoNegacaoService) {
        super(messageService, changeDetectorRef, mn => mn.titulo, mn => mn.id);
    }

    @Input()
    set carregamentoProcedimentosPorPedido(id: number) {
        if (this.selectItems || this.selectItems.length === 0 && id && id > 0)
            this.carregarListaProcedimentoPorPedido(id);
    }

    public carregarListaProcedimentoPorPedido(idPedido: number): void {
        let observable = this.service.consultarMotivosNegacaoProcedimentoPorPedido(idPedido);
        this.carregarLista(observable);
    }

}
