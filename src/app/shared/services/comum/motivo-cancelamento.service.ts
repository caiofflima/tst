import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MotivoCancelamento} from 'app/shared/models/comum/motivo-cancelamento';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class MotivoCancelamentoService extends CrudHttpClientService<MotivoCancelamento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('motivo-cancelamento', http, messageService);
    }

    public consultarTodos(): Observable<MotivoCancelamento[]> {
        return this.http.get<MotivoCancelamento[]>(this.url, this.options());
    }

    public consultarPorId(id: number): Observable<MotivoCancelamento>{
        return this.http.get<MotivoCancelamento>(`${this.url}/${id}`, this.options())
    }
}
