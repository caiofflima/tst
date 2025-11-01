import { Entity } from "../../../app/arquitetura/shared/models/entity";

export class UF extends Entity {

    public override id: number = null;
    public sigla: string = null;
    public nome: string = null;
}