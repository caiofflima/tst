import { Entity } from '../../../../../app/arquitetura/shared/models/entity';

export class ConfiguracoesSeguranca extends Entity {
	public realm: string ;
	public idCliente: string ;
	public urlServidorAutorizacao: string ;
	public tempoVidaToken: number ;
	public tempoMaximoIdle: number ;
}
