import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {DocumentoTipoProcesso} from "../../models/dto/documento-tipo-processo";
import {DocumentoParam} from "../../components/asc-pedido/models/documento.param";
import {FiltroDocumentoProcesso} from "../../models/filtro/filtro-documento-processo";
import {Pageable} from "../../components/pageable.model";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class DocumentoTipoProcessoService extends CrudHttpClientService<DocumentoTipoProcesso> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('documentos/tipo-processo', http, messageService);
    }

    public consultarPorTipoProcessoAndTipoBeneficiario(parametro: DocumentoParam): Observable<DocumentoTipoProcesso[]> {
        let url = this.url;
        if (parametro.idTipoProcesso && parametro.idTipoBeneficiario) {
            url += `/${parametro.idTipoProcesso}/tipo-beneficiario/${parametro.idTipoBeneficiario}`
        }
        let params = new HttpParams();
        if (parametro.idMotivo) {
            params = params.set('idMotivoSolicitacao', parametro.idMotivo.toString(10));
        }
        if (parametro.idEstadoCivil) {
            params = params.set('idEstadoCivil', parametro.idEstadoCivil.toString(10));
        }
        if (parametro.sexo) {
            params = params.set('sexo', parametro.sexo);
        }
        if (parametro.idade) {
            params = params.set('idade', parametro.idade.toString(10));
        }
        if (parametro.valorRenda) {
            params = params.set('valorRenda', parametro.valorRenda.toString());
        }
        if (parametro.idTipoDeficiencia) {
            params = params.set('idTipoDeficiencia', parametro.idTipoDeficiencia.toString(10));
        }
        return this.http.get<DocumentoTipoProcesso[]>(url, this.options({params}));
    }

    public consultarPorFiltro(filtro: FiltroDocumentoProcesso, limit: number, offset: number): Observable<Pageable<DocumentoTipoProcesso>> {
        let params = new HttpParams();

        if (limit) {
            params = params.set('limit', limit.toString());
        }
        if (offset) {
            params = params.set('offset', offset.toString());
        }

        return this.http.post<Pageable<DocumentoTipoProcesso>>(this.url + '/consultar', filtro, this.options({params}));
    }

    public consultarPorProcesso(idTipoProcesso: number, matricula: string): Observable<DocumentoTipoProcesso[]> {
        return this.http.get<DocumentoTipoProcesso[]>(this.url + `/consultarPorProcesso/tipo-processo/${idTipoProcesso}/matricula/${matricula}`, this.options());
    }

    public consultarRequeridosPorIdPedido(idPedido: number): Observable<DocumentoTipoProcesso[]> {
        return this.http.get<DocumentoTipoProcesso[]>(this.url + '/requeridos/pedido/' + idPedido, this.options());
    }

    public consultarComplementaresPorIdPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/complementares/pedido/' + idPedido, this.options());
    }

    public incluir(documentoTipoProcesso: DocumentoTipoProcesso): Observable<DocumentoTipoProcesso> {
        return this.http.post<DocumentoTipoProcesso>(this.url, documentoTipoProcesso, this.options());
    }

    public alterar(documentoTipoProcesso: DocumentoTipoProcesso): Observable<DocumentoTipoProcesso> {
        return this.http.put<DocumentoTipoProcesso>(this.url, documentoTipoProcesso, this.options());
    }

    public excluir(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}`, this.options());
    }

    public consultarPorIdETipoProcesso(id: number, idTipoProcesso: number): Observable<DocumentoTipoProcesso> {
        let urlCompleta = this.url + `/${id}/idTipoProcesso/${idTipoProcesso}`;
        return this.http.get(urlCompleta, this.options());
    }

    public consultarPorMotivoSolicitacao(idMotivoSolicitacao: number, matricula: string): Observable<DocumentoTipoProcesso[]> {
        return this.http.get<DocumentoTipoProcesso[]>(this.url + `/consultarPorProcesso/motivo-solicitacao/${idMotivoSolicitacao}/matricula/${matricula}`, this.options());
    }

    public consultarPorMotivoSolicitacaoFamilia(idMotivoSolicitacao: number, matricula: string, familia: string): Observable<DocumentoTipoProcesso[]> {
        return this.http.get<DocumentoTipoProcesso[]>(this.url + `/consultarPorProcesso/motivo-solicitacao/${idMotivoSolicitacao}/matricula/${matricula}/familia/${familia}`, this.options());
    }
}
