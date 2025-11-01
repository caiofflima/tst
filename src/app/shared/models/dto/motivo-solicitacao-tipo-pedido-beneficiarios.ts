
export interface MotivoSolicitacaoTipoPedidoBeneficiariosDTO {
    idTipoProcesso?: number;
    noTipoProcesso?: string;
    idMotivoSolicitacao?: number;
    noMotivoSolicitacao?: string;
    inativo?: string;
    sexo?: string;
    tipoDeficiencia?: number;
    tiposBeneficiario?: string[];
    idsTipoBeneficiario?: number[];
    idsMotivoTipoBeneficiario?: number[];
    idadeMinima?: number;
    idadeMaxima?: number;
    dataInativacao?: Date;
}

//parentesco?: number;
//idadeMinima?: number;
//idadeMaxima?: number;