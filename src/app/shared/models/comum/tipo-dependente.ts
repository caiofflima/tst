import {Entity} from "../../../arquitetura/shared/models/entity";

export class TipoDependente extends Entity {
  public codigo?: string = null;
  public descricao?: string = null;
  public parentesco: number;
  public renovavel?: boolean;
  public reativavel?: boolean;
  public tipoLegado?: number;

  constructor(init?: Partial<TipoDependente>) {
    super();
    Object.assign(this, init);
  }
}
