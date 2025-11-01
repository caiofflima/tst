import { Entity } from "../../../app/arquitetura/shared/models/entity";

export class Bairro extends Entity {

    public codigo: number = null;
    public municipio: string = null;
    public nome: string = null;
}