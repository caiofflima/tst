import {Component, OnInit} from '@angular/core';
import {MessageService} from "app/shared/components/messages/message.service";
import {BaseComponent} from "app/shared/components/base.component";

@Component({
    selector: 'app-pagina-inicial-adesao-titular',
    templateUrl: './pagina-inicial-adesao-titular.component.html',
    styleUrls: ['./pagina-inicial-adesao-titular.component.scss']
})

export class PaginaInicialAdesaoTitularComponent extends BaseComponent {
    index: number = -1;
    options: Array<String> = [
        "Titular",
        "Complemento",
        "Contato",
        "Documentos",
        "Resumo"
    ];

    constructor(protected override messageService: MessageService) {
        super(messageService);
    }

    setIndex(numero: number): void {
        this.index = numero;
    }
}
