import {Injectable} from "@angular/core";
import {CrudHttpClientService} from "../../../arquitetura/shared/services/crud-http-client.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GrupoDocumento} from "../../models/comum/grupo-documento";
import {MessageService} from "../../components/messages/message.service";


@Injectable()
export class GrupoDocumentoService extends CrudHttpClientService<GrupoDocumento> {
    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient) {
        super('grupo-documento', http, messageService);
    }

    public consultarTodos(): Observable<GrupoDocumento[]> {
        return this.http.get<GrupoDocumento[]>(this.url, this.options());
    }
}
