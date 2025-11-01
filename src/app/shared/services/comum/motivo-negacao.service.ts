import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";
import { FiltroConsultaMotivoNegacao } from 'app/shared/models/filtro/filtro-consulta-motivo-negacao';
import { MotivoNegacao, SituacaoProcesso } from 'app/shared/models/entidades';

@Injectable()
export class MotivoNegacaoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('motivos-negacao', http, messageService);
    }

    public consultarMotivosNegacaoProcessoPorPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/nivel-processo/pedido/' + idPedido, this.options());
    }

    public consultarMotivosNegacaoProcessoPorPedidoAndSituacao(idPedido: number, idSituacaoProcesso: number): Observable<any> {
        return this.http.get(this.url + '/nivel-processo/pedido/' + idPedido + '/situacao-processo/' + idSituacaoProcesso, this.options());
    }

    public consultarMotivosNegacaoProcedimentoPorPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/nivel-procedimento/pedido/' + idPedido, this.options());
    }

    public consultaMotivoNegacaoPorFiltro(filtro: FiltroConsultaMotivoNegacao): Observable<MotivoNegacao[]> {     
        return this.http.post<MotivoNegacao[]>(this.url + "/consultar-motivo-negacao-filtro", filtro, this.options());
    }

    public consultaSituacoesPedido(): Observable<SituacaoProcesso[]> {     
        return this.http.get<SituacaoProcesso[]>(this.url + "/situacoes-processo", this.options());
    }

}


