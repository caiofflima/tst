import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Laboratorio} from '../../../../app/shared/models/entidades';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class LaboratorioService extends CrudHttpClientService<Laboratorio> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('laboratorios', http, messageService);
    }

    carregarPorPatologia(idPatologia: number): Observable<Laboratorio[]> {
        return this.http.get<Laboratorio[]>(`${this.url}/${idPatologia}/patologia`);
    }
}
