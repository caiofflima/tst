import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {SituacaoProcesso} from "../../models/comum/situacao-processo";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class SituacaoProcessoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('situacoes-processo', http, messageService);
    }

    public consultarTodos(): Observable<SituacaoProcesso[]> {
        return this.http.get<SituacaoProcesso[]>(this.url, this.options());
    }

    public consultarTransicoesManuais(idSituacaoProcesso: number, idTipoProcesso: number): Observable<SituacaoProcesso[]> {
        return this.http.get<SituacaoProcesso[]>(`${this.url}/${idSituacaoProcesso}/transicoes/manuais/${idTipoProcesso}/tipo`, this.options());
    }

    public consultarTodasTransicoesManuais(): Observable<SituacaoProcesso[]> {
        return this.http.get<SituacaoProcesso[]>(`${this.url}/consultarTodasTransicoesManuais`, this.options());
    }

    public consultarTransicoesManuaisPossiveisPorPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/transicoes/pedido/' + idPedido, this.options());
    }

    public consultarSituacoesProcessoNegativas(): Observable<SituacaoProcesso[]> {     
        return this.http.get<SituacaoProcesso[]>(this.url + "/negativas", this.options());
    }
}
