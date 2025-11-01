import {Component, OnInit} from '@angular/core';
import {MessageService} from "app/shared/components/messages/message.service";
import {BaseComponent} from "app/shared/components/base.component";

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss']
})

export class PaginaInicialComponent extends BaseComponent implements OnInit {
  index: number = -1;
  options: Array<String> = [
    "Beneficiário", "Documentos", "Resumo"
  ];

  constructor(protected override messageService: MessageService) {
    super(messageService);
  }

  ngOnInit() {
    // no aguardo de funcionalidades
  }

  setIndex(numero: number): void {
    this.index = numero;
  }
}
