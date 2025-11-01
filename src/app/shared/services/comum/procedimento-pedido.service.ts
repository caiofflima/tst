import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import {PedidoProcedimento} from "../../models/comum/pedido-procedimento";
import {of} from "rxjs";
import {MessageService} from "../../components/messages/message.service";
import { Router } from '@angular/router';

@Injectable()
export class ProcedimentoPedidoService extends CrudHttpClientService<any> {
    pedidoProcedimentosTabela: PedidoProcedimento[] = [];
    pedidoListenerValorNotaFiscal = new EventEmitter()
    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient,
        private router: Router
    ) {
        super('procedimentos-pedido', http, messageService);
    }

    public consultarPedidosProcedimentoPorPedido(idPedido: number): Observable<any> {
        return this.http.get(`${this.url}/pedido/${idPedido}`, this.options());
    }

    public consultarPedidosPorPedidoEProcedimento(idPedido: number, idProcedimento: number): Observable<any> {
        return this.http.get(`${this.url}/pedido/${idPedido}/procedimento/${idProcedimento}`, this.options());
    }

    public incluirOuAtualizarPedidoProcedimento(pedidoProcedimento: PedidoProcedimento): Observable<any> {
        console.log('Procedimento pedido');
        console.log(pedidoProcedimento);
        return this.http.post(`${this.url}/`, pedidoProcedimento, this.options());
    }

    public excluirPorId(idPedidoProcedimento: number): Observable<any> {
        if (idPedidoProcedimento) {
            return this.http.delete(`${this.url}/${idPedidoProcedimento}`, this.options());
        }

        return of({});
    }

    public excluirProcedimentosPedidoPorIdPedido(idPedido: number): Observable<any> {
        return this.http.delete(`${this.url}/excluir-procedimentos/pedido/${idPedido}`, this.options());
    }
    
    public excluirProcedimentoDoPedido(idPedido: number, idProcedimento: number): Observable<any> {
        return this.http.delete(`${this.url}/excluir-procedimento?idPedido=${idPedido}&idProcedimento=${idProcedimento}`, this.options());
    }

    public setValorNotaFiscal(val: any){
        this.pedidoListenerValorNotaFiscal.emit(val)
    }

    public setPedidoProcedimentoTabela(pedProc: PedidoProcedimento[]){
        this.pedidoProcedimentosTabela = pedProc
    }

    public getPedidoProcedimentoTabela(){
        return this.pedidoProcedimentosTabela;
    }

    public obterRotaAtual(): string {
        return this.router.url;
      }

}
