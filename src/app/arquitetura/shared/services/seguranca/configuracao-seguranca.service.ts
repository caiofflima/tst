import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../../app/arquitetura/shared/services/crud-http-client.service';
import {ConfiguracoesSeguranca} from '../../../../../app/arquitetura/shared/models/seguranca/configuracoes-seguranca';
import {MessageService} from "../../../../shared/components/messages/message.service";

@Injectable()
export class ConfiguracaoSegurancaService extends CrudHttpClientService<ConfiguracoesSeguranca> {
    static readonly CONFIGURACAO_SEGURANCA_SERVICE_URL: string = 'seguranca/configuracao-seguranca';

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient) {
        super(ConfiguracaoSegurancaService.CONFIGURACAO_SEGURANCA_SERVICE_URL, http, messageService);
    }

    /**
     * Recupera a url do endpoint correspondente
     */
    static getEndpointUrl(): string {
        return ConfiguracaoSegurancaService.getBackendUrl() +
            ConfiguracaoSegurancaService.CONFIGURACAO_SEGURANCA_SERVICE_URL;
    }

    /**
     * Recupera configurações de segurança de forma estática, para funcionar na
     * inicialização do sistema.
     */
    static get(): Promise<ConfiguracoesSeguranca> {
        return new Promise((resolve, reject) => {
            let url: string = ConfiguracaoSegurancaService.getEndpointUrl();

            let req: XMLHttpRequest = new XMLHttpRequest();
            console.log("🚀 ~ ConfiguracaoSegurancaService ~ returnnewPromise ~ url:", url)
            req.open('GET', url, true);
            req.setRequestHeader('Accept', 'application/json');

            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject();
                    }
                }
            }
            if(!!req && req )
            req.send();
        });
    }

}
