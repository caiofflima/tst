import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {MessageService} from "../../components/messages/message.service";
import {TipoValidacaoDTO} from "../../models/dto/tipo-validacao";

@Injectable()
export class TipoValidacaoService extends CrudHttpClientService<TipoValidacaoDTO> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('tipos-validacao', http, messageService);
    }

}
