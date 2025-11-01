import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {EstadoCivil} from '../../../../app/shared/models/comum/estado-civil';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class EstadoCivilService extends CrudHttpClientService<EstadoCivil> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('estado-civil', http, messageService);
    }

    public consultarTodos(): Observable<EstadoCivil[]> {
        return this.http.get<EstadoCivil[]>(this.url, this.options());
    }
}
