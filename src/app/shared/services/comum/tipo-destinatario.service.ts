import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {TipoDestinatario} from 'app/shared/models/comum/tipo-destinatario';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TipoDestinatarioService extends CrudHttpClientService<TipoDestinatario> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipos-destinatario', http, messageService);
    }

    public consultarTodos(): Observable<TipoDestinatario[]> {
        return this.http.get<TipoDestinatario[]>(this.url, this.options());
    }
}
