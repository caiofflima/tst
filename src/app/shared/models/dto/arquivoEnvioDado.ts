import {PedidoDTO} from "./pedido";

export class ArquivoEnvioDado extends File {
  id?: number;
  nome?: string;
  pedido?: PedidoDTO;
  dataGeracao?: Date;
}


