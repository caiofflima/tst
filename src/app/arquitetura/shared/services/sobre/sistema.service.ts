import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

import {HttpClientService} from '../../../../../app/arquitetura/shared/services/http-client.service';
import {MessageService} from "../../../../shared/components/messages/message.service";

@Injectable()
export class SistemaService extends HttpClientService {

    static readonly MSG_BUNDLE_SERVICE_URL: string = 'sistema/bundle/mensagens';

    /**
     * Recupera a url do endpoint correspondente
     */
    static getBundleEndpointUrl(): string {
        return SistemaService.getBackendUrl() + SistemaService.MSG_BUNDLE_SERVICE_URL;
    }

    constructor(
        override readonly messageService: MessageService,
        protected readonly http: HttpClient
    ) {
        super('sistema', messageService);
    }

    /**
     * Recupera informações do sistema
     */
    public info(): Observable<string> {
        return this.http.get<string>(this.url + '/sobre/info',
            this.options({responseType: 'text'}));
    }

    /**
     * Recupera mensagens mapeadas de forma estática, para funcionar na
     * inicialização do sistema
     *
     */
    static carregarBundleMessages(): Promise<any> {
        return HttpClientService.newGETRequest(SistemaService.getBundleEndpointUrl());
    }
}
