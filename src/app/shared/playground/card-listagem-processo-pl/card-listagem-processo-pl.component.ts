import { Component, Input } from '@angular/core';

@Component({
  selector: 'asc-card-listagem-processo-pl',
  templateUrl: './card-listagem-processo-pl.component.html',
  styleUrls: ['./card-listagem-processo-pl.component.scss'],
})
export class CardListagemProcessoPlComponent {
  @Input()
  processo: any;
}
