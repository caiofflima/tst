import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ProfissionalExecutanteService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super('profissionais-executantes', http, messageService);
    }

    private consultarPorCNPJ(cnpj: string): Observable<any> {
        return this.http.get<any>(this.url + '/cnpj/' + cnpj, this.options())
    }

    private consultarPorCPF(cpf: string): Observable<any> {
        return this.http.get<any>(this.url + '/cpf/' + cpf, this.options())
    }
}
