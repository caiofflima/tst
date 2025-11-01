import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Pedido } from "../../../../models/comum/pedido";
import { ConselhoProfissionalService } from '../../../../services/comum/conselho-profissional.service';
import { isNotUndefinedNullOrEmpty } from "../../../../constantes";
import { debounceTime, filter, map, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'asc-profissional-card',
  templateUrl: './profissional-card.component.html',
  styleUrls: ['./profissional-card.component.scss']
})

export class ProfissionalCardComponent implements OnInit, OnDestroy {
  private _processo: Pedido;
  private readonly processo$ = new EventEmitter<Pedido>();

  private readonly unsubscribe$ = new Subject<void>()

  constructor(
    private readonly conselhoProfissionalService: ConselhoProfissionalService
  ) {
  }

  ngOnInit() {
    this.extrairConselhoPedido();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete();
  }

  @Input() set processo(processo: Pedido) {
    this.processo$.emit(processo);
    this._processo = processo;
  }

  get processo() {
    return this._processo
  }

  profissional: any = {};

  private extrairConselhoPedido(): void {
    this.processo$.pipe(
      debounceTime(500),
      filter(isNotUndefinedNullOrEmpty),
      switchMap((processo: Pedido) => {
        return this.recuperarConselho(processo.idConselhoProfissional, processo);
      }),
    ).subscribe((res: { descricao: string, processo: Pedido }) => {
      const {processo} = res
      let cpfCnpj = (processo.cpf === null) ? processo.cnpj:processo.cpf;
      this.profissional = {
        conselho: res.descricao,
        cpfCnpj: cpfCnpj,
        conselhoNum: processo.numeroConselho,
        nome: processo.nomeProfissional,
        // conselhoUf: processo.estadoConselho.sigla,
        // uf: processo.municipioProfissional.estado.sigla,
        // municipio: processo.municipioProfissional.nome
      }
    })
  }

  private recuperarConselho(id, processo) {
    return this.conselhoProfissionalService.consultarConselhosProfissionaisPorId(id).pipe(
      takeUntil(this.unsubscribe$),
      map((res: { descricao: string }) => ({
        ...res,
        descricao: res.descricao || '',
        processo
      }))
    )
      ;
  }
}
