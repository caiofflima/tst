import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {SituacaoPedido} from "../../models/entidades";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class HistoricoProcessoService extends CrudHttpClientService<SituacaoPedido> {
    listenerAguardandoDocumentacao = new EventEmitter()
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('situacoes-pedido', http, messageService);
    }

    public consultarPorIdPedido(idPedido: number, acompanhamento: boolean = false): Observable<SituacaoPedido[]> {
        return this.http.get<SituacaoPedido[]>(`${this.url}/pedido/${idPedido}?acompanhamento=${acompanhamento}`, this.options());
    }

    public consultarUltimaSituacao(idPedido: number): Observable<SituacaoPedido> {
        return this.http.get<SituacaoPedido>(`${this.url}/pedido/${idPedido}/ultima-situacao`, this.options());
    }

    public consultarUltimaMudanca(idPedido: number, acompanhamento: boolean = false): Observable<SituacaoPedido> {
        return this.http.get<SituacaoPedido>(`${this.url}/pedido/${idPedido}/ultima-mudanca?acompanhamento=${acompanhamento}`, this.options());
    }

}
