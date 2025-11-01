import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {Observable} from 'rxjs';
import * as constantes from 'app/shared/constantes'
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class AnexoService extends CrudHttpClientService<any> {

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('anexos', http, messageService);
    }

    public consultarAnexosDetalhadosPorIdPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/pedido/' + idPedido + '/anexos-detalhados', this.options());
    }

    public consultarPorIdPedido(idPedido: number): Observable<any> {
        return this.http.get(this.url + '/pedido/' + idPedido, this.options());
    }

    public consultarPorIdSituacaoPedido(idSituacaoPedido: number): Observable<any> {
        return this.http.get(this.url + '/situacao-pedido/' + idSituacaoPedido, this.options());
    }

    public realizarDownloadAnexo(anexo: any): void {
        this.obterArquivo(anexo.id).subscribe((fileByteArray: any) => {
            let mimeType = anexo.nome.substr(anexo.nome.lastIndexOf('[.]') + 1);
            let blob = new Blob([fileByteArray], {type: mimeType});
            constantes.downloadFile(blob, anexo.nome);
        });
    }

    public obterArquivo(idAnexo: number): Observable<any> {
        return this.getArraybufferObservable(this.url + '/download/' + idAnexo);
    }

    public obterArquivoPorIdGED(idDocGED: string): Observable<any> {
        return this.getArraybufferObservable(this.url + '/download/ged/' + idDocGED);
    }

    public obterArquivoPorNome(nomeArquivo: string): Observable<any> {
        return this.getArraybufferObservable(this.url + '/download/arquivo-processado/' + nomeArquivo);
    }

    private getArraybufferObservable(url: string): Observable<any> {
        return this.http.get(url, this.arrayBufferOptions());
    }

    private arrayBufferOptions(): any {
        return this.options({
            responseType: 'arraybuffer',
        });
    }

}
