import {Entity} from "../../../arquitetura/shared/models/entity";

export class Atendimento extends Entity {
    public matricula: string;
    public nome: string;
    public titular: string;
    public contrato: string;
    public familia: string;
}
