import {Component, OnInit} from '@angular/core';
import {MessageService} from "../../../../../app/shared/components/messages/message.service";
import {BaseComponent} from "../../../../../app/shared/components/base.component";

@Component({
  selector: 'app-pagina-incial',
  templateUrl: './pagina-incial.component.html',
  styleUrls: ['./pagina-incial.component.scss']
})

export class PaginaIncialComponent extends BaseComponent {
  index: number = -1;
  options: Array<String> = [
    "Beneficiário", "Patologia", "Documentos", "Resumo"
  ];

  constructor(protected override messageService: MessageService) {
    super(messageService);
  }

  setIndex(numero: number): void {
    this.index = numero;
  }
}
