import {Entity} from "../../../../app/arquitetura/shared/models/entity";

import {Documento} from "./documento";
import {Anexo} from "./anexo";

export class TipoDocumento extends Entity {

  public nome: string;
  public documentos: Documento[];
  public anexos: Anexo[];

}
