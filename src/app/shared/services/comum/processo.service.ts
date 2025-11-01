import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Pedido} from 'app/shared/models/comum/pedido';
import {RelatorioAnaliticoDTO} from 'app/shared/models/dto/relatorio-analitico';
import {RelatorioJuntaMedicaOdontologicaDTO} from 'app/shared/models/dto/relatorio-junta-medica-odontologica';
import {
    RelatorioProcedimentosSolicitadosPorProfissionalDTO
} from 'app/shared/models/dto/relatorio-procedimentos-solicitados-por-profissional';
import {RelatorioTempoMedioProcessosDTO} from 'app/shared/models/dto/relatorio-tempo-medio-processos';
import {RelatorioControlePrazosProcessosDTO} from 'app/shared/models/dto/relatorio-controle-prazos-processos';
import {FiltroConsultaProcesso} from 'app/shared/models/filtro/filtro-consulta-processo';
import {
    FiltroRelatorioJuntaMedicaOdontologica
} from 'app/shared/models/filtro/filtro-relatorio-junta-medica-odontologica';
import {
    FiltroRelatorioProcedimentosSolicitadosPorProfissional
} from 'app/shared/models/filtro/filtro-relatorio-procedimentos-solicitados-por-profissional';
import {FiltroRelatorioTempoMedioProcessos} from 'app/shared/models/filtro/filtro-relatorio-tempo-medio-processos';
import {
    FiltroRelatorioControlePrazosProcessos
} from 'app/shared/models/filtro/filtro-relatorio-controle-prazos-processos';
import {FiltroRelatorioAnalitico} from 'app/shared/models/filtro/filtro-relatorio-analitico';
import {PageRequest} from 'app/shared/components/page-request';
import {ExportacaoService} from 'app/shared/services/comum/exportacao.service';
import {ProcessoDTO} from "../../models/dto/processo";
import {ProcessoReembolsoDTO} from "../../models/dto/processo-reembolso";
import {MessageService} from "../services";
import {HttpUtil} from "../../util/http-util";
import {MedicamentoPatologiaPedido} from "../../models/comum/medicamento-patologia-pedido";
import {Pageable} from "../../components/pageable.model";
import {of} from "rxjs";
import {AtualizarProcessoDTO} from 'app/shared/models/dto/atualizar-processo';
import {FiltroProcessoReembolso} from 'app/shared/models/filtro/filtro-processo-reembolso';
import {FiltroPedidoRegrasInclusao} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao';
import {FiltroPedidoRegrasInclusaoDependente} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao-dependente';
import { UsuarioSouCaixaDTO } from "app/shared/models/comum/usuario-soucaixa-dto.model";
import { RelatorioControleProcessosAnalistaDTO } from 'app/shared/models/dto/relatorio-controle-processos-analista';

@Injectable()
export class ProcessoService extends CrudHttpClientService<Pedido> {
    
    private permissaoLiberarObrigatorios = new BehaviorSubject<boolean>(true);
    private permissaoLiberarCondicionados = new BehaviorSubject<boolean>(true);

    constructor(
        override readonly messageService: MessageService,
        override readonly http: HttpClient,
        private readonly exportacaoService: ExportacaoService
    ) {
        super('pedidos', http, messageService);
    }

    public consultarProcessosAutorizador(filtro: any): Observable<any> {
        return this.http.post(`${this.url}/consulta/autorizador`, filtro, this.options());
    }

    public consultarPorMatriculaTitular(matricula: string): Observable<Pageable<Pedido>> {
        return this.http.get<Pageable<Pedido>>(`${this.url}/matricula/${matricula}`, this.options());
    }   

    public consultarPaginado(filtro: FiltroConsultaProcesso, pageRequest: PageRequest): Observable<any> {
        const params = new HttpParams().set('pageNumber', pageRequest.pageNumber + '').set('pageSize', pageRequest.pageSize + '');
        console.log("1");
        return this.http.post<Pedido>(`${this.url}/consultar-paginado`, filtro, this.options({params: params}));
    }

