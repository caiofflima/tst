import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService, MessageService} from 'app/shared/services/services';
import {Observable} from 'rxjs';
import {MensagemPedidoDTO} from 'app/shared/models/dtos';

@Injectable()
export class MensagemPedidoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super('mensagens-pedido', http, messageService);
    }

    public consultarPorIdPedido(idPedido: number): Observable<any> {
        return this.http.get(`${this.url}/pedido/${idPedido}`);
    }

    public consultarPorIdSituacaoPedido(idSituacaoPedido: number): Observable<any> {
        return this.http.get(`${this.url}/situacao-pedido/${idSituacaoPedido}`);
    }


    public atualizarMensagemPedidoLida(id: number): Observable<any> {
        return this.http.put(this.url, id, this.options());
    }

    public reenviarMensagemPedido(mensagemPedido: MensagemPedidoDTO): Observable<any> {
        return this.http.post(`${this.url}/reenviar/`, mensagemPedido, this.options());
    }
}
