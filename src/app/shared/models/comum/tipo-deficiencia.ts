import {Entity} from "../../../arquitetura/shared/models/entity";

export class TipoDeficiencia extends Entity {
  public codigo?: string;
  public descricao?: string;

  constructor(init?: Partial<TipoDeficiencia>) {
    super();
    Object.assign(this, init);
  }
}
