import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CaraterSolicitacao} from "../../models/comum/carater-solicitacao";
import {MessageService} from "../../components/messages/message.service";
import { CrudHttpClientService } from 'app/arquitetura/shared/services/crud-http-client.service';

@Injectable()
export class CaraterSolicitacaoService extends CrudHttpClientService<CaraterSolicitacao> {

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('caracteres-solicitacao', http, messageService);
    }

    public consultarTodos(): Observable<CaraterSolicitacao[]> {
        return this.http.get<CaraterSolicitacao[]>(this.url, this.options());
    }
}
