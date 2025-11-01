import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'asc-procedimento-pedido-card',
  templateUrl: './procedimento-pedido-card.component.html',
  styleUrls: ['./procedimento-pedido-card.component.scss']
})
export class ProcedimentoPedidoCardComponent {

  // index do procedimento em edição
  inEdicao: number = -1;

  procedimentoForm = new FormGroup({
    procedimento: new FormControl(),
    quantidade: new FormControl(),
    grau: new FormControl()
  });

  procedimentos: Array<any> = [
    {
      procedimento: '30307147 - tratamento ocular',
      grau: 'Despesas hospitalares',
      quantidade: 5,
      id: null,
      openModal: false
    },
    {
      procedimento: '30307147 - tratamento ocular',
      grau: 'Despesas hospitalares',
      quantidade: 5,
      id: null,
      openModal: false
    },
  ].map((ele: any, key: number) => ele = {...ele, id: key});

  editarProcedimento(procedimento: any): void {
    this.inEdicao = procedimento.id;
  }

  excluirProcedimento(procedimento: any): void {
    this.procedimentos.splice(procedimento.id, 1);
  }

}
