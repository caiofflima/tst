import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {SituacaoProcesso} from "./situacao-processo";

export class PrazoTratamento extends Entity {
    public override id: number;
    public idTipoProcesso?: number;
    public idSituacaoProcesso: number;
    public prazo?: number | string;
    public diaUtil?: string;
    public historicoAutomatico?: string;
    public inativo?: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date;
    public codigoUsuarioCadastramento?: string;
    public mudancaAutomatica?: string;
    public idMudancaAutomatica?: number;
    public tiposBeneficiario?: number[];
    public nomeTiposBeneficiario?: string;
    public situacaoProcesso?: SituacaoProcesso;
    public tipoProcesso?: string;
}
