import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpClientService} from './http-client.service';
import {MessageService} from "../../../shared/components/messages/message.service";

export class CrudHttpClientService<T> extends HttpClientService {
    constructor(
        readonly uri: string,
        protected readonly http: HttpClient,
        override readonly messageService: MessageService
    ) {
        super(uri, messageService);
    }

    /**
     * Recupera um registro em particular, ou todos (caso não seja passado
     * o parâmetro id)
     * @param id
     */
    public get(id?: number): Observable<T | T[]> {
        let url = this.url;

        if (id) {
            url += '/' + id;
        }

        return this.http.get<T>(url, this.options());
    }

    /**
     * Insere um registro
     * @param entity
     */
    public post(entity: T): Observable<T> {
        return this.http.post<T>(this.url, entity, this.options());
    }

    /**
     * Altera um registro
     * @param entity
     */
    public put(entity: T): Observable<T> {
        return this.http.put<T>(this.url, entity, this.options());
    }

    /**
     * Exclui um registro
     * @param id
     */
    public delete(id: number): Observable<T> {
        return this.http.delete<T>(this.url + '/' + id, this.options());
    }

}
