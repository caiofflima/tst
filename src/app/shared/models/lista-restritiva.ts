import { Entity } from '../../../app/arquitetura/shared/models/entity';

export class ListaRestritiva extends Entity {
    public nome: string = null;
    public descricao: string = null;
    public listaSuspeitos: any[] = [];
    public status: string = null; 
}