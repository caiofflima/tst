import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {GrauProcedimento} from "../../models/comum/grau-procedimento";
import {of} from "rxjs";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class GrauProcedimentoService extends CrudHttpClientService<GrauProcedimento> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('graus-procedimento', http, messageService);
    }

    consultarPorId(idGrau: number, idProcedimento: number): Observable<GrauProcedimento> {
        if (idGrau && idProcedimento) {
            return this.http.get<GrauProcedimento>(`${this.url}/${idGrau}/${idProcedimento}`)
        }

        return of();
    }

    public consultarPorProcedimento(idProcedimento: number): Observable<any> {
        return this.http.get(this.url + '/procedimento/' + idProcedimento, this.options());
    }
}
