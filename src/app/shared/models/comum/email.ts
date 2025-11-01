import {Entity} from "../../../arquitetura/shared/models/entity";
import {SituacaoProcesso} from "./situacao-processo";

export class Email extends Entity {
    public idSituacaoProcesso?: number;
    public idTipoOcorrencia?: number;
    public nomeRemetente: string;
    public emailRemetente: string;
    public assunto: string;
    public copiaPara: string;
    public texto: string;
    public inativo?: string;
    public dataInativacao?: Date;
    public dataCadastramento: Date;
    public matriculaCadastramento: number;
    public situacaoProcesso: SituacaoProcesso;
    public nomeSituacaoProcesso: string;
    public codigoUsuarioCadastramento?: string;
    public tipoOcorrencia?: number;

    public nomeTiposBeneficiario: string;
    public nomeTiposProcesso: string;

    public tiposDestinatario: number[];
    public tiposProcesso: number[];
    public tiposBeneficiario: number[];

}
