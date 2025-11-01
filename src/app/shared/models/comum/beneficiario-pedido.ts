export class BeneficiarioPedido {
    public idTipoProcesso?: number;
    public inativo?: string;
    public dataInativacao?: Date;
    public dataCadastramento?: Date;
    public codigoUsuarioCadastramento?: string;
    public tiposBeneficiario?: number[];
    public nomeTiposBeneficiario?: string;
    public tipoProcesso?: string;
    public idTipoBeneficiario?: number
    public idsTipoProcesso?: number[]
    public somenteAtivos?: boolean
    public idsPerfilMinimo?: number[]
    public idPerfilMinimo?: number
    public nomePerfilMinimo?: string
}
