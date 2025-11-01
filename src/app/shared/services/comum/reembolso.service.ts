import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Pedido} from '../../../../app/shared/models/comum/pedido';
import {Observable} from 'rxjs';
import {RetornoSIASC} from "../../models/dto/retorno-siasc";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ReembolsoService extends CrudHttpClientService<Pedido> {
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('pedido/reembolso', http, messageService);
    }

    public incluirNovo(pedido: Pedido): Observable<RetornoSIASC> {
        return this.http.post<RetornoSIASC>(this.url + '/', pedido, this.options());
    }

}
