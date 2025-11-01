
export interface MotivoSolicitacaoTipoPedidoIncluirDTO {
    id?: number;
    inativo?: string;
    sexo?: string;
    dataInativacao?: Date;
    dataCadastramento?: Date
    idTipoProcesso?: number;
    idMotivoSolicitacao?: number;
    idsTipoBeneficiario?: number[];
    parentesco?: number;
    tipoDeficiencia?: number;
    idadeMinima?: number;
    idadeMaxima?: number;
    coUsuarioCadastramento?:string;
}
