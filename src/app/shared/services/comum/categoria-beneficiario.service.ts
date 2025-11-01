import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class CategoriaBeneficiarioService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('categorias-beneficiario', http, messageService);
    }
}
