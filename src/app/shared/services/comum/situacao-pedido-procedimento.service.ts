import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {SituacaoPedidoProcedimento} from "../../models/dto/situacao-pedido-procedimento";
import {HttpClientService} from "../../../arquitetura/shared/services/http-client.service";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class SituacaoPedidoProcedimentoService extends CrudHttpClientService<SituacaoPedidoProcedimento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('situacoes-pedido-procedimento', http, messageService);
    }

    public consultarUltimaSituacaoPedidoProcedimento(idPedidoProcedimento: number): Observable<SituacaoPedidoProcedimento> {
        return this.http.get<SituacaoPedidoProcedimento>(`${this.url}/pedido-procedimento/${idPedidoProcedimento}`, this.options());
    }

    public consultarPedidosProcedimentosAnalisadosPorIdPedido(idPedido: number): Observable<SituacaoPedidoProcedimento[]> {
        const baseUrl = HttpClientService.getBackendUrl();
        return this.http.get<SituacaoPedidoProcedimento[]>(`${baseUrl}processos/${idPedido}/pedidos-procedimentos-analisados`, this.options());
    }

}
