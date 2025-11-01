
export interface MotivoSolicitacaoTipoPedidoDTO {
    id?: number;
    inativo?: string;
    sexo?: string;
    dataInativacao?: Date;
    dataCadastramento?: Date
    idTipoProcesso?: number;
    idMotivoSolicitacao?: number;
    idTipoBeneficiario?: number;
    parentesco?: number;
    tipoDeficiencia?: number;
    idadeMinima?: number;
    idadeMaxima?: number;
    coUsuarioCadastramento?:string;
    idsMotivoTipoBeneficiario?: number[];
}
