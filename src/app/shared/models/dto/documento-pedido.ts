import {PedidoDTO,} from '../../../../app/shared/models/dtos';
import {AnexoDTO} from "./anexo";
import {DocumentoTipoProcesso} from "./documento-tipo-processo";

export interface DocumentoPedidoDTO {
  idPedido: number;
  idDocumentoTipoProcesso: number;
  complementar: string;
  pedido: PedidoDTO;
  documentoTipoProcesso: DocumentoTipoProcesso;
  cpfCadastramento: string;
  dataCadastramento: Date;
  anexos?: AnexoDTO[];
  possuiValidacao?: boolean;
  codigoUsuarioCadastramento: string;
}
