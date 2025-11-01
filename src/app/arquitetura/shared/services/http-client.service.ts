import {HttpHeaders, HttpParams} from '@angular/common/http';
import {KeycloakService} from '../../../../app/arquitetura/shared/services/seguranca/keycloak.service';
import {MessageService} from "../../../shared/components/messages/message.service";

export class HttpClientService {
    private static nomeSistema: string = '';
    public queryParams: any = null;
    private withCredentials = true;

    constructor(
        protected readonly url: string,
        protected readonly messageService: MessageService
    ) {
        // Define o endpoint
        this.url = HttpClientService.getBackendUrl() + url;
    }

    public static setNomeSistema(nomeSistema: string) {
        HttpClientService.nomeSistema = nomeSistema;
    }

    /**
     * Recupera o URL padrão para acesso a API de acordo com o ambiente
     */
    static getBackendUrl(): string {
        return '/siasc-api/api/';
    }

    static newGETRequest(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let req: XMLHttpRequest = new XMLHttpRequest();
            req.open('GET', url, true);
            req.withCredentials = true;
            req.setRequestHeader('Authorization', 'bearer ' + KeycloakService.getLastRetrievedToken());
            req.setRequestHeader('Accept', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        resolve(JSON.parse(req.responseText));
                    } else {
                        reject(req.responseText);
                    }
                }
            }
            req.send();
        });
    }

    protected options(
        options?: {
            headers?: HttpHeaders;
            observe?: 'body';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: any;
            withCredentials?: boolean;
        }
    ) {
        if (!options) {
            options = {};
        }

        let headers: HttpHeaders = new HttpHeaders();
        if (options.headers ) {
            for (const headerName of options.headers.keys()) {
                let optionsHeaders = options.headers.getAll(headerName)
                if(optionsHeaders !== null)
                headers = headers.set(headerName, optionsHeaders);
            }
        }
        options.headers = headers;

        if (!options.responseType) {
            options.responseType = 'json';
        }

        if (!options.withCredentials) {
            options.withCredentials = this.withCredentials;
        }

        return options;
    }
}
