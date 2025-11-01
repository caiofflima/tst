import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {ConselhoProfissional} from "../../models/comum/conselho-profissional";
import {of} from "rxjs";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ConselhoProfissionalService extends CrudHttpClientService<ConselhoProfissional> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('conselhos-profissionais', http, messageService);
    }

    public consultarConselhosProfissionaisPorIdPedido(idPedido: number): Observable<ConselhoProfissional> {
        return this.http.get<ConselhoProfissional>(`${this.url}/pedido/${idPedido}`);
    }

    public consultarConselhosProfissionaisPorId(id: number): Observable<ConselhoProfissional> {
        if (!id) {
            return of<ConselhoProfissional>();
        }

        return this.http.get<ConselhoProfissional>(`${this.url}/${id}`);
    }
}
