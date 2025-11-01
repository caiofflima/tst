import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'asc-procedimento-pedido-card',
  templateUrl: './procedimento-pedido-card.component.html',
  styleUrls: ['./procedimento-pedido-card.component.scss']
})
export class ProcedimentoPedidoCardComponent {

  procedimentos: Array<any> = [
    {
      procedimento: '30307147 - tratamento ocular',
      grau: 'Despesas hospitalares',
      quantidade: 5
    },
    {
      procedimento: '30307147 - tratamento ocular',
      grau: 'Despesas hospitalares',
      quantidade: 5
    },
  ]

}
