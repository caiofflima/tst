import { Injectable } from '@angular/core';
import { CrudHttpClientService, MessageService } from '../services';
import { HttpClient } from '@angular/common/http';
import { MotivoNegacaoTipoPedido } from 'app/shared/models/comum/motivo-negacao-tipo-pedido';

@Injectable()
export class MotivoNegacaoTipoPedidoService extends CrudHttpClientService<MotivoNegacaoTipoPedido> {

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('motivo-negacao-tipo-pedido', http, messageService);
    }

    getBaseURL(){
        return '/manutencao/parametros/motivo-negacao-tipo-pedido'
    }

    getTitulo(){
        return 'Motivo de Negação por Tipo de Pedido'
    }

    obterListaDeDados(dto: MotivoNegacaoTipoPedido){
        return this.http.patch(`${this.url}/filtro`, dto, this.options());
    }

    excluir(dto: MotivoNegacaoTipoPedido){
        return this.http.patch(this.url + '/delete',dto, this.options());
    }

}
