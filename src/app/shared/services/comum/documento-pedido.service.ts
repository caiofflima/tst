import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { CrudHttpClientService } from 'app/arquitetura/shared/services/crud-http-client.service';
import { Observable } from 'rxjs';
import { DocumentoPedidoDTO } from "../../models/dto/documento-pedido";
import {of} from "rxjs";
import { AnexoDTO } from "../../models/dto/anexo";
import { MessageService } from "../../components/messages/message.service";
import { DocumentoPedido } from "../../models/comum/documento-pedido";
import { SituacaoPedido } from 'app/shared/models/entidades';

@Injectable()
export class DocumentoPedidoService extends CrudHttpClientService<DocumentoPedido> {
    private documentos: DocumentoPedidoDTO[];
    private situacaoPedido: SituacaoPedido;

    avisoParaBotao = new EventEmitter<string>();
    avisoSituacaoPedido = new EventEmitter<boolean>(); // Obrigatórios
    avisoSituacaoPedidoComplementares = new EventEmitter<boolean>(); // Complementares

    private avisoSituacaoPedidoState: boolean | null = null; // Estado anterior para obrigatórios
    private avisoSituacaoPedidoComplementaresState: boolean | null = null; // Estado anterior para complementares

    constructor(
        override readonly messageService: MessageService,
        protected override http: HttpClient
    ) {
        super('documentos-pedido', http, messageService);
    }

    public excluirPorIdPedidoAndIdDocumentoTipoProcesso(idPedido: number, idDocumentoTipoProcesso: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/pedido/${idPedido}/documento-tipo-processo/${idDocumentoTipoProcesso}`, this.options());
    }

    public incluirDocumentoAdicional(idPedido: number, idDocumento: number): Observable<DocumentoPedido> {
        return this.http.put<DocumentoPedido>(`${this.url}/pedido/${idPedido}/documento-adicional/${idDocumento}`, this.options());
    }

    public consultarDocumentosObrigatoriosPorPedido(idPedido: number): Observable<any> {
        if (idPedido) {
            return this.http.get(`${this.url}/pedido/${idPedido}/obrigatorios`, this.options());
        }
        return of();
    }

    public consultarDocumentosPorPedidoAndSituacao(idPedido: number, idSituacaoPedido: number): Observable<any> {
        if (idPedido) {
            return this.http.get(`${this.url}/pedido/${idPedido}/situacao/${idSituacaoPedido}`, this.options());
        }
        return of();
    }

    public consultarDocumentosComplementaresPorPedido(idPedido: number): Observable<any> {
        if (idPedido) {
            return this.http.get(`${this.url}/pedido/${idPedido}/complementares`, this.options());
        }
        return of();
    }

    setDocumentos(docs: DocumentoPedidoDTO[]) {
        this.documentos = docs;
        this.setAvisoDeMudanca('doc');
    }

    getDocumentos() {
        return this.documentos;
    }

    setAguardandoDocumentacao(situacaoPedido: SituacaoPedido) {
        this.situacaoPedido = situacaoPedido;
        this.setAvisoDeMudanca('sit');
    }

    getSituacaoPedido() {
        return this.situacaoPedido;
    }

    setAvisoDeMudanca(tipo: string) {
        this.avisoParaBotao.emit(tipo);
    }

    setAvisoSituacaoPedido(aviso: boolean) {
        // Verifica se o estado mudou antes de emitir
        if (this.avisoSituacaoPedidoState !== aviso) {
            this.avisoSituacaoPedidoState = aviso;
            if (this.avisoSituacaoPedido.observers.length > 0) {
                this.avisoSituacaoPedido.emit(aviso);
            }
        }
    }

    setAvisoSituacaoPedidoComplementares(aviso: boolean) {
        // Verifica se o estado mudou antes de emitir
        if (this.avisoSituacaoPedidoComplementaresState !== aviso) {
            this.avisoSituacaoPedidoComplementaresState = aviso;
            if (this.avisoSituacaoPedidoComplementares.observers.length > 0) {
                this.avisoSituacaoPedidoComplementares.emit(aviso);
            }
        }
    }
    
    getAvisoSituacaoPedidoState(): boolean | null {
        return this.avisoSituacaoPedidoState;
    }

    getAvisoSituacaoPedidoComplementaresState(): boolean | null {
        return this.avisoSituacaoPedidoComplementaresState;
    }

    
}
