import {Component, OnInit} from '@angular/core';
import {AscCardProcedimentoReembolsoBase} from "../models/asc-card-procedimento-reembolso-base";
import {ProcessoService} from "../../../../../services/comum/processo.service";
import {debounceTime, distinctUntilChanged, filter, map, switchMap, take, tap} from "rxjs/operators";
import {PedidoProcedimento} from "../../../../../models/comum/pedido-procedimento";
import {isNotUndefinedNullOrEmpty} from "../../../../../constantes";
import {EspecialidadeService} from "../../../../../services/comum/pedido/especialidade.service";
import {Especialidade} from "../../../../../models/credenciados/especialidade";
import {NumberUtil} from "../../../../../util/number-util";

@Component({
  selector: 'asc-card-procedimento-reembolso-consulta',
  templateUrl: './asc-card-procedimento-reembolso-consulta.component.html',
  styleUrls: ['./asc-card-procedimento-reembolso-consulta.component.scss']
})
export class AscCardProcedimentoReembolsoConsultaComponent extends AscCardProcedimentoReembolsoBase implements OnInit {

  constructor(
      protected override readonly processoService: ProcessoService,
      private readonly especialidadeService: EspecialidadeService
  ) {
    super(processoService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.registrarBuscaDeEspecialidade();
  }

  private registrarBuscaDeEspecialidade() {
    this.pedidoProcedimento$.pipe(
        debounceTime(100),
        filter(isNotUndefinedNullOrEmpty),
      map((pedidoProcedimento: PedidoProcedimento) => pedidoProcedimento.idEspecialidade),
      filter(isNotUndefinedNullOrEmpty),
      distinctUntilChanged(),
      filter((idEspecialidade: number) => isNotUndefinedNullOrEmpty(idEspecialidade)),
      switchMap((idEspecialidade: number) => this.especialidadeService.carregarPorId(idEspecialidade)),
      tap((especialidade: Especialidade) => this._pedidoProcedimento.especialidade = especialidade),
      take(1)
    ).subscribe()
  }

  valueAsNumber(value: string | number): number {
    return NumberUtil.convertStringToNumber(value);
  }
}
