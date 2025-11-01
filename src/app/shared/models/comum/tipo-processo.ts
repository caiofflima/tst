import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {TipoPedido} from "../../../../app/shared/models/comum/tipo-pedido";

export class TipoProcesso extends Entity {
  codigo?: string;
  nome?: string;
  descricao?: string;
  tipoPedido?: TipoPedido;
  idTipoPedido?: number;

  constructor(init?: Partial<TipoProcesso>) {
    super();
    Object.assign(this, init)
  }
}
