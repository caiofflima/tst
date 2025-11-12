import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject, of} from 'rxjs';
import {CrudHttpClientService} from 'app/arquitetura/shared/services/crud-http-client.service';
import {ValidacaoDocumentoPedido} from "../../models/comum/validacao-documento-pedido";
import {MessageService} from "../../components/messages/message.service";

@Injectable()
export class ValidacaoDocumentoPedidoService extends CrudHttpClientService<ValidacaoDocumentoPedido> {
    
    private atualizacaoValidacoesSubject = new Subject<void>();

    atualizacaoValidacoes$ = this.atualizacaoValidacoesSubject.asObservable();

    constructor(
        override readonly messageService: MessageService,
        protected override readonly http: HttpClient
    ) {
        super('validacoes-documento-pedido', http, messageService);
    }

    emitirAtualizacao(): void {
        this.atualizacaoValidacoesSubject.next();
    }

    public consultarTodos(): Observable<any> {
        return this.http.get(this.url, this.options());
    }

    public consultarValidacaoDocumentoPedido(idPedido: number, idDocProc: number): Observable<ValidacaoDocumentoPedido> {
        if (idDocProc) {
            return this.http.get<ValidacaoDocumentoPedido>(`${this.url}/pedido/${idPedido}/documentos-tipo-processo/${idDocProc}`, this.options());
        }

        return of<ValidacaoDocumentoPedido>();
    }

    public consultarValidacaoListaDocumentoPedido(lista:{idPedido: number, idDocumentoTipoProcesso: number}[]): Observable<ValidacaoDocumentoPedido[]> {
        if (lista) { 
            //console.log(lista);
            return this.http.post<ValidacaoDocumentoPedido[]>(`${this.url}/pedido/lista-documentos-tipo-processo`, lista, this.options());
        }

        return of([]);
    }

    public consultarValidacaoListaObservableDocumentoPedido(lista:{idPedido: number, idDocumentoTipoProcesso: number}[]): Observable<ValidacaoDocumentoPedido>[] {
        const listaConvertida:Observable<ValidacaoDocumentoPedido>[] = [];
        if (lista) { 
            const request:Observable<ValidacaoDocumentoPedido[]> = this.http.post<ValidacaoDocumentoPedido[]>(`${this.url}/pedido/lista-documentos-tipo-processo`, lista, this.options());

            request.subscribe((documentos: ValidacaoDocumentoPedido[])=>{
                documentos.forEach(doc=>listaConvertida.push(of(doc)));
            });

        }

        return listaConvertida;
    }
}
