import { Entity } from "../../../../app/arquitetura/shared/models/entity";

export class GrupoDocumento extends Entity {
    public override id: number;
    public nome: string;
    public descricao: string;
}