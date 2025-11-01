import {Entity} from '../../../app/arquitetura/shared/models/entity';

export class PerfilAcesso extends Entity {
	public nome: string = null;
	public descricao: string = null;
	public dataInicio: string = null;
	public dataFim: string = null;
	public codigoUsuario: string = null;
	public listaFuncionalidades: any[] = [];
	public funcionalidades: any[] = [];
}
