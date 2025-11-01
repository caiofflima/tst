import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Pedido} from '../../../../app/shared/models/comum/pedido';
import {Observable} from 'rxjs';
import {RetornoSIASC} from "../../models/dto/retorno-siasc";
import {MessageService} from "../../components/messages/message.service";
import { RetornoExtratoConsolidadoDTO } from '../../../../app/shared/models/comum/retorno-extrato-consolidado-dto.model';
import { RetornoExtratoDetalhadoDTO } from '../../../../app/shared/models/comum/retorno-extrato-detalhado-dto.model';
import { LancamentoDTO } from '../../../../app/shared/models/comum/lancamento-dto.model';
import { ReembolsoAGS } from '../../../../app/shared/models/comum/reembolso-ags';

@Injectable()
export class ReembolsoAGSService extends CrudHttpClientService<any> {
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('reembolso-ags', http, messageService);
    }

    public getLancamentosDoAnoPorCPF(cpf: string, ano: number): Observable<LancamentoDTO[]> {
        return this.http.get<LancamentoDTO[]>(`${this.url}/getLancamentosDoAnoPorCPF/${cpf}/${ano}`, this.options());
    }

    public getReembolsoPorCPFMesAno(cpf: string, mes: number, ano: number): Observable<ReembolsoAGS[]> {
        return this.http.get<ReembolsoAGS[]>(`${this.url}/getReembolsoPorCPFMesAno/${cpf}/${mes}/${ano}`, this.options());
    }

    public getTotalReembolsosDoAnoPorCPF(cpf: string, ano: number): Observable<ReembolsoAGS> {
        return this.http.get<ReembolsoAGS>(`${this.url}/getTotalReembolsosDoAnoPorCPF/${cpf}/${ano}`, this.options());
    }

    public getReembolsosMensaisDoAnoPorCPF(cpf: string, ano: number): Observable<ReembolsoAGS[]> {
        return this.http.get<ReembolsoAGS[]>(`${this.url}/getReembolsosMensaisDoAnoPorCPF/${cpf}/${ano}`, this.options());
    }
}