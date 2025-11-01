import { Entity } from '../../../app/arquitetura/shared/models/entity';

export class Suspeito extends Entity {
    public nome: string = null;
    public descricao: string = null;
    public dataInclusao: Date = null;
    public dataExclusao: Date = null;

    public dataInc: string = null;
    public dataExc: string = null;

    public editavel: boolean = false;

    public codigoUsuario : string = null;
    

}
