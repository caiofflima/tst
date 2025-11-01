import {Entity} from "app/arquitetura/shared/models/entity";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";

export class MotivoSolicitacao extends Entity {
    public nome?: string;
    public documentosProcesso?: DocumentoTipoProcesso[];
    public inativo?: string;
    public prestadoExclusivo?: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date
    public codigoUsuarioCadastramento?: string
}
