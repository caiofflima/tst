import {MotivoNegacao} from "../comum/motivo-negacao";
import {PedidoProcedimento} from "../comum/pedido-procedimento";
import {Entity} from "../../../arquitetura/shared/models/entity";

export class SituacaoPedidoProcedimento extends Entity {
  idMotivoNegacao: number;
  idProcedimento: number;
  idGrau: number;
  idPedidoProcedimento: number;
  qtdAutorizada: number;
  codigoUsuarioCadastramento?: string;
  dataCadastramento?: Date;
  motivoNegacao?: MotivoNegacao;
  pedidoProcedimento?: PedidoProcedimento;
}
