import {Entity} from "../../../arquitetura/shared/models/entity";

export interface TipoOcorrencia extends Entity {
  nome: string;
  descricao?: string;
}
