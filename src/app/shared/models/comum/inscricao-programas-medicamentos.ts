import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";

export class InscricaoProgramasMedicamentos extends Entity {
    public idBeneficiario: string;
    public emailBeneficiario: string;
    public telefoneBeneficiario: string;
    public idPatologia: string;
    public dsInfoAdicional: string;
    public arquivos: DocumentoTipoProcesso
}
