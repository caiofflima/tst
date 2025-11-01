import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../../../../app/shared/components/messages/message.service';
import { AnexoService } from '../../../../app/shared/services/comum/anexo.service';

@Component( {
    selector: 'asc-visualizador-arquivo',
    templateUrl: './visualizador-arquivo.component.html',
    styleUrls: ['./visualizador-arquivo.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class AscVisualizadorArquivoComponent {

    @Input('type')
    type: string;
    @Input('width')
    width: string;
    @Input('height')
    height: string;

    constructor( protected messageService: MessageService, private anexoService: AnexoService ) {
        if(!this.width){
            this.width = '780px';
        }
        if(!this.height){
            this.height = '400px';
        }
    }

    private getPreview(): any {
        return document.querySelector('object');
    }
    public visualizar(url: string, type: string ): void {
		this.getPreview().style.display = 'none';
        this.getPreview().data = url;
        this.getPreview().type = type;
		this.getPreview().style.display = 'block';
    }
    
    public visualizarBlob(data: Blob, type: string ): void {
        let preview = this.getPreview();
        let fr = new FileReader();
        preview.style.display = 'none';
        fr.onloadend = function () {
            preview.type = type;
            preview.data = fr.result;
            preview.style.display = 'block';
        }
        fr.readAsDataURL(data);
    }
    
    public visualizarPDF(data: Blob): void{
        this.visualizarBlob(data, 'application/pdf');
    }
    
    public visualizarPNG(data: Blob): void{
        this.visualizarBlob(data, 'image/png');
    }
    
    public visualizarJPG(data: Blob): void{
        this.visualizarBlob(data, 'image/jpg');
    }
    
    public visualizarGIF(data: Blob): void{
        this.visualizarBlob(data, 'image/gif');
    }
    
    public clear(): void {
        this.getPreview().style.display = 'none';
        this.getPreview().data = 'assets/images/exit_p_white.png';
        this.getPreview().type = 'image/png';
        this.getPreview().style.display = 'block';
    }

}
