import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ComponenteUploadable } from '../../../../../app/shared/components/pedido/componente-uploadable';
import { ComponentePedidoComponent } from '../../../../../app/shared/components/pedido/componente-pedido.component';
import { ComponenteNotificavel } from '../../../../../app/shared/components/pedido/componente-notificavel';
import { MessageService } from '../../../../../app/shared/components/messages/message.service';
import { AnexoService } from '../../../../../app/shared/services/comum/anexo.service';
import { Pedido } from '../../../../../app/shared/models/comum/pedido';
import { Data } from '../../../../../app/shared/providers/data';
import { ComposicaoPedidoService } from 'app/shared/services/components/composicao-pedido.service';

@Component( {
    selector: 'asc-anexos-pedido',
    templateUrl: './anexos-pedido.component.html',
    styleUrls: ['./anexos-pedido.component.scss']
} )
export class AscAnexosPedidoComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

    @Input('rascunhoPedido')
    override rascunhoPedido: boolean;
    listaAnexosPedido: any[];

    constructor( protected override messageService: MessageService, protected override router: Router, protected override data: Data,
        private anexoService: AnexoService, protected override composicaoPedidoService: ComposicaoPedidoService ) {
        super( messageService, composicaoPedidoService, router, data );
        this.listaAnexosPedido = [];
    }

    public override ngOnInit(): void {
        this.composicaoPedidoService.registrarObserver(this);
    }

    public atualizarInformacoes( idPedido: number ): void {
        this.carregarListaAnexosPedido( idPedido );
    }

    private carregarListaAnexosPedido( idPedido: number ): void {
        this.anexoService.consultarAnexosDetalhadosPorIdPedido( idPedido ).subscribe( res => {
            this.listaAnexosPedido = res;
        }, error => this.messageService.showDangerMsg( error.error ) );
    }
    
    public realizarDownloadArquivo(anexo: any){
        this.anexoService.realizarDownloadAnexo(anexo);
    }

}
