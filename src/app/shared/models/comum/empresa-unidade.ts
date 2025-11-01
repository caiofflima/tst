import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {Filial} from "./filial";

export class EmpresaUnidade extends Entity {
  public override id: number;
  public filial: Filial;
}
