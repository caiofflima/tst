import {Component, Input, OnInit} from '@angular/core';
import {ComposicaoPedidoService} from '../../../../../app/shared/services/components/composicao-pedido.service';
import {ProgressoDTO} from '../../../../../app/shared/models/dto/progresso';
import {PrazoTratamentoService} from '../../../../../app/shared/services/comum/prazo-tratamento.service';
import {ComponenteNotificavel} from '../componente-notificavel';
import {Data} from '../../../../../app/shared/providers/data';
import {Pedido} from '../../../../../app/shared/models/comum/pedido';
import {take} from "rxjs/operators";
import {MessageService} from "../../messages/message.service";

@Component({
    selector: 'asc-progresso-prazo',
    templateUrl: './progresso-prazo.component.html',
    styleUrls: ['./progresso-prazo.component.scss']
})
export class AscProgressoPrazoComponent implements OnInit, ComponenteNotificavel {

    @Input('pedido')
    pedido: Pedido;

    progresso: ProgressoDTO;

    styleMensagem: any = {};
    stylePrazo: any = {'width': '0%'};
    stylePrazoAtraso: any = {'width': '0%'};

    exibir: boolean = false;

    constructor(
        private readonly prazoTratamentoService: PrazoTratamentoService,
        private readonly composicaoPedidoService: ComposicaoPedidoService,
        private readonly messageService: MessageService,
        protected readonly data: Data
    ) {
    }


    atualizarInformacoes(idPedido: number): void {
        this.pedido = new Pedido();
        this.pedido.id = idPedido;
        this.atualizarProgresso();
    }


    public ngOnInit(): void {
        if (this.pedido == null && this.data.storage.pedido) {
            this.pedido = this.data.storage.pedido;
            this.atualizarProgresso();
        }
        this.composicaoPedidoService.registrarObserver(this);
    }

    public atualizarProgresso() {
        this.prazoTratamentoService.consultarProgressoPrazoPorPedido(this.pedido.id).pipe(
            take<ProgressoDTO>(1)
        ).subscribe(res => {
            this.atualizarDados(res);
        }, err => {
            this.messageService.addMsgDanger(err.error);
            this.exibir = false;
        });
    }


    private atualizarDados(progresso: ProgressoDTO) {

        if (progresso && progresso.mensagem.length > 0) {
            this.progresso = progresso;
            this.stylePrazo.width = this.progresso.percentualDias + '%';
            this.stylePrazoAtraso.width = this.progresso.percentualDiasAtraso + '%';

            if (this.progresso.dias > 0) {
                this.stylePrazo['min-width'] = '17px';
            }

            if (this.progresso.diasAtraso > 0) {
                this.styleMensagem = {'color': '#d61010c2'};
            } else {
                this.styleMensagem = {};
            }

            this.exibir = true;

        } else {
            this.exibir = false;
        }
    }

    public descricaoDias(): string {
        if (this.progresso.dias == 1) {
            return this.progresso.dias + " dia";
        }
        if (this.progresso.dias > 1) {
            return this.progresso.dias + " dias";
        }
        return "";
    }

    public descricaoDiasAtraso(): string {
        if (this.progresso.diasAtraso == 1) {
            return this.progresso.diasAtraso + " dia em atraso";
        }
        if (this.progresso.diasAtraso > 1) {
            return this.progresso.diasAtraso + " dias em atraso";
        }
        return "";
    }
}
