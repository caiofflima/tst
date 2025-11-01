import {Entity} from "app/arquitetura/shared/models/entity";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";
import { SituacaoProcesso } from "./situacao-processo";

export class MotivoNegacao extends Entity {
    public titulo: string;
    public descricaoHistorico: string;
    public documentosProcesso: DocumentoTipoProcesso[];
    public override id: number;
    public situacaoProcesso?: SituacaoProcesso;
    public idSituacaoProcesso?: number;
    public inativo: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date;
    public nivelNegacao: string;
codigoUsuarioCadastramento: any;
}
