import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class TipoPedido extends Entity {
  public nome: string | undefined;
  override id: any;

  constructor(id?: number, nome?: string) {
    super();
    this.id = id;
    this.nome = nome;
  }
}
