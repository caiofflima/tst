import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CrudHttpClientService} from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {Procedimento} from "../../models/comum/procedimento";
import {MessageService} from "../services";
import {HttpUtil} from "../../util/http-util";
import { ProcedimentoReembolso } from '../../../../app/shared/models/comum/ProcedimentoReembolso';


@Injectable()
export class ProcedimentoService extends CrudHttpClientService<any> {
    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('procedimentos', http, messageService);
    }

    consultarPorId(id: number): Observable<Procedimento> {
        return this.http.get<Procedimento>(`${this.url}/${id}`, this.options()).pipe(HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService));
    }

    public consultarProcedimentosPorTipoProcesso(idTipoProcesso: number, 
                                                texto: string, 
                                                isIndisponibilidadeRedeCredenciada: boolean): Observable<any> {
        let options = this.options();
        if (texto) {
            options.params = new HttpParams().set("texto", texto);
        }
        if (isIndisponibilidadeRedeCredenciada) {
            options.params = new HttpParams().set("isIndisponibilidadeRedeCredenciada", 'true');
        }

        console.log('options');
        console.log(options);

        return this.http.get(`${this.url}/tipo-processo/${idTipoProcesso}`, options);
    }

    public consultarProcedimentosPorTipoProcessoAndSexoAndIdade(idTipoProcesso: number, sexo: string, idade: number): Observable<any> {
        return this.consultarProcedimentosPorTipoProcessoAndSexoAndIdadeAndTexto(idTipoProcesso, sexo, idade);
    }

    public consultarProcedimentosPorTipoProcessoAndSexoAndIdadeAndTexto(idTipoProcesso: number, sexo: string,
                                                                        idade: number, texto?: string): Observable<any> {
        let path = `/tipo-processo/${idTipoProcesso}/sexo/${sexo}/idade/${idade}`;
        let options = this.options();
        if (texto) {
            options.params = new HttpParams().set("texto", texto);
        }
        return this.http.get(this.url + path, options);
    }

    public consultarProcedimentosPorPedido(idPedido: number): Observable<any> {
        return this.http.get(`${this.url}/pedido/${idPedido}`, this.options());
    }

    public consultarGrauProcedimento(idProcedimento: number, idGrau: number): Observable<any> {
        return this.http.get(`${this.url}/${idProcedimento}/graus/${idGrau}`, this.options());
    }

    public listarProcedimentosAutorizacaoPrevia(): Observable<Procedimento[]> {
        return this.http.get<Procedimento[]>(`${this.url}/autorizacaoPrevia`, this.options()).pipe(HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService));
    }

    public consultarProcedimentoPorId(idProcedimento: number): Observable<any> {
        return this.http.get(`${this.url}/procedimento/${idProcedimento}`, this.options());
    }

    public listarProcedimentosComReembolso(): Observable<ProcedimentoReembolso[]> {
        return this.http.get<ProcedimentoReembolso[]>(`${this.url}/listaProcedimentosComReembolso`, this.options()).pipe(HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService));
    }
}
