import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'app/shared/components/messages/message.service';
import {BaseComponent} from "../../../shared/components/base.component";

@Component({
    selector: 'app-detalhar-mensagens',
    templateUrl: './detalhar-mensagens.component.html',
    styleUrls: ['./detalhar-mensagens.component.scss']
})
export class DetalharMensagensComponent extends BaseComponent {

    relacaoValidacao: any[];
    selectedValidacao: string;

    constructor(
        messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(messageService);

        this.relacaoValidacao = [
            {label: 'Ausente', value: 'Ausente'},
            {label: 'Dispensado', value: 'Dispensado'},
            {label: 'Incompleto', value: 'Incompleto'},
            {label: 'Inválido', value: 'Inválido'},
            {label: 'Válido', value: 'Válido'},
        ];
    }

    public nDoc: string = ''
    public mask: string = ''

    mascara(nDoc) {
        if (nDoc.lenght >= 11) {
            return "99.999.999/9999-99";
        } else {
            return "999.999.999-99";
        }
    }

    voltarProcessosDetalhar() {
        this.router.navigateByUrl('/meus-dados/pedidos/detalhar');
    }
}
