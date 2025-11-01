import {Injectable} from "@angular/core";
import {CrudHttpClientService} from "../../../arquitetura/shared/services/crud-http-client.service";
import {TipoDocumento} from "../../models/comum/tipo-documento";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TipoDocumentoService extends CrudHttpClientService<TipoDocumento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipo-documento', http, messageService);
    }

    public consultarTodos(): Observable<TipoDocumento[]> {
        return this.http.get<TipoDocumento[]>(this.url, this.options());
    }

    public incluir(tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
        return this.http.post<TipoDocumento>(this.url, tipoDocumento, this.options());
    }

    public alterar(tipoDocumento: TipoDocumento): Observable<TipoDocumento> {
        return this.http.put<TipoDocumento>(this.url, tipoDocumento, this.options());
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`, this.options());
    }
}
