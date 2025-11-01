import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudHttpClientService } from '../../../../app/arquitetura/shared/services/crud-http-client.service';
import { MessageService } from '../../../../app/shared/components/messages/message.service';
import { SessaoService } from '../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import { ComponenteNotificavel } from '../../../../app/shared/components/pedido/componente-notificavel';
import { FileUploadService } from '../../../../app/shared/services/comum/file-upload.service';
import { Observable } from 'rxjs';
import { SituacaoPedido } from '../../../../app/shared/models/comum/situacao-pedido';
import { Pedido } from '../../../../app/shared/models/comum/pedido';
import { SituacaoPedidoService } from '../comum/situacao-pedido.service';
import { SituacaoProcessoService } from '../comum/situacao-processo.service';

@Injectable()
export class ComposicaoPedidoService {

    observers: ComponenteNotificavel[];

    constructor( private messageService: MessageService, private situacaoPedidoService: SituacaoPedidoService,
        private situacaoProcessoService: SituacaoProcessoService, private uploadService: FileUploadService ) {
        this.observers = [];
    }

    public registrarObserver( observer: ComponenteNotificavel ): void {
        this.observers.push( observer );
    }

    public notificarObservers( idPedido: number ): void {
        for ( let o of this.observers ) {
            o.atualizarInformacoes( idPedido );
        }
    }
}