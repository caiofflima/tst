import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ComponentePedidoComponent} from '../../../../../app/shared/components/pedido/componente-pedido.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {ComponenteNotificavel} from '../../../../../app/shared/components/pedido/componente-notificavel';
import {HistoricoProcessoService} from '../../../../../app/shared/services/comum/historico-processo.service';
import {ComposicaoPedidoService} from '../../../../../app/shared/services/components/composicao-pedido.service';
import {Data} from '../../../../../app/shared/providers/data';
import {take} from "rxjs/operators";
import {SituacaoPedido} from "../../../models/comum/situacao-pedido";

@Component({
    selector: 'asc-historico-processo',
    templateUrl: './historico-processo.component.html',
    styleUrls: ['./historico-processo.component.scss']
})
export class AscHistoricoProcessoComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

    listaHistoricoProcesso: any[];

    constructor(protected override messageService: MessageService, protected override composicaoPedidoService: ComposicaoPedidoService,
                protected override router: Router, protected override data: Data, private historicoProcessoService: HistoricoProcessoService) {
        super(messageService, composicaoPedidoService, router, data);
        this.listaHistoricoProcesso = [];
    }

    override ngOnInit() {
        this.composicaoPedidoService.registrarObserver(this);
    }

    public atualizarInformacoes(idPedido: number): void {
        this.carregarListaHistoricoProcesso(idPedido);
    }

    private carregarListaHistoricoProcesso(idPedido: number): void {
        if (this.pedido.id && idPedido) {
            this.historicoProcessoService.consultarPorIdPedido(idPedido).pipe(
                take<SituacaoPedido[]>(1)
            ).subscribe(res => {
                this.listaHistoricoProcesso = res;
            }, error => this.showDangerMsg(error.error));
        }
    }


    public override notificarComponentes(idPedido: number): void {
        super.notificarComponentes(idPedido);
    }
}
