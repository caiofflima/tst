import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
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
        const url = `${this.url}/cep/${cep}`;
        console.log('URL da requisição:', url);
        return this.http.get<EnderecoCorreios>(url).pipe(
            tap(response => console.log('Resposta completa da API:', response))
        );
    }
}