    public consultar(filtro: FiltroConsultaProcesso): Observable<Pageable<ProcessoDTO>> {
        console.log("2");
        let resp = this.http.post<Pageable<ProcessoDTO>>(`${this.url}/consultar`, filtro, this.options());
        return resp;
    }

    public consultarComBeneficiario(filtro: FiltroConsultaProcesso): Observable<Pageable<ProcessoDTO>> {
        let resp = this.http.post<Pageable<ProcessoDTO>>(`${this.url}/consultarComBeneficiario`, filtro, this.options());
        return resp;
    }

    public getUsuarioSouCaixa(matricula: string): Observable<UsuarioSouCaixaDTO> {
        //console.log(`${this.url}/usuarioSouCaixa/${matricula}`);
        return this.http.get<UsuarioSouCaixaDTO>(`${this.url}/usuarioSouCaixa/${matricula}`, this.options());
    }

    public consultarProcessosReembolso(filtro: FiltroProcessoReembolso): Observable<Pageable<ProcessoReembolsoDTO>> {
        console.log(`${this.url}/pedidos-reembolso`);
        console.log(filtro);
        return this.http.post<Pageable<ProcessoReembolsoDTO>>(`${this.url}/pedidos-reembolso`, filtro, this.options());
    }
    
    public consultarPorId(idPedido: number): Observable<Pedido> {
        if (!idPedido) {
            return of<Pedido>();
        }
        return this.http.get<Pedido>(this.url + '/' + idPedido, this.options()).pipe(HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService));
    }

    public consultarProcessosNaoConclusivosPorOperadorCredenciado(idOperador: number, idEmpresa: number,
                                                                  maxResults?: number): Observable<ProcessoDTO[]> {
        let url = this.url + '/nao-conclusivos/operador/' + idOperador + '/credenciado/' + idEmpresa;
        if (maxResults && maxResults > 0) {
            url = url + '/' + maxResults;
        }
        return this.http.get<ProcessoDTO[]>(url, this.options());
    }

    public consultarRecentesPorOperadorCredenciado(idOperador: number, idEmpresa: number): Observable<ProcessoDTO[]> {
        return this.http.get<ProcessoDTO[]>(this.url + '/recentes/operador/' + idOperador + '/credenciado/' + idEmpresa, this.options());
    }

    public consultarRelatorioProcedimentosSolicitadosPorProfissional(filtro: FiltroRelatorioProcedimentosSolicitadosPorProfissional): Observable<any> {
        return this.http.post<RelatorioProcedimentosSolicitadosPorProfissionalDTO>(this.url + '/consultar/relatorio-procedimentos-solicitados-por-profissional', filtro, this.options());
    }

    public consultarRelatorioJuntaMedicaOdontologica(filtro: FiltroRelatorioJuntaMedicaOdontologica): Observable<any> {
        return this.http.post<RelatorioJuntaMedicaOdontologicaDTO>(this.url + '/consultar/relatorio-junta-medica-odontologica', filtro, this.options());
    }

    public consultarRelatorioTempoMedioProcessos(
        filtro: FiltroRelatorioTempoMedioProcessos,
        rowCounter?: Number,
        offsetCounter?: Number): Observable<any> {
        let params = new HttpParams();

        if (offsetCounter && rowCounter) {
            params = params.set('limit', rowCounter.toString());
            params = params.set('offset', offsetCounter.toString());
        }
 
        return this.http.post<RelatorioTempoMedioProcessosDTO>(this.url + '/consultar/relatorio-tempo-medio-pedidos', filtro, this.options({params}));
    }

    public consultarRelatorioControlePrazosProcessos(filtro: FiltroRelatorioControlePrazosProcessos): Observable<RelatorioControlePrazosProcessosDTO[]> {
        return this.http.post<RelatorioControlePrazosProcessosDTO[]>(this.url + '/consultar/relatorio-controle-prazos-pedidos', filtro, this.options());
    }

    public consultarRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<any> {
        return this.http.post<RelatorioAnaliticoDTO>(this.url + '/consultar/relatorio-analitico', filtro, this.options());
    }

    public consultarRelatorioAnaliticoProcedimentosSolicitadosPorProfissional(filtro: FiltroRelatorioAnalitico): Observable<any> {
        return this.http.post<RelatorioAnaliticoDTO>(this.url + '/consultar/relatorio-analitico-procedimentos-solicitados-por-profissional', filtro, this.options());
    }

    public consultarRelatorioAnaliticoJuntaMedicaOdontologica(filtro: FiltroRelatorioAnalitico): Observable<any> {
        return this.http.post<RelatorioAnaliticoDTO>(this.url + '/consultar/relatorio-analitico-junta-medica-odontologica', filtro, this.options());
    }

    public consultarRelatorioAnaliticoTempoMedioProcessos(filtro: FiltroRelatorioAnalitico): Observable<any> {
        return this.http.post<RelatorioAnaliticoDTO>(this.url + '/consultar/relatorio-analitico-tempo-medio-pedidos', filtro, this.options());
    }

    public consultarRelatorioAnaliticoControlePrazosProcessos(filtro: FiltroRelatorioAnalitico): Observable<any> {
        return this.http.post<RelatorioAnaliticoDTO>(this.url + '/consultar/relatorio-analitico-controle-prazos-pedidos', filtro, this.options());
    }

    public exportarPDFRelatorioAnalitico(listaProcessos: RelatorioAnaliticoDTO[]): Observable<any> {
        return this.exportacaoService.exportarPDF('/relatorio-analitico', listaProcessos);
    }

    public exportarXLSRelatorioAnalitico(listaProcessos: RelatorioAnaliticoDTO[]): Observable<any> {
        return this.exportacaoService.exportarXLS('/relatorio-analitico-xls', listaProcessos);
    }

    public exportarCSVRelatorioAnalitico(listaProcessos: RelatorioAnaliticoDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-analitico-csv', listaProcessos);
    }

    public exportarXLSRelatorioJuntaMedicaOdontologica(listaProcessos: RelatorioJuntaMedicaOdontologicaDTO[]): Observable<any> {
        return this.exportacaoService.exportarXLS('/relatorio-junta-medica-odontologica-xls', listaProcessos);
    }

    public exportarCSVRelatorioJuntaMedicaOdontologica(listaProcessos: RelatorioJuntaMedicaOdontologicaDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-junta-medica-odontologica-csv', listaProcessos);
    }

    public exportarPDFRelatorioProcedimentosSolicitadosPorProfissional(listaProcessos: RelatorioProcedimentosSolicitadosPorProfissionalDTO[]): Observable<any> {
        return this.exportacaoService.exportarPDF('/relatorio-procedimentos-solicitados-por-profissional', listaProcessos);
    }

    public exportarXLSRelatorioProcedimentosSolicitadosPorProfissional(listaProcessos: RelatorioProcedimentosSolicitadosPorProfissionalDTO[]): Observable<any> {
        return this.exportacaoService.exportarXLS('/relatorio-procedimentos-solicitados-por-profissional-xls', listaProcessos);
    }

    public exportarCSVRelatorioProcedimentosSolicitadosPorProfissional(listaProcessos: RelatorioProcedimentosSolicitadosPorProfissionalDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-procedimentos-solicitados-por-profissional-csv', listaProcessos);
    }

    public exportarPDFRelatorioTempoMedioProcessos(listaProcessos: RelatorioTempoMedioProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarPDF('/relatorio-tempo-medio-pedidos', listaProcessos);
    }

    public exportarXLSRelatorioTempoMedioProcessos(listaProcessos: RelatorioTempoMedioProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarXLS('/relatorio-tempo-medio-pedidos-xls', listaProcessos);
    }

    public exportarCSVRelatorioTempoMedioProcessos(listaProcessos: RelatorioTempoMedioProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-tempo-medio-pedidos-csv', listaProcessos);
    }

    public exportarPDFRelatorioControlePrazosProcessos(listaProcessos: RelatorioControlePrazosProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarPDF('/relatorio-controle-prazos-pedidos', listaProcessos);
    }

    public exportarXLSRelatorioControlePrazosProcessos(listaProcessos: RelatorioControlePrazosProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarXLS('/relatorio-controle-prazos-pedidos-xls', listaProcessos);
    }

    public exportarCSVRelatorioControlePrazosProcessos(listaProcessos: RelatorioControlePrazosProcessosDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-controle-prazos-pedidos-csv', listaProcessos);
    }

    public atualizar(idPedido: number, idCaraterSolicitacao: number): Observable<any> {
        return this.http.post(`${this.url}/atualizar/${idPedido}/${idCaraterSolicitacao}`, this.options());
    }

    public atualizarProcesso(atualizarProcessoDTO: AtualizarProcessoDTO): Observable<any> {
        return this.http.post(`${this.url}/atualizar`, atualizarProcessoDTO, this.options());
    }

    public alterarEmailAndTelefoneContato(pedido: Pedido): Observable<any> {
        return this.http.put(`${this.url}/alteracao/contatos`, pedido, this.options());
    }

    public liberarProcessoParaAnalise(idPedido: number): Observable<any> {
        return this.http.put(`${this.url}/${idPedido}/liberado-para-analise`, this.options());
    }

    consultarPedidoEmAbertoSemelhante(pedido: Pedido): Observable<Pedido[]> {
        return this.http.post<Pedido[]>(`${this.url}/consultar-pedido-em-aberto-semelhante`, pedido, this.options());
    }

    consultarMedicamentoPatologiaPedidoPorPedido(idPedido: number): Observable<MedicamentoPatologiaPedido[]> {
        return this.http.get<MedicamentoPatologiaPedido[]>(`${this.url}/${idPedido}/medicamentos-patologia-pedido`, this.options());
    }

    removerPedidoProcedimentoOuMedicamentoPatologiaPedido(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}/remover-pedido-procedimento-ou-medicamento-patologia`, this.options())
    }

    cancelarProcesso(id: number): Observable<any> {
        return this.http.delete(`${this.url}/${id}/cancelar`, this.options())
    }

    atualizarDocumentoFiscal(processo: Pedido): Observable<any> {
        return this.http.put(`${this.url}/${processo.id}/documento-fiscal`, processo, this.options())
    }

    consultarNumeroPeg(processo): Observable<number> {
        return this.http.get<number>(`${this.url}/${processo.id}/numero-peg`, this.options());
    }

    validaNumeroPeg(id:string, numeroPeg:string): Observable<any> {
        let options = this.options();
        options.responseType = 'text';
        return this.http.get(`${this.url}/${id}/${numeroPeg}/valida-numero-peg`, options);
    }

    public consultarPedidosRegrasInclusao(filtro: FiltroPedidoRegrasInclusao): Observable<any> {
        return this.http.post(`${this.url}/pedido-regras-inclusao`, filtro, this.options());
    }

    public consultarPedidosRegrasInclusaoDependente(filtro: FiltroPedidoRegrasInclusaoDependente): Observable<any> {
        return this.http.post(`${this.url}/pedido-regras-inclusao-dependente`, filtro, this.options());
    }

    public exportarCSVRelatorioControleProcessosAnalista(processosAnalista: RelatorioControleProcessosAnalistaDTO[]): Observable<any> {
        return this.exportacaoService.exportarCSV('/relatorio-controle-processos-analista-csv', processosAnalista);
    }

    public consultarDataValidadePorNumeroAutorizacao(numeroAutorizacao: Number):  Observable<Date> {
        return this.http.get<Date>(`${this.url}/autorizacao/${numeroAutorizacao}/consulta-data-validade`, this.options());
    }

    public podeLiberarPedidoAnaliseObrigatorios(value: boolean){
        this.permissaoLiberarObrigatorios.next(value);
    }

    public liberarPedidoAnaliseObrigatorios(): Observable<boolean>{
        return this.permissaoLiberarObrigatorios;
    }

    public podeLiberarPedidoAnaliserCondicionados(value: boolean){
        this.permissaoLiberarCondicionados.next(value);
    }

    public liberarPedidoAnaliserCondicionados(): Observable<boolean>{
        return this.permissaoLiberarCondicionados;
    }

    public consultarPorMatriculaFamiliaTitular(matricula: string, familia: string): Observable<Pageable<Pedido>> {
        return this.http.get<Pageable<Pedido>>(`${this.url}/matricula/${matricula}/familia/${familia}`, this.options());
    }   

}
