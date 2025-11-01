import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Pedido } from "app/shared/models/entidades";
import { MessageService, ProcessoService } from "app/shared/services/services";
import { Location } from '@angular/common';
@Component({
  selector: "app-informacoes-pedido",
  templateUrl: "./informacoes-pedido-detail.component.html",
  styleUrls: ["./informacoes-pedido-detail.component.scss"],
})
export class InformacoesPedidoDetailComponent implements OnInit {
  
  pedido: Pedido = null;
  idPedido: number = null;

  constructor(private pedidoService: ProcessoService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private location: Location) {

  }

  ngOnInit() {
    this.idPedido = this.route.snapshot.params['idPedido'];

    this.pedidoService.consultarPorId(this.idPedido).subscribe( res => {
      if (res) {
        this.pedido = res;
        console.log(this.pedido)
      }
    },
    (err) => {
      this.messageService.addMsgDanger(err.error);
    }
  );
  }

  public redirectMeusProcessos() {
    this.router.navigate([
      `meus-dados/pedidos`,
    ]);
}

  public backButton(): void {
    this.location.back();
  }
}
