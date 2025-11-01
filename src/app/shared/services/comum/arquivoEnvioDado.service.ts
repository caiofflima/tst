import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import * as constantes from 'app/shared/constantes'
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ArquivoEnvioDadoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('arquivoEnvioDado', http, messageService);
    }

    public consultarAtivoPorPedidoId(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/' + idPedido, this.options());
    }

    
    public consultarAnexoEmProcessamentoPorPedidoId(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/anexo-pedido/' + idPedido, this.options());
    }

    public consultarAnexoProcessadoPorPedidoId(idPedido: number, dataCadastramento:Date): Observable<any> {
        console.log("public consultarAnexoProcessadoPorPedidoId(idPedido: number, dataCadastramento:Date): Observable<any> { ==");
        console.log(dataCadastramento);
        let dataFormatada = null;

        if(dataCadastramento){
                    let d = new Date(dataCadastramento);
                    dataFormatada = d.getFullYear()
                            +"-"+('0'+(d.getMonth()+1)).slice(-2)
                            +"-"+('0'+(d.getDate())).slice(-2);
        }

        return this.http.get(this.url + '/anexo-pedido-processado/' + idPedido+"/"+dataFormatada, this.options());
    }
}
