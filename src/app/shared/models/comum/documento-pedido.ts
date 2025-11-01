import {DocumentoPedidoPK} from "./documento-pedido-pk";
import {Pedido} from "./pedido";
import {ValidacaoDocumentoPedido} from "./validacao-documento-pedido";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";

export class DocumentoPedido {
    public id: DocumentoPedidoPK;
    public pedido: Pedido;
    public documentoTipoProcesso: DocumentoTipoProcesso;
    public validacaoDocumentoPedido: ValidacaoDocumentoPedido;
}
