import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {CrudHttpClientService} from '../../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Perfil} from '../../../../../app/arquitetura/shared/models/seguranca/perfil';
import {MessageService} from "../../../../shared/components/messages/message.service";

@Injectable()
export class PerfilService extends CrudHttpClientService<Perfil> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('seguranca/perfil', http, messageService);
    }

    /**
     * Recupera todos os perfis relacionados com o nome parcial informado
     * @param nome
     */
    public consultarPorNome(nome: string): Observable<Perfil[]> {
        let httpParams: HttpParams = new HttpParams().set('nome', nome);

        return this.http.get<Perfil[]>(this.url + '/consultar-por-nome',
            this.options({params: httpParams}));
    }
}
