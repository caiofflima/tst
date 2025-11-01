import {Laboratorio} from "../../../models/credenciados/laboratorio";
import {isUndefinedOrNull} from "../../../constantes";
import {Especialidade} from "../../../models/credenciados/especialidade";
import {Procedimento} from "../../../models/comum/procedimento";
import {Medicamento} from "../../../models/comum/medicamento";
import {PedidoProcedimento} from "../../../models/comum/pedido-procedimento";

export class PedidoProcedimentoFormModel {
    id?: number;
    idProcedimento?: number;
    idGrauProcedimento?: number;
    qtdSolicitada?: number;
    qtdAutorizada?: number; // Propriedade temporária para o formulário
    motivoNegacao?: number; // Propriedade temporária para o formulário
    dataAtendimento?: Date | string | any;
    valorUnitarioPago?: number | string;
    idAutorizacaoPrevia?: number;
    idLaboratorio?: number;
    laboratorio?: Laboratorio;
    medicamento?: Medicamento;
    idVacina?: number;
    idEspecialidade?: number;
    idRegiaoOdontologica?: number;
    idPatologia?: number;
    codigoMedicamento?: number | string;
    idMedicamento?: number;
    dosagemMedicamento?: number;
    diasAtendidosPelaQuantidade?: number;
    qtdDiasAtendidosPeloMedicamento?: number;
    qtdMedicamento?: number;
    especialidade?: Especialidade;
    procedimento?: Procedimento;
    index?: number;
    pedidoProcedimento?: PedidoProcedimento;
    tsOperacao?: Date = new Date();
}

export function pedidoProcedimentoFormModelIsEmpty(pedidoProcedimentoFormModel: PedidoProcedimentoFormModel) {
    if (isUndefinedOrNull(pedidoProcedimentoFormModel)) return true;
    return Object.keys(pedidoProcedimentoFormModel).every(key => isUndefinedOrNull(pedidoProcedimentoFormModel[key]))
}

export function pedidoProcedimentoFormModelIsNotEmpty(pedidoProcedimentoFormModel: PedidoProcedimentoFormModel) {
    return !pedidoProcedimentoFormModelIsEmpty(pedidoProcedimentoFormModel)
}
