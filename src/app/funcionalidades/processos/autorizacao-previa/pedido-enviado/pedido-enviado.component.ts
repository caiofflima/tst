import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, switchMap, take} from 'rxjs/operators';
import {ParamMap} from '@angular/router/';
import {AutorizacaoPreviaService} from '../../../../shared/services/comum/pedido/autorizacao-previa.service';
import {Pedido} from '../../../../shared/models/comum/pedido';
import {MotivoSolicitacaoService} from '../../../../shared/services/comum/motivo-solicitacao.service';
import {MotivoSolicitacao} from '../../../../shared/models/comum/motivo-solicitacao';
import {PdfExport} from "../../../../shared/pdf";

@Component({
  selector: 'asc-pedido-enviado',
  templateUrl: './pedido-enviado.component.html',
  styleUrls: ['./pedido-enviado.component.scss'],
})
export class PedidoEnviadoComponent implements OnInit {

  pedido: any;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
    private readonly motivoSolicitacaoService: MotivoSolicitacaoService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      map((param: ParamMap) => Number(param.get('idPedido'))),
      switchMap((idPedido: number) => this.autorizacaoPreviaService.consultarPorId(idPedido)),
      mergeMap((pedido: Pedido) => this.motivoSolicitacaoService.consultarPorId(pedido.idMotivoSolicitacao)
        .pipe(map((finalidade: MotivoSolicitacao) => ({
          ...pedido,
          finalidade,
        })))),

      take(1)
    ).subscribe((pedido: any) => this.pedido = pedido);
  }

  public exportarPDF(nomeArquivo: string, nomeDiv: string): void {
    PdfExport.export(nomeArquivo, nomeDiv);
  }
}
