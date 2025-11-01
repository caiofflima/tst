import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AscVisualizadorArquivoComponent } from '../../../../app/shared/components/visualizador-arquivo/visualizador-arquivo.component';
import { AscApresentadorComponent } from '../../../../app/shared/components/apresentador/apresentador.component';
import { MessageService } from '../../../../app/shared/components/messages/message.service';
import { AnexoService } from '../../../../app/shared/services/comum/anexo.service';
import { InfoAnexoPedido } from '../../../../app/shared/models/dto/info-anexo-pedido';
import * as constantes from '../../../../app/shared/constantes';
import {toNumber} from "ngx-bootstrap/timepicker/timepicker.utils";

@Component( {
    selector: 'asc-apresentador-arquivos',
    templateUrl: './apresentador-arquivos.component.html',
    styleUrls: ['./apresentador-arquivos.component.scss']
} )
export class AscApresentadorArquivosComponent {

    @ViewChild( 'visualizador' )
    visualizador: AscVisualizadorArquivoComponent
    @ViewChild( 'apresentador' )
    apresentador: AscApresentadorComponent<InfoAnexoPedido>;
    @Input()
    arquivos: InfoAnexoPedido[];
    
    currentInfo: InfoAnexoPedido;

    constructor( protected messageService: MessageService, private anexoService: AnexoService ) {

    }

    public ngOnInit(): void {
        this.apresentador.setApresentaveis(this.arquivos);
    }

    public apresentar(info: InfoAnexoPedido): void {
        this.apresentador.apresentar(info);
    }
    
    public doApresentarArquivo( info: InfoAnexoPedido ): void {
        this.currentInfo = info;
        this.apresentador.disableNav();
        if ( !( info.blob ) ) {
            this.anexoService.obterArquivoPorIdGED( info.idDocGED ).subscribe( res => {
                info.blob = new Blob( [res], { type: info.mimeType } );
                this.visualizar( info );
                this.apresentador.enableNav();
            }, error => {
                this.messageService.showDangerMsg( error.status + ': ' + error.statusText );
            } );
        } else {
            this.visualizar( info );
            this.apresentador.enableNav();
        }
    }

    private visualizar( info: InfoAnexoPedido ): void {
        this.visualizador.visualizarBlob( info.blob, info.mimeType );
        this.apresentador.setHeader('Exibindo: ' + info.nome);
    }

    public baixarArquivo(): void {
        constantes.downloadFile( this.currentInfo.blob, this.currentInfo.nome );
    }

}
