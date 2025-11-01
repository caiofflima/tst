import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {CrudHttpClientService} from "../../../../app/arquitetura/shared/services/crud-http-client.service";
import {ExportacaoService} from './exportacao.service';

import {Observable} from "rxjs";

import {CredenciadoFilter} from "../../../../app/shared/models/credenciados/credenciado-filter";
import {Credenciado} from "../../../../app/shared/models/credenciados/credenciado";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class CredenciadoService extends CrudHttpClientService<Credenciado> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        private readonly exportacaoService: ExportacaoService) {

        super('credenciados', http, messageService);
    }

    public buscarCredenciados(filter: CredenciadoFilter): Observable<Array<Credenciado>> {
        return this.http.post<Array<Credenciado>>(this.url, filter, this.options());
    }

    public exportarPDF(credenciados: Array<Credenciado>): Observable<any> {
        return this.exportacaoService.exportarPDF("/credenciados", credenciados);
    }

}
