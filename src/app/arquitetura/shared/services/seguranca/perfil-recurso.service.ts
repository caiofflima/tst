import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {CrudHttpClientService} from '../../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Perfil} from '../../../../../app/arquitetura/shared/models/seguranca/perfil';
import {MessageService} from "../../../../shared/components/messages/message.service";

@Injectable()
export class PerfilRecursoService extends CrudHttpClientService<Perfil> {
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('seguranca/perfil-recurso', http, messageService);
    }
}
