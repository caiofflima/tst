import {Component, OnInit} from '@angular/core';
import {MessageService} from "app/shared/components/messages/message.service";
import {BaseComponent} from "app/shared/components/base.component";
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';

@Component({
  selector: 'app-pagina-inicial-alterar',
  templateUrl: './pagina-inicial-alterar.component.html',
  styleUrls: ['./pagina-inicial-alterar.component.scss']
})

export class PaginaInicialAlterarComponent extends BaseComponent implements OnInit {
  index: number = -1;
  options: Array<String> = [
    "Beneficiário", "Cadastro", "Complemento", "Documentos", "Resumo"
  ];

  constructor(protected override messageService: MessageService,
    protected inscricaoDependenteService: InscricaoDependenteService,) {
    super(messageService);
  }

  ngOnInit() {
    this.inscricaoDependenteService.setEditMode(true);
  }

  setIndex(numero: number): void {
    this.index = numero;
  }
}
