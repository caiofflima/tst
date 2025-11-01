import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { ComponentePedidoComponent } from '../../../../../app/shared/components/pedido/componente-pedido.component';
import { AscProgressoPrazoComponent } from '../../../../../app/shared/components/pedido/progresso-prazo/progresso-prazo.component';
import { SituacaoPedidoService } from '../../../../../app/shared/services/comum/situacao-pedido.service';
import { ComposicaoPedidoService } from '../../../../../app/shared/services/components/composicao-pedido.service';
import { ComponenteNotificavel } from '../../../../../app/shared/components/pedido/componente-notificavel';
import { Router } from '@angular/router';
import { Data } from '../../../../../app/shared/providers/data';
import { MessageService } from 'app/shared/services/services';


@Component( {
    selector: 'asc-vis-dados-processo',
    templateUrl: './vis-dados-processo.component.html',
    styleUrls: ['./vis-dados-processo.component.scss']
} )
export class AscVisDadosProcessoComponent extends ComponentePedidoComponent implements OnInit, ComponenteNotificavel {

    @ViewChild( 'progressoPrazo' )
    progressoPrazo: AscProgressoPrazoComponent;

    @Input( 'motivoSolicitacao' ) motivoSolicitacao: any;
    @Input( 'tipoProcesso' ) tipoProcesso: any;
    @Input( 'situacaoPedido' ) situacaoPedido: any;


    constructor( protected override messageService: MessageService, protected override composicaoPedidoService: ComposicaoPedidoService,
        protected override data: Data, protected override router: Router,
        private situacaoPedidoService: SituacaoPedidoService ) {
        super( messageService, composicaoPedidoService, router, data );
    }

    public atualizarInformacoes( idPedido: number ): void {
        this.situacaoPedidoService.consultarUltimaMudancaStatusPedido( idPedido ).subscribe( res => this.situacaoPedido = res );
        if(this.progressoPrazo){
            this.progressoPrazo.atualizarInformacoes( idPedido );
        }
    }

    public override ngOnInit(): void {
        this.composicaoPedidoService.registrarObserver( this );
    }

}
