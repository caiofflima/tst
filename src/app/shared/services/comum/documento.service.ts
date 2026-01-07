import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Documento} from "../../models/comum/documento";
import {FiltroConsultaDocumento} from "../../models/filtro/filtro-consulta-documento";
import {MessageService} from "../../components/messages/message.service";



@Injectable()
export class DocumentoService extends CrudHttpClientService<Documento> {
    acionaMudanca$ = new EventEmitter()
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('documentos', http, messageService);
    }

    public consultarDocumentosDisponiveisPorIdPedido(idPedido: number): Observable<Documento[]> {
        return this.http.get<Documento[]>(this.url + '/pedido/' + idPedido + '/adicionais', this.options());
    }

    public consultarPorFiltro(filtro: FiltroConsultaDocumento): Observable<Documento[]> {
        let params = new HttpParams();

        if (filtro.id) {
            params = params.set("id", filtro.id.toString());
        }

        if (filtro.idTipoDocumento) {
            params = params.set("idTipoDocumento", filtro.idTipoDocumento.toString());
        }
        if (filtro.nome) {
            params = params.set("nome", filtro.nome);
        }
        if (filtro.opme) {
            params = params.set("opme", filtro.opme);
        }
        if (filtro.ativo) {
            params = params.set("ativo", filtro.ativo);
        }
        if (filtro.link) {
            params = params.set("link", filtro.link);
        }

        return this.http.get<Documento[]>(this.url, this.options({
            params
        }));
    }

  acionarMudancaFn(){
    this.acionaMudanca$.emit({});
  }
}
