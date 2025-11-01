import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";

export class MotivoNegacao extends Entity {
    public titulo: string;
    public descricaoHistorico: string;
    public documentosProcesso: DocumentoTipoProcesso[];
    public override id: number;
}
