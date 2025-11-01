import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { CrudHttpClientService } from 'app/arquitetura/shared/services/crud-http-client.service';
import { SituacaoPedido } from '../../models/comum/situacao-pedido';
import { MessageService } from '../../components/messages/message.service';

@Injectable()
export class SituacaoPedidoService extends CrudHttpClientService<SituacaoPedido> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('situacoes-pedido', http, messageService);
    }
    /* SituacaoPedido */
    public consultarUltimaMudancaStatusPedido(idPedido): Observable<any> {
        return this.http.get<SituacaoPedido>(`${this.url}/pedido/${idPedido}/ultima-mudanca-status`, this.options());
    }

    public consultarSituacoesPedidoPorPedido(idPedido: number): Observable<SituacaoPedido[]> {
        return this.http.get<SituacaoPedido[]>(`${this.url}/pedido/${idPedido}`, this.options());
    }

    public incluirMudancaSituacaoPedido(situacaoPedido: SituacaoPedido): Observable<any> {
        return this.http.post<any>(`${this.url}/incluir/mudanca-situacao/`, situacaoPedido, this.options());
    }

    public incluirOcorrenciaPedido(situacaoPedido: SituacaoPedido): Observable<SituacaoPedido> {
        return this.http.post<SituacaoPedido>(`${this.url}/incluir/ocorrencia/`, situacaoPedido, this.options());
    }

    public liberacaoAlcada(idPedidos: number[]): Observable<any> {
        const endpoint = `${this.url}/liberacao-alcada/${idPedidos.join(',')}`;
        return this.http.post<any>(endpoint, null, this.options());
    }

}
