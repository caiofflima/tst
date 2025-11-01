import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {ExportacaoService} from '../comum/exportacao.service';
import {Observable} from 'rxjs';

import {CartaoIdentificacao} from "../../../../app/shared/models/comum/cartao-identificacao";
import {Beneficiario} from '../../../../app/shared/models/comum/beneficiario';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class CartaoIdentificacaoService extends CrudHttpClientService<CartaoIdentificacao> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        private readonly exportacaoService: ExportacaoService
    ) {
        super('cartoes-identificacao', http, messageService);
    }

    public exportarPDF(beneficiario: Beneficiario): Observable<any> {
        return this.exportacaoService.exportarPDF('/cartao-identificacao', beneficiario);
    }

    public enviarCartaoEmail(beneficiario: Beneficiario): Observable<any> {
        return this.http.post<any>(this.url + "/envia/email", beneficiario, this.options());
    }
}
