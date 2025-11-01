import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {TipoDeficiencia} from '../../../../app/shared/models/comum/tipo-deficiencia';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TipoDeficienciaService extends CrudHttpClientService<TipoDeficiencia> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipos-deficiencia', http, messageService);
    }

    public consultarTodos(): Observable<TipoDeficiencia[]> {
        return this.http.get<TipoDeficiencia[]>(this.url, this.options());
    }
}
