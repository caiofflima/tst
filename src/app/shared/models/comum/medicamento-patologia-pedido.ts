import {PedidoDTO} from "../dtos";
import {Medicamento} from "./medicamento";
import {Patologia} from "./patologia";
import {MedicamentoPatologia} from "./medicamento-patologia";

export interface MedicamentoPatologiaPedido {
    id?: number;
    idPedido?: number;
    qtdMedicamento?: number;
    qtdDiasAtendidosPeloMedicamento?: number;
    valorUnitarioPago?: number;
    dataCadastramento?: Date;
    codigoUsuarioCadastramento?: string;
    pedido?: PedidoDTO;
    medicamento?: Medicamento;
    patologia?: Patologia;
    medicamentoPatologia?: MedicamentoPatologia;
}
