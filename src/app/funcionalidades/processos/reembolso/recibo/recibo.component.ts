import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {ParamMap} from "@angular/router";

@Component({
  selector: 'asc-recibo',
  templateUrl: './recibo.component.html',
  styleUrls: ['./recibo.component.scss']
})
export class ReciboComponent {

  idProcesso$ = this.activatedRoute.paramMap.pipe(
    map((param: ParamMap) => param.get('idPedido')),
    map(Number)
  )

  constructor(
    private readonly activatedRoute: ActivatedRoute
  ) {
  }
}
