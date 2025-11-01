import {PedidoProcedimento} from "./pedido-procedimento";
import {Procedimento} from "./procedimento";
import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class GrauProcedimento extends Entity {
  public idProcedimento: number;
  public nome: string;
  public pedidosProcedimento: PedidoProcedimento[];
  public procedimento: Procedimento;
}
