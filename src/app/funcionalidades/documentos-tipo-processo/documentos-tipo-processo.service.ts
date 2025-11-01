import { Injectable } from "@angular/core";

@Injectable()
export class DocumentosTipoProcessoService{
    private title: string = 'Documento por Tipo de Pedido'

    getTitle(){
        return this.title
    }
}