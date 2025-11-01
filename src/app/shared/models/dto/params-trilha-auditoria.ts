import {ModuloTrilhaDTO} from '../../../../app/shared/models/dtos';

export interface ParamsTrilhaAuditoriaDTO {
  modulo: ModuloTrilhaDTO,
  subModulo: ModuloTrilhaDTO,
  idEmail: number,
  numeroProcesso: number,
  situacaoProcesso: any,
  tipoProcesso: any
}
