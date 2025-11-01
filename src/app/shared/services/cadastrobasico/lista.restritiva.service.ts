import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {ListaRestritiva} from '../../../../app/shared/models/lista-restritiva';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ListaRestritivaService extends CrudHttpClientService<ListaRestritiva> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('cadastrobasico/lista-restritiva', http, messageService);
    }

    public filtrar(listaRestritiva: ListaRestritiva): Observable<Array<ListaRestritiva>> {
        return this.http.post<Array<ListaRestritiva>>(this.url + "/filtrar", listaRestritiva);
    }

    /**
     * listarTodos Pesquisa todos os registros de lista restritiva
     */
    public listarTodos(): Observable<Array<ListaRestritiva>> {
        return this.http.get<Array<ListaRestritiva>>(this.url + '/listar-todos');
    }


    /**
     * atualizar - Atualizar a lista restritiva
     * @param listaRestritiva
     */
    public atualizar(listaRestritiva: ListaRestritiva): Observable<Boolean> {
        return this.http.put<Boolean>(this.url + '/atualizar', listaRestritiva);
    }

    /**
     * consultaPorId - Consulta Lista Restritiva por parametro ID
     * @param id
     */
    public consultaPorId(id): Observable<ListaRestritiva> {
        return this.http.get<ListaRestritiva>(this.url + '/consulta-por-id/' + id);
    }

    /**
     * remover - Remove registro
     * @param listaRestritiva
     */
    public remover(listaRestritiva: any): Observable<Boolean> {
        return this.http.delete<Boolean>(this.url + '/remover/' + listaRestritiva.id, this.options());
    }
}
