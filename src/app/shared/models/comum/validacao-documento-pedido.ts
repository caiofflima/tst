import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class ValidacaoDocumentoPedido extends Entity {
  idTipoValidacao: number;
  idPedido: number;
  idDocumentoTipoProcesso: number;
  dataValidacao: Date;
  codigoUsuarioValidacao: string;
  edicao = false;
}

