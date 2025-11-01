import { Beneficiario } from "../../../shared/models/entidades";

export class ReciboModel {
  beneficiario?: Beneficiario;
  idTipoBeneficiario?: number;
  idTipoProcesso?: number;
  protocoloAns?: string;
  telefoneBeneficiario?: string;
  nomeBeneficiario?: string;
  tipoProcesso?: string;
  id?: number;
}
