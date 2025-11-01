import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class EstadoCivil extends Entity {

  public override id: number ;
  public descricao: string ;
  public codigo: number;
  public zGrupo: number;
  public codigoexportacao: number;
}
