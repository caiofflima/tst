import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {Estado} from "./estado";

export class Municipio extends Entity {

  public codigo: number;
  public estado: Estado;
  public siglaUF: string;
  public area: number;
  public nome: string;
}
