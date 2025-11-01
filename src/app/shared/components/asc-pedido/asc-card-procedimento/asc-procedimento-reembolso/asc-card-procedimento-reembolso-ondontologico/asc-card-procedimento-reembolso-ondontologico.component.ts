import { Component, OnDestroy, OnInit } from '@angular/core';
import { AscCardProcedimentoReembolsoBase } from "../models/asc-card-procedimento-reembolso-base";
import { ProcessoService } from "../../../../../services/comum/processo.service";
import { distinctUntilChanged, filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { GrauProcedimentoService } from "../../../../../services/comum/grau-procedimento.service";
import { PedidoProcedimento } from "../../../../../models/comum/pedido-procedimento";
import { ProcedimentoService } from "../../../../../services/comum/procedimento.service";
import { Procedimento } from "../../../../../models/comum/procedimento";
import { isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty } from "../../../../../constantes";
import { MessageService } from "../../../../../services/services";
import { HttpUtil } from "../../../../../util/http-util";
import { AutorizacaoPreviaPedidoPipe } from 'app/shared/pipes/autorizacao-previa-pedido.pipe';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'asc-card-procedimento-reembolso-ondontologico',
  templateUrl: './asc-card-procedimento-reembolso-ondontologico.component.html',
  styleUrls: ['./asc-card-procedimento-reembolso-ondontologico.component.scss']
})
export class AscCardProcedimentoReembolsoOndontologicoComponent extends AscCardProcedimentoReembolsoBase implements OnInit, OnDestroy {

  constructor(
   protected override readonly processoService: ProcessoService,
    private readonly procedimentoService: ProcedimentoService,
   private readonly messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {
    super(processoService)
  }

  override ngOnInit() {
    super.ngOnInit();
    this.registrarBuscaProcedimento();
  }

  private registrarBuscaProcedimento() {
    this.pedidoProcedimento$.pipe(
      distinctUntilChanged(),
      filter(isNotUndefinedNullOrEmpty),
      filter((pedidoProcedimento: PedidoProcedimento) => isUndefinedNullOrEmpty(pedidoProcedimento.procedimento)),
      HttpUtil.catchError(this.messageService),
      switchMap((pedidoProcedimento: PedidoProcedimento) => this.procedimentoService.consultarPorId(pedidoProcedimento.idProcedimento)),
      tap((procedimento: Procedimento) => this.pedidoProcedimento.procedimento = procedimento),
      takeUntil(this.unsubscribe$)
    ).subscribe()
  }

  get textoFormatadoAutorizacaoPrevia(){
    let textoApresentar = '-'
    if( this.pedidoProcedimento && this.pedidoProcedimento.autorizacaoPrevia ){
      textoApresentar = new AutorizacaoPreviaPedidoPipe().transform( this.pedidoProcedimento.autorizacaoPrevia );
      return this.sanitizer.bypassSecurityTrustHtml( textoApresentar )
    }
    return textoApresentar 
    
    
  }
}
