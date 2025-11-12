import { Component, OnInit } from '@angular/core';
import { ProcessosComponent } from 'app/funcionalidades/processos/processos.component';

@Component({
  selector: 'asc-consulta-processo-pl',
  templateUrl: './consulta-processo-pl.component.html',
  styleUrls: ['./consulta-processo-pl.component.scss']
})
export class ConsultaProcessoPlComponent {

  processos: Array<any> = [
    {
      processo: 1781,
      tipoProcesso: 'APR-PAD',
      tipoBeneficiario: 'Cdir',
      filial: 7046,
      beneficiario: 'Anderson Dantas Pereira',
      situacaoAtual: 'Aguardando documentação complementar',
      status: 'success',
      ultimaAtualizacao: '08/052020 13:59:53'
    },
    {
      processo: 1781,
      tipoProcesso: 'APR-PAD',
      tipoBeneficiario: 'Cdir',
      filial: 7046,
      beneficiario: 'Anderson Dantas Pereira',
      situacaoAtual: 'Aguardando documentação complementar',
      status: 'info',
      ultimaAtualizacao: '08/052020 13:59:53'
    },
    {
      processo: 1781,
      tipoProcesso: 'APR-PAD',
      tipoBeneficiario: 'Cdir',
      filial: 7046,
      beneficiario: 'Anderson Dantas Pereira',
      situacaoAtual: 'Aguardando documentação complementar',
      status: 'error',
      ultimaAtualizacao: '08/052020 13:59:53'
    },
    {
      processo: 1781,
      tipoProcesso: 'APR-PAD',
      tipoBeneficiario: 'Cdir',
      filial: 7046,
      beneficiario: 'Anderson Dantas Pereira',
      situacaoAtual: 'Aguardando documentação complementar',
      status: 'error',
      ultimaAtualizacao: '08/052020 13:59:53'
    },
  ];

  onHover: Array<boolean> = this.processos.map(() => false);

  onEnter(index:number) { 
    this.onHover.map((ele, indice) => {
      if(indice===index ) {
        ele = true;
      }else {
        ele = false;
      }
    })
  };

  onLeave() { 
    this.onHover.map((ele) => {
      ele = false;
    }); 
  };

}
