import { Entity } from "../../../arquitetura/shared/models/entity";
import { MotivoSolicitacao } from "./motivo-solicitacao";
import { TipoProcesso } from "./tipo-processo";

export interface TipoProcessoMotivoSolicitacaoPK {
    idMotivoSolicitacao: number;
    idTipoProcesso: number;
}

export interface TipoProcessoMotivoSolicitacao {
    id: TipoProcessoMotivoSolicitacaoPK;
    idMotivoSolicitacao: number;
    idTipoProcesso: number;
    idTipoBeneficiario: number;
    parentesco: number;
    tipoDeficiencia: number;
    sexo: string;
    idadeMinima: number;
    idadeMaxima: number;
    motivoSolicitacao: MotivoSolicitacao;
    tipoProcesso: TipoProcesso;

}