import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Router} from "@angular/router";
import {PermissoesSituacaoProcesso} from "../../models/fluxo/permissoes-situacao-processo";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class SIASCFluxoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        protected readonly router: Router
    ) {
        super('fluxos', http, messageService);
    }

    public consultarPermissoesFluxoPorPedido(idPedido: number): Observable<PermissoesSituacaoProcesso> {
        let tipo: string = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        return this.http.get<PermissoesSituacaoProcesso>(this.url + '/pedido/' + idPedido + '/' + tipo + '/permissoes', this.options());
    }
}
