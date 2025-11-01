import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {TipoDocumento} from "./tipo-documento";

export class Documento extends Entity {
  public override id: number;
  public idTipoDocumento?: number;
  public tipoDocumento?: TipoDocumento;
  public nome?: string;
  public descricao?: string;
  public linkDownload?: string;
  public inativo?: string;
  public opme?: string;
  public dataInativacao?: Date;
  public dataCadastramento?: Date;
  public codigoUsuarioCadastramento?: string;
}
