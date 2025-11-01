import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { MessageService } from 'app/shared/components/messages/message.service';

@Component( {
    selector: 'app-lista-mensagens',
    templateUrl: './lista-mensagens.component.html',
    styleUrls: ['./lista-mensagens.component.scss']
} )
export class ListaMensagensComponent extends BaseComponent implements OnInit {

    TipoProcesso: any[];
    selectedTipoProcesso: string;

    constructor( protected override messageService: MessageService, private router: Router ) {
        super( messageService );
    }

    ngOnInit() {
    // no aguardo de funcionalidades
    }

    onInputPesquisar( event: any ): void {
    // no aguardo de funcionalidades
    }

    detalharProcesso() {
        //    this.router.navigateByUrl('/meus-dados/pedidos/detalhar');
    }

    detalharMensagem() {
    // no aguardo de funcionalidades
    }

}
