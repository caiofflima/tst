import {Entity} from "../../../../app/arquitetura/shared/models/entity";
import {Municipio} from "./municipio";

export class Filial extends Entity {
    public municipio: Municipio;
}
