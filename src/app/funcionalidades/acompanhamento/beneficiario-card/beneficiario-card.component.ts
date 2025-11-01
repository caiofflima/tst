import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {Pedido} from "../../../shared/models/comum/pedido";
import {DateUtil} from "../../../shared/util/date-util";
import {filter, map, takeUntil, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty} from "../../../shared/constantes";
import {Beneficiario} from "../../../shared/models/comum/beneficiario";
import {Subject} from "rxjs";
import {Util} from "../../../arquitetura/shared/util/util";

@Component({
  selector: 'asc-ac-beneficiario-card',
  templateUrl: './beneficiario-card.component.html',
  styleUrls: ['./beneficiario-card.component.scss']
})
export class BeneficiarioCardComponent implements OnInit, OnDestroy {

  @Input() user: any;
  readonly processo$ = new EventEmitter<Pedido>()
  newdate = new Date();
  private _processo = new Pedido();

  beneficiario = new Beneficiario();

  idadeBeneficiario: number = 0;

  private readonly unsubscribe = new Subject<void>()

  constructor() {
    console.log(" ");
  }

  ngOnInit() {
    this.extrairdade();
    this.extrairBeneficiarioProcesso();
  }

  @Input()
  set processo(processo: Pedido) {
    this._processo = processo;
    this.processo$.emit(processo)

  }

  get processo() {
    return this._processo;
  }

  private extrairdade() {
    this.processo$.pipe(
      map((processo: Pedido) => processo.beneficiario.matricula.dataNascimento),
      filter(isNotUndefinedNullOrEmpty),
      map((dataNascimento: string) => Util.getDate(dataNascimento)),
      map((dataNascimento: Date) => DateUtil.minus(new Date(), dataNascimento)),
      tap((idade: number) => this.idadeBeneficiario = idade),
      takeUntil(this.unsubscribe)
    )
      .subscribe()
  }

  private extrairBeneficiarioProcesso() {
    this.processo$.pipe(
      map((processo: Pedido) => this.beneficiario = processo.beneficiario),
      takeUntil(this.unsubscribe)
    )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.unsubscribe.next()
    this.unsubscribe.complete();
  }
}
