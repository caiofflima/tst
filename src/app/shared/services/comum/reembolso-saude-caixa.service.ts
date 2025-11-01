import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {MessageService} from "../../components/messages/message.service";

import { RetornoExtratoConsolidadoDTO } from '../../../../app/shared/models/comum/retorno-extrato-consolidado-dto.model';
import { ExtratoLancamentoDTO } from '../../../../app/shared/models/comum/extrato-lancamento-dto.model';
import { LancamentoDTO } from '../../../../app/shared/models/comum/lancamento-dto.model';
import { DadosCartaoDTO } from "../../../../app/shared/models/comum/dados-cartao-dto.model";
import { ReembolsoResumoDTO } from "../../../../app/shared/models/comum/reembolso-resumo-dto.model";
import { ReembolsoDTO } from "../../../../app/shared/models/comum/reembolso-dto.model";
import { ExtratoConsolidadoDTO } from "../../../../app/shared/models/comum/extrato-consolidade-dto.model";
import { CoparticipacaoDTO } from "../../../../app/shared/models/comum/coparticipacao-dto.model";

@Injectable()
export class ReembolsoSaudeCaixaService extends CrudHttpClientService<any> {
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('reembolso', http, messageService);
    }

    public getReembolsoConsolidado(cpf: string, mes: number, ano: number): Observable<RetornoExtratoConsolidadoDTO> {
        return this.http.get<RetornoExtratoConsolidadoDTO>(`${this.url}/getReembolsoConsolidado/${cpf}/${mes}/${ano}`, this.options());
    }

    public getExtratoDetalhado(cpf: string, mes: number, ano: number, matricula: string, id: number): Observable<ExtratoLancamentoDTO[]> {
        return this.http.get<ExtratoLancamentoDTO[]>(`${this.url}/getExtratoDetalhado/${cpf}/${mes}/${ano}/${matricula}/${id}`, this.options());
    }

    public getLancamentosDoAnoPorCPF(cpf: string, ano: number): Observable<LancamentoDTO[]> {
        return this.http.get<LancamentoDTO[]>(`${this.url}/getLancamentosDoAnoPorCPF/${cpf}/${ano}`, this.options());
    }

    public getTotalPagamentosEfetuadosDoAnoPorCPF(cpf: string, ano: number): Observable<LancamentoDTO> {
        return this.http.get<LancamentoDTO>(`${this.url}/getTotalPagamentosEfetuadosDoAnoPorCPF/${cpf}/${ano}`, this.options());
    }

    public getComprovanteIRPFPorCPF(cpf: string, ano: number): Observable<any> {
        return this.http.get<any>(`${this.url}/getComprovanteIRPFPorCPF/${cpf}/${ano}`, this.options());
    }

    public getDadosCartaoPorCPF(cpf: string): Observable<DadosCartaoDTO[]> {
        return this.http.get<DadosCartaoDTO[]>(`${this.url}/getDadosCartaoPorCPF/${cpf}`, this.options());
    }

    public getReembolsosResumoPorAno(cpf: string, ano: number): Observable<ReembolsoResumoDTO[]> {
        return this.http.get<ReembolsoResumoDTO[]>(`${this.url}/getReembolsosResumoPorAno/${cpf}/${ano}`, this.options());
    }

    public getReembolsosPorAno(cpf: string, ano: number): Observable<ReembolsoDTO[]> {
        return this.http.get<ReembolsoDTO[]>(`${this.url}/getReembolsosPorAno/${cpf}/${ano}`, this.options());
    }

    public getExtratosConsolidados(cpf: string, ano: number): Observable<ExtratoConsolidadoDTO[]> {
        return this.http.get<ExtratoConsolidadoDTO[]>(`${this.url}/getExtratosConsolidados/${cpf}/${ano}`, this.options());
    }

    public getCoparticipacoes(cpf: string, idBeneficiario: number, ano: number, mes: number, matricula: string): Observable<CoparticipacaoDTO[]> {
        console.log(`${this.url}/getCoparticipacoes/${cpf}/${idBeneficiario}/${ano}/${mes}/${matricula}`);
        return this.http.get<CoparticipacaoDTO[]>(`${this.url}/getCoparticipacoes/${cpf}/${idBeneficiario}/${ano}/${mes}/${matricula}`, this.options());
    }
}