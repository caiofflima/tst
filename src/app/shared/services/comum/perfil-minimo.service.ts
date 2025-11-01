import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";
import { PerfilMinimo } from '../../../../app/shared/models/entidades';
import { DadoComboDTO } from '../../../../app/shared/models/dtos';
import { map } from 'rxjs/operators';

@Injectable()
export class PerfilMinimoService extends CrudHttpClientService<PerfilMinimo> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('perfil-minimo', http, messageService);
    }

    public consultarTodos(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url, this.options())
                        .pipe(
                            map((perfis: any[])=> 
                                 perfis.map( perfil => new DadoComboDTO(`${perfil.sigla} - ${perfil.nome}`, perfil.id ))
                                )
                        );
    }
}
