import {Pedido} from './pedido';
import {Procedimento} from './procedimento';
import {GrauProcedimento} from './grau-procedimento';

import {Entity} from '../../../../app/arquitetura/shared/models/entity';
import {Laboratorio} from '../credenciados/laboratorio';
import {Especialidade} from '../credenciados/especialidade';
import {Medicamento} from "./medicamento";
import {Patologia} from "./patologia";
import {SituacaoPedidoProcedimento} from "../dto/situacao-pedido-procedimento";
import { MedicamentoPatologia } from './medicamento-patologia';

export class PedidoProcedimento extends Entity {

  pedido?: Pedido;
  autorizacaoPrevia?: Pedido;
  procedimento?: Procedimento;
  patologia?: Patologia;
  grauProcedimento?: GrauProcedimento;
  regiaoOdontologica?: GrauProcedimento;
  laboratorio?: Laboratorio;
  especialidade?: Especialidade;
  idProcedimento: number;
  idGrauProcedimento: number;
  qtdSolicitada: number;
  qtdMedicamento: number;
  dataAtendimento: Date;
  valorUnitarioPago: number | string;
  idAutorizacaoPrevia: number;
  idLaboratorio: number;
  idVacina: number;
  idEspecialidade: number;
  idPedido: number;
  idRegiaoOdontologica: number;
  idPatologia: number;
  codigoMedicamento: number;
  dosagemMedicamento: number;
  diasAtendidosPelaQuantidade: number;
  qtdDiasAtendidosPeloMedicamento: number;
  index: number;
  medicamento: Medicamento;
  qtdSolicitadaAutorizada?: number;
  emAnalise?: boolean;
  ultimaValidacao?: SituacaoPedidoProcedimento;
  isFormValid?: boolean;
  isEditing: boolean;
  medicamentoPatologia: MedicamentoPatologia;
  tsOperacao: Date;

  constructor(init?: Partial<PedidoProcedimento>) {
    super();
    Object.assign(this, init);
  }

}
