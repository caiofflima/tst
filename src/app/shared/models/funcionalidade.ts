import { Entity } from '../../../app/arquitetura/shared/models/entity';

export class Funcionalidade extends Entity {
    public nome: string = null;
	public descricao: string = null;
    public dadataInicio: string = null;
    public dadataFim: string = null;
    public codigoUsuario: string = null;
    public editavel: boolean = false;
}