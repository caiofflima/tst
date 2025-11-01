import {Entity} from "app/arquitetura/shared/models/entity";
import {EmpresaUnidade} from "./empresa-unidade";

export class EmpresaPrestadora extends Entity {
  public override id: number;
  public dataCadastramento: Date;
  public matriculaCadastramento: string;
  public usuarioCadastramento: string;
  public cnpj: string;
  public razaoSocial: string;
  public contrato: string;
  public filiais?: Array<any> = [];
  public gipes: string;
  public empresaUnidades?: Array<EmpresaUnidade> = [];
}
