import {PedidoDTO} from "./pedido";
import {TipoDocumento} from "../comum/tipo-documento";

export interface AnexoDTO {
  id?: number;
  idPedido?: number;
  idTipoDocumento?: number;
  nome?: string;
  pedido?: PedidoDTO;
  tipoDocumento?: TipoDocumento;
  dataHoraCadastramento?: Date;
  codigoUsuarioCadastramento?: string;
  cpfCadastramento?: string;
  idDocumentoGED?: string;
  blob?: Blob;
  valido?: boolean;
}

