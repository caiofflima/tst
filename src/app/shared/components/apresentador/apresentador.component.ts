import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AscVisualizadorArquivoComponent } from 'app/shared/components/visualizador-arquivo/visualizador-arquivo.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import * as constantes from 'app/shared/constantes';

@Component( {
    selector: 'asc-apresentador',
    templateUrl: './apresentador.component.html',
    styleUrls: ['./apresentador.component.scss']
} )
export class AscApresentadorComponent<T> {

    @Output('onNavigate')
    private emitter: EventEmitter<T>;
    @Input( 'tituloModal' )
    tituloModal: string;
    @Input( 'apresentaveis' )
    apresentaveis: T[];
    currentInfo: T;
    display: boolean;
    disabledProximo: boolean;
    disabledAnterior: boolean;
    header: string;

    constructor( protected messageService: MessageService) {
        if ( !this.apresentaveis ) {
            this.apresentaveis = [];
        }
        this.emitter = new EventEmitter<T>();
        this.tituloModal = 'Exibição';
        this.display = false;
    }


    
    public setHeader(header: string): void {
        this.header = header;
    }

    public setApresentaveis(apresentaveis: T[]): void {
        this.apresentaveis = apresentaveis;
    }
    
    public apresentar( info: T ): void {
        this.header = '';
        this.disableNav();
        this.currentInfo = info;
        this.emitter.emit(this.currentInfo);
        this.enableNav();
        this.display = true;
    }
    
    private configurarApresentacao( index: number ): void {
        if ( index < 0 && !this.temAnterior() ) {
            return;
        } else if ( index > 0 && !this.temProximo() ) {
            return;
        }
        let currIndex = this.apresentaveis.indexOf( this.currentInfo );
        let amostra = this.apresentaveis[currIndex + index];
        this.apresentar( amostra );
        this.emitter.emit( amostra );
    }

    public close(): void {
        this.display = false;
        this.disableNav();
    }


    public apresentarAnterior(): void {
        this.configurarApresentacao( -1 );
    }

    public temAnterior(): boolean {
        if ( !constantes.isUndefinedOrNull( this.apresentaveis ) )
            return 0 < this.apresentaveis.indexOf( this.currentInfo );
        return false;
    }

    public temProximo(): boolean {
        if ( !constantes.isUndefinedOrNull( this.apresentaveis ) )
            return this.apresentaveis.length > this.apresentaveis.indexOf( this.currentInfo ) + 1;
        return false;
    }

    public apresentarProximo(): void {
        this.configurarApresentacao( 1 );
    }

    public disableNav(): void {
        this.disabledAnterior = true;
        this.disabledProximo = true;
    }

    public enableNav(): void {
        this.disabledAnterior = false;
        this.disabledProximo = false;
    }

}
