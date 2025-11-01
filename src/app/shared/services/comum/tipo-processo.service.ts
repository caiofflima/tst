import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {TipoProcesso} from 'app/shared/models/comum/tipo-processo';
import {MessageService} from "../../components/messages/message.service";
import { filter, map } from 'rxjs/operators';

@Injectable()
export class TipoProcessoService extends CrudHttpClientService<TipoProcesso> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super('tipos-processo', http, messageService);
    }

    public consultarTodos(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(this.url, this.options());
    }

    public consultarTiposProcessoAutorizacaoPrevia(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(`${this.url}/autorizacao-previa`, this.options());
    }

    public consultarTiposProcessoAutorizacaoPreviaNovoPedido(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(`${this.url}/autorizacao-previa`, this.options()).pipe(
          map((tipoProcesso: TipoProcesso[]) => {
            return tipoProcesso.filter(tipo => tipo.id !== 20)})
        );
      }

    public consultarTiposProcessoReembolso(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(`${this.url}/reembolso`, this.options());
    }

    public consultarTiposProcessoCancelamento(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(`${this.url}/cancelamento`, this.options());
    }

    public consultarTiposProcessoInscricaoProgramas(): Observable<TipoProcesso[]> {
        return this.http.get<TipoProcesso[]>(`${this.url}/medicamento-uso-domiciliar`, this.options());
    }
}
