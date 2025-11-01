import {DadoComboDTO} from '../../models/dto/dado-combo';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Pedido} from 'app/shared/models/comum/pedido';
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ComboService extends CrudHttpClientService<Pedido> {
    constructor(
        override readonly  messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('combos', http, messageService);
    }

    public consultarComboUF(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/uf', this.options())
    }

    public consultarComboFilial(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/filial', this.options())
    }

    public consultarComboTipoProcesso(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipos-processo', this.options())
    }

    public consultarComboMotivoDeNgacao(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/motivos-negacao', this.options())
    }

    public consultarComboTipoProcessoCredenciado(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipos-processo/credenciado', this.options())
    }

    public consultarComboTipoProcessoAutorizacaoPrevia(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipos-processo/autorizacao-previa', this.options())
    }

    public consultarComboSituacaoProcesso(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/situacao-processo', this.options())
    }

    public consultarComboCondicaoProcesso(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/condicao-processo', this.options())
    }

    public consultarComboTipoBeneficiario(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipo-beneficiario', this.options())
    }

    public consultarComboCaraterSolicitacao(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/carater-solicitacao', this.options())
    }

    public consultarTipoDestinatario(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipo-destinatario', this.options())
    }

    public consultarComboTipoBeneficiarioPorTipoProcesso(tiposProcesso: number[]): Observable<DadoComboDTO[]> {
        return this.http.post<DadoComboDTO[]>(this.url + '/tipo-beneficiario-por-tipo-processo', tiposProcesso, this.options());
    }

    public consultarDadosComboMunicipioPorUF(idEstado: number): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/municipio-uf/' + idEstado, this.options());
    }

    public consultarComboConselhosProfissionais(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/conselhos-profissionais', this.options());
    }

    public consultarComboTiposAuditor(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/tipos-auditor', this.options());
    }

    public consultarComboPerfisPrestadoresExternos(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/perfis-prestadores-externos', this.options());
    }

    public consultarComboFinalidade(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/motivos-solicitacao', this.options());
    }

    public consultarComboFinalidadePorTipoProcesso(ids:number[]): Observable<DadoComboDTO[]> {
        return this.http.post<DadoComboDTO[]>(this.url + '/motivos-solicitacao-tipo-processo', ids, this.options());
    }

    public consultarComboProcedimento(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/procedimentos', this.options());
    }

    public consultarComboDocumento(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/documentos', this.options());
    }

    public consultarComboEstadoCivil(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/estado-civil', this.options());
    }

    public consultarComboPerfil(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/perfis', this.options());
    }


    public consultarComboTipoPedidoPorTipoProcesso(tiposProcesso: number[]): Observable<DadoComboDTO[]> {
        return this.http.post<DadoComboDTO[]>(this.url + '/tipo-pedido-por-tipo-processo', tiposProcesso, this.options());
    }

    public consultarComboGrupoPedidoPorTipoProcesso(tiposProcesso: number[]): Observable<DadoComboDTO[]> {
        return this.http.post<DadoComboDTO[]>(this.url + '/grupo-pedido-por-tipo-processo', tiposProcesso, this.options());
    }

    public consultarComboLaboratorios(): Observable<DadoComboDTO[]> {
        return this.http.get<DadoComboDTO[]>(this.url + '/laboratorios', this.options())
    }
    
    public consultarComboMedicamentos(ids: number[]): Observable<DadoComboDTO[]> {
        return this.http.post<DadoComboDTO[]>(this.url + '/medicamentos', ids, this.options())
    }
}
