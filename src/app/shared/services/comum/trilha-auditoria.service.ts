import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {ModuloTrilhaDTO, ParamsTrilhaAuditoriaDTO} from 'app/shared/models/dtos'
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class TrilhaAuditoriaService extends CrudHttpClientService<any> {

    static modulos = {
        autorizacaoPrevia: "AUTORIZACAO_PREVIA",
        prestadorExterno: 'PRESTADOR_EXTERNO',
        emails: "E_MAILS",
        email: "E_MAIL",
        tiposDestinatarioEmail: "TIPOS_DESTINATARIO_EMAIL",
        usuarioPrestadorExterno: "USUARIO_PRESTADOR_EXTERNO",
        gipesCepesEmpresaPrestador: "GIPES_CEPES_EMPRESA_PRESTADOR",
        perfilPrestadorExterno: "PERFIL_PRESTADOR_EXTERNO",
        empresaPrestadorExterno: "EMPRESA_PRESTADOR_EXTERNO",
        procedimentos: "PROCEDIMENTOS_PEDIDO",
        autorizacoesProcedimentos: "AUTORIZACOES_PROCEDIMENTOS_PEDIDO",
        dadosGerais: "DADOS_GERAIS_PEDIDO",
        documentos: "DOCUMENTOS_PEDIDO",
        anexosDocumentos: "ANEXOS_DOCUMENTOS_PEDIDO",
        ocorrencias: "OCORRENCIAS_PEDIDO",
        mensagens: "MENSAGENS_PEDIDO",
        validacoesDocumentos: "VALIDACOES_DOCUMENTOS_PEDIDO",
        vinculosEmpresaPrestador: "VINCULOS_EMPRESA_PRESTADOR"
    }

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('trilha-auditoria', http, messageService);
    }

    public carregarModulos(): Observable<ModuloTrilhaDTO[]> {
        return this.get();
    }

    public consultarTrilhaPorParametros(param: ParamsTrilhaAuditoriaDTO): Observable<ModuloTrilhaDTO[]> {
        return this.http.post<ModuloTrilhaDTO[]>(this.url + '/consulta-trilha', param, this.options());
    }
}
