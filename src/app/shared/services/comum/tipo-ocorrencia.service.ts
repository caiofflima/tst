import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {TipoOcorrencia} from "../../models/dto/tipo-ocorrencia";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TipoOcorrenciaService extends CrudHttpClientService<TipoOcorrencia> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipos-ocorrencia', http, messageService);
    }

    public consultarTiposOcorrenciaManuais(): Observable<TipoOcorrencia[]> {
        return this.http.get<TipoOcorrencia[]>(`${this.url}/manuais`, this.options());
    }

}
