import {TipoDocumento} from "../comum/tipo-documento";

export interface DocumentoDTO {
  id: number;
  idTipoDocumento?: number;
  tipoDocumento?: TipoDocumento;
  nome?: string;
  descricao?: string;
  linkDownload?: string;
  inativo?: string;
  opme?: string;
  dataInativacao?: Date;
  dataCadastramento?: Date;
  codigoUsuarioCadastramento?: string;
}
