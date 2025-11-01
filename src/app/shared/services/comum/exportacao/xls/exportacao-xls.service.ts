import {HttpClientService} from 'app/arquitetura/shared/services/http-client.service';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageService} from "../../../../components/messages/message.service";

@Injectable()
export class ExportacaoXLSService extends HttpClientService {
    constructor(
        override readonly messageService: MessageService,
        protected readonly httpClient: HttpClient
    ) {
        super("exporta/xls", messageService);
    }

    public exportar(endpoint: string, body: any): Observable<any> {
        return this.httpClient.post<any>(this.url + endpoint, body, this.options({
            responseType: 'arraybuffer',
        }));
    }
}
