import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AscCardProcedimentoReembolsoBase} from "../models/asc-card-procedimento-reembolso-base";
import {ProcessoService} from "../../../../../services/comum/processo.service";
import {PatologiaService} from "../../../../../services/comum/patologia.service";
import {debounceTime, map, switchMap, take, tap} from "rxjs/operators";
import {Patologia} from "../../../../../models/comum/patologia";
import {CustomOperatorsRxUtil} from "../../../../../util/custom-operators-rx-util";
import {PedidoProcedimento} from "../../../../../models/comum/pedido-procedimento";
import {MedicamentoService} from "../../../../../services/comum/pedido/medicamento.service";
import {of} from "rxjs";
import {Medicamento} from "../../../../../models/comum/medicamento";

@Component({
  selector: 'asc-card-procedimento-reembolso-medicamento',
  templateUrl: './asc-card-procedimento-reembolso-medicamento.component.html',
  styleUrls: ['./asc-card-procedimento-reembolso-medicamento.component.scss']
})
export class AscCardProcedimentoReembolsoMedicamentoComponent extends AscCardProcedimentoReembolsoBase implements OnInit, OnDestroy {

  @Input() override permissoes:any;
  
  constructor(
    protected override readonly processoService: ProcessoService,
    protected readonly patologiaService: PatologiaService,
    protected readonly medicamentoService: MedicamentoService,
  ) {
    super(processoService)
  }

  override ngOnInit() {
    super.ngOnInit();
    this.registrarBuscaPatologiaPorId();
    this.registrarBuscaMedicamentoPorId();
  }

  private registrarBuscaPatologiaPorId(): void {
    this.pedidoProcedimento$.pipe(
      CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
      switchMap((pedidoProcedimento: PedidoProcedimento) => {
          if (!pedidoProcedimento.patologia) {
            return this.patologiaService.consultarPorId(pedidoProcedimento.idPatologia || pedidoProcedimento.idProcedimento)
          }
          return of(pedidoProcedimento.patologia)
        }
      ),
      CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
      tap((patologia: Patologia) => this._pedidoProcedimento.patologia = {...patologia}),
      take(1)
    ).subscribe()
  }

  private registrarBuscaMedicamentoPorId() {
    this.pedidoProcedimento$.pipe(
      CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
      debounceTime(200),
      switchMap((pedidoProcedimento: PedidoProcedimento) => {
          if (!pedidoProcedimento.medicamento) {
            return this.medicamentoService.carregarApresentacao(pedidoProcedimento.codigoMedicamento, pedidoProcedimento.idPatologia).pipe(
              map((medicamentos: Medicamento[]) => medicamentos.find((medicamento => medicamento.id === pedidoProcedimento.idGrauProcedimento))),
            )
          }
          return of(pedidoProcedimento.medicamento)
        }
      ),
      tap((medicamento: Medicamento) => this._pedidoProcedimento.medicamento = {...medicamento}),
      take(1)
    ).subscribe()
  }
}
