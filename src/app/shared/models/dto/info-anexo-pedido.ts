import {Anexo} from '../../../../app/shared/models/comum/anexo';

export class InfoAnexoPedido {
  public classe: string;
  public nome: string;
  public mimeType: string;
  public idDocGED: string;
  public tipo: string;
  public anexo: Anexo;
  public blob: Blob;

}
