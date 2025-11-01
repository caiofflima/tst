import {Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../../app/shared/components/base.component';
import {MessageService} from '../../../../app/shared/components/messages/message.service';
import {ComposicaoPedidoService} from '../../../../app/shared/services/components/composicao-pedido.service';
import {Pedido} from '../../../../app/shared/models/comum/pedido';
import {Data} from '../../../../app/shared/providers/data';


@Directive()
export class ComponentePedidoComponent extends BaseComponent implements OnInit {

    @Input()
    rascunhoPedido: boolean;

    @Input('pedido')
    pedido: Pedido;

    @Input('permissoesProcesso')
    permissoes: any;

    @Output('onSuccess')
    emitter: EventEmitter<any>;

    constructor(
        protected override messageService: MessageService,
        protected composicaoPedidoService: ComposicaoPedidoService,
        protected router: Router,
        protected data: Data) {
        super(messageService);
        this.emitter = new EventEmitter<any>();
        this.rascunhoPedido = false;
    }

    ngOnInit() {
        if (this.data.storage.pedido) {
            this.pedido = this.data.storage.pedido;
        }
        if (!this.pedido) {
            console.error('Favor fornecer o pedido na declaração do componente. Por ex.: <asc-comp [pedido]="pedido">... ');
            this.router.navigateByUrl('home');
        }
    }

    public show(): boolean {
        let flg = false;
        if (!this.pedido) {
            console.error('O componente foi declarado mas o pedido não foi definido.');
        } else {
            flg = true;
        }
        return flg;
    }

    public hasAcaoAcesso(): boolean {
        return this.permissoes ? this.permissoes.acessar : false;
    }

    public hasAcaoUpload(): boolean {
        return this.permissoes ? this.permissoes.upload : false;
    }

    public hasAcaoAnalise(): boolean {
        return this.permissoes ? this.permissoes.analisar : false;
    }

    protected notificarComponentes(idPedido: number): void {
        this.composicaoPedidoService.notificarObservers(idPedido);
        this.emitter.emit(idPedido);
    }
}
