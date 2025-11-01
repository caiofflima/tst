import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";
import { EnderecoCorreios } from '../../../../app/shared/models/comum/endereco-correios';
import { Localidade } from '../../../../app/shared/models/localidate';
import { TipoLogradouro } from '../../../../app/shared/models/tipo-logradouro';

@Injectable()
export class IntegracaoCorreiosService  extends CrudHttpClientService<EnderecoCorreios> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('correios', http, messageService);
    }

    getEnderecoByCEP(cep: string): Observable<EnderecoCorreios> {
        return this.http.get<EnderecoCorreios>(`${this.url}/cep/${cep}`);
    }
}