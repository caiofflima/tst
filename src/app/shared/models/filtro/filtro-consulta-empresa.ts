import { DadoComboDTO } from './../dto/dado-combo';

export class FiltroConsultaEmpresa {

    public cnpj?: string;
    public razaoSocial?: string;
    public contrato?: string;
    public ufsProcesso: DadoComboDTO[] = [];
    public filiaisProcesso: DadoComboDTO[] = [];
    public ativos?: boolean;
}
