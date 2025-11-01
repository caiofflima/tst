import {SimNaoEnum} from "./sim-nao";
import {Laboratorio} from "../credenciados/laboratorio";
import {Entity} from "../../../arquitetura/shared/models/entity";

export class Medicamento extends Entity {
  idLaboratorio?: number;
  nome?: string;
  coMedicamento?: number;
  codigoApresentacao?: string;
  descricaoApresentacao?: string;
  valor?: number;
  qtdFracionado?: number;
  valorFracionado?: number;
  percentualAliquota?: number;
  codigoBarraAnvisa?: number;
  numeroTiss?: number;
  numeroTuss?: number;
  numeroUltimaEdicao?: number;
  generico?: SimNaoEnum;
  inativo?: SimNaoEnum;
  dataInativacao?: Date;
  dataCadastramento?: Date;
  codigoUsuarioCadastramento?: string;
  codigoBarrasAnvisa?: string;
  laboratorio?: Laboratorio;
  medicamentoPatologias?: any[];

  constructor(init?: Partial<Medicamento>) {
    super();
    Object.assign(this, init)
  }
}
