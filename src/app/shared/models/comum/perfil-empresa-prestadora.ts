import { Entity } from "../../../../app/arquitetura/shared/models/entity";

export class PerfilEmpresaPrestadora extends Entity {
  public override id:number;
  public perfil:any;
  public atuacaoProfissional:any;
  public dataLimite:Date;
  public perfis:any[];

}
