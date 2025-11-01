import { Component, Input, OnInit } from '@angular/core';
import { PedidoProcedimento } from "../../../../../models/comum/pedido-procedimento";

@Component({
  selector: 'asc-asc-table-procedimentos',
  templateUrl: './asc-table-procedimentos.component.html',
  styleUrls: ['./asc-table-procedimentos.component.scss']
})
export class AscTableProcedimentosComponent {

  @Input() pedidosProcedimentos: PedidoProcedimento[]
  isEditing: any;


  editar(pedidoProcedimento: PedidoProcedimento, i: number) {
    console.log('editar');
  }

  remove(pedidoProcedimento: PedidoProcedimento) {
    console.log('remove');
  }
}
