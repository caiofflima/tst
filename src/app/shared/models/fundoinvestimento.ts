import { Entity } from '../../../app/arquitetura/shared/models/entity';

export class FundoInvestimento extends Entity {
    public nomeFantasia: string = null;
    public cnpj: string = null;
    public codigoSiico: string = null;
    public restricaoPublicoAlvo: string = null;
    public tipoFundo: string = null;
    public formaCondominio: string = null;
    public controladorPassivo: string = null;
    public gestor: string = null;
    public distribuidor: string = null;
    public perfilRisco: string = null;    
    public dataMonitorInicio: Date = null;
    public dataMonitorFim: Date = null;
    
    public dataInicial: string = null;
    public dataFinal: string = null;

    public codigoUsuario : string = null;
            
	// storage only
	public token: string = null;
	public ultimoAcesso: string = null;
}
