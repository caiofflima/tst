import {Component, Input} from '@angular/core';
import {MessageService} from "../../../shared/services/services";
import {BaseComponent} from "../../../shared/components/base.component";
import {ReciboModel} from '../models/recibo-form.model';
import {PdfExport} from "../../../shared/pdf";
import {Router} from "@angular/router";

@Component({
    selector: 'asc-recibo-dependente',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.scss']
})
export class ReciboComponent extends BaseComponent {

    @Input()
    motivo: string;

    @Input()
    pedido: ReciboModel;
    showProgressBar = false;

    constructor(
        protected override messageService: MessageService,
        private readonly router: Router
    ) {
        super(messageService);
        this.messageService = messageService;
    }

    public exportarPDF(nomeArquivo: string, nomeDiv: string): void {
        PdfExport.export(nomeArquivo, nomeDiv);
    }

    navegarParaMeusProcessos() {
        this.router.navigate(['meus-dados', 'pedidos']).then();
    }

    get nomeTipoProcesso() {
        let ret = 'Renovação de beneficiário';
        if (this.pedido && this.pedido.idTipoProcesso) {
            switch (this.pedido.idTipoProcesso) {
                case 11:
                    ret = 'Inscrição de dependente';
                    break;
                case 12:
                    ret = 'Cancelamento de beneficiário';
                    break;
                case 13:
                    ret = 'Alteração de beneficiário';
                    break;
            }
        }

        return ret;
    }

    get tituloMotivo() {
        if (this.pedido && this.pedido.idTipoProcesso == 13) {
            return 'Motivo da Atualização';
        }

        return "Motivo da Solicitação";
    }
}
