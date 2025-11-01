import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class TipoBeneficiario extends Entity {
  public codigo: string ;
  public nome?: string ;

  constructor(init?: Partial<TipoBeneficiario>) {
    super();
    Object.assign(this, init);
  }
}
