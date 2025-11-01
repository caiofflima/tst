import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ComponentePedidoComponent} from '../../../../../app/shared/components/pedido/componente-pedido.component';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';
import {ComponenteNotificavel} from '../../../../../app/shared/components/pedido/componente-notificavel';
import {MensagemPedidoService} from '../../../../../app/shared/services/comum/mensagem-enviada.service';
import {ComposicaoPedidoService} from '../../../../../app/shared/services/components/composicao-pedido.service';
import {Data} from '../../../../../app/shared/providers/data';
import {MensagemPedido} from '../../../../../app/shared/models/comum/mensagem-pedido';

@Component({
  selector: 'asc-mensagens-enviadas',
  templateUrl: './mensagens-enviadas.component.html',
  styleUrls: ['./mensagens-enviadas.component.scss']
})
export class AscMensagensEnviadasComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

  listaMensagensPedido: any[];

  constructor(
    private fb: FormBuilder,
    protected override messageService: MessageService,
    protected override composicaoPedidoService: ComposicaoPedidoService,
    protected override router: Router,
    protected override data: Data,
    private mensagemPedidoService: MensagemPedidoService
  ) {
    super(messageService, composicaoPedidoService, router, data);
    this.listaMensagensPedido = [];
  }

  public override ngOnInit(): void {
    this.composicaoPedidoService.registrarObserver(this);
  }

  public atualizarInformacoes(idPedido: number): void {
    this.carregarMensagensEnviadas();
  }

  public carregarMensagensEnviadas(): void {
    this.mensagemPedidoService.consultarPorIdPedido(this.pedido.id).subscribe(res => {
      this.listaMensagensPedido = res
    }, error => this.showDangerMsg(error.error));
  }

  public detalharMensagem(mensagem: MensagemPedido): void {
    if (mensagem.lido && mensagem.lido == 'NAO') {
      this.mensagemPedidoService.atualizarMensagemPedidoLida(mensagem.id).subscribe(() => {
        mensagem.lido = 'SIM';
      }, error => {
        this.messageService.showDangerMsg(error.message);
      });
    }
  }
}
