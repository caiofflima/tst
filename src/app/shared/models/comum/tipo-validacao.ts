import {Entity} from "../../../../app/arquitetura/shared/models/entity";

import {ValidacaoDocumentoPedido} from "./validacao-documento-pedido";

export class TipoValidacao extends Entity {
  private nome: string;
  private validacoesDocumentosPedido: ValidacaoDocumentoPedido[];
}

