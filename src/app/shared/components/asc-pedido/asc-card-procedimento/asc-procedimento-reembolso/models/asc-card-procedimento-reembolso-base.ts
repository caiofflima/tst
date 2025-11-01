import {Directive, Input, OnDestroy, OnInit} from "@angular/core";
import {PedidoProcedimento} from "../../../../../models/comum/pedido-procedimento";
import {ReplaySubject, Subject} from "rxjs";
import {ProcessoService} from "../../../../../services/comum/processo.service";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from "../../../../../constantes";
import {Pedido} from "../../../../../models/comum/pedido";
import {PermissoesSituacaoProcesso} from "../../../../../models/fluxo/permissoes-situacao-processo";

@Directive()
export abstract class AscCardProcedimentoReembolsoBase implements OnInit, OnDestroy {


  protected _pedidoProcedimento: PedidoProcedimento;
  protected readonly pedidoProcedimento$ = new ReplaySubject<PedidoProcedimento>(1);
  protected readonly unsubscribe$ = new Subject<void>();
  @Input() permissoes: PermissoesSituacaoProcesso;

  loading = false;

  protected constructor(protected readonly processoService: ProcessoService) {
  }


  @Input() set pedidoProcedimento(pedidoProcedimento: PedidoProcedimento) {
    setTimeout(() => {
      this._pedidoProcedimento = pedidoProcedimento
      this.pedidoProcedimento$.next(pedidoProcedimento)
    }, 0);
  }

  get pedidoProcedimento() {
    return this._pedidoProcedimento;
  }

  ngOnInit(): void {
    this.registrarBuscaDeAutorizacaoPreviaPorId();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private registrarBuscaDeAutorizacaoPreviaPorId() {
    this.pedidoProcedimento$.pipe(
        debounceTime(500),
        filter(isNotUndefinedNullOrEmpty),
        distinctUntilChanged((x: PedidoProcedimento, y: PedidoProcedimento) => x.id !== y.id),
        map((pedidoProcedimento: PedidoProcedimento) => pedidoProcedimento.idAutorizacaoPrevia),
        filter(isNotUndefinedNullOrEmpty),
        filter(() => isUndefinedNullOrEmpty(this._pedidoProcedimento.autorizacaoPrevia)),
        switchMap((idAutorizacaoPrevia: number) => this.processoService.consultarPorId(idAutorizacaoPrevia)),
        tap((autorizacaoPrevia: Pedido) => this._pedidoProcedimento.autorizacaoPrevia = autorizacaoPrevia),
        take(1)
    ).subscribe()
  }

}
