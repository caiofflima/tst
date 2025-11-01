import {Entity} from "../../../arquitetura/shared/models/entity";

export interface Sexo extends Entity {
  nome: string;
  descricao?: string;
}
