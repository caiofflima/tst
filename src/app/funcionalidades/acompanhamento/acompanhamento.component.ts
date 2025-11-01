import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessoService} from "../../shared/services/comum/processo.service";
import {map, switchMap, tap} from "rxjs/operators";
import {ParamMap} from "@angular/router";
import {Pedido} from "../../shared/models/comum/pedido";
import {PedidoProcedimento} from "../../shared/models/entidades";
import {fadeAnimation} from "../../shared/animations/faded.animation";

@Component({
  selector: 'asc-acompanhamento-generico',
  templateUrl: './acompanhamento.component.html',
  styleUrls: ['./acompanhamento.component.scss'],
  animations: [...fadeAnimation]
})
export class AcompanhamentoComponent implements OnInit {
  processo: Pedido = new Pedido();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly processoService: ProcessoService
  ) {
  }

  ngOnInit() {
    console.log('aqui sssss')
    this.registrarBuscaProcesso()
  }

  private registrarBuscaProcesso(): void {
    this.activatedRoute.paramMap.pipe(
      map((param: ParamMap) => param.get('idPedido')),
      map(Number),
      switchMap((idPedido: number) => this.processoService.consultarPorId(idPedido)),
      tap((pedido: Pedido) => this.processo = pedido),
    )
      .subscribe()
  }

  porcentagem: number = 0;

  color: string;
  idPedido: number;

  goToTop() {
    window.scrollTo(0, 0);
  }

  increase() {
    this.porcentagem += 10;
  }

  setColor() {
    if (this.porcentagem <= 50) {
      return "#17A2B8";
    } else if (this.porcentagem > 50 && this.porcentagem <= 80) {
      return "orange";
    } else {
      return "red";
    }
  }

  pedidoProcedimentosAtualizados(pedidoProcedimentos: PedidoProcedimento[]) {
    console.log('pedidoProcedimentosAtualizados');
  }

}
