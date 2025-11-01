import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {Pedido} from "./pedido";
import {TipoDocumento} from "./tipo-documento";

export class Anexo extends Entity {

  public idPedido: number;

  public idTipoDocumento: number;

  public nome: string;

  public pedido: Pedido;

  public tipoDocumento: TipoDocumento;

}
