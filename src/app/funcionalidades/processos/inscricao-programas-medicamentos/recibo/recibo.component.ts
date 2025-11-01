import {Component, Input} from '@angular/core';
import {MessageService} from "../../../../shared/services/services";
import {BaseComponent} from "../../../../shared/components/base.component";
import {ReciboModel} from '../models/reciboModel';
import {PdfExport} from "../../../../shared/pdf";

@Component({
    selector: 'asc-recibo',
    templateUrl: './recibo.component.html',
    styleUrls: ['./recibo.component.scss']
})
export class ReciboComponent extends BaseComponent {

    public numAns: number;

    @Input() pedido: any;
    sendingMail: boolean = false;
    showProgressBar = false

    constructor(
        protected override messageService: MessageService
    ) {
        super(messageService);
        this.messageService = messageService;
    }

    public exportarPDF(nomeArquivo: string, nomeDiv: string): void {
        PdfExport.export(nomeArquivo, nomeDiv);
    }
}
