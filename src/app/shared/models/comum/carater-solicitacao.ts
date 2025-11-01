import { Entity } from "../../../../app/arquitetura/shared/models/entity";
import { Pedido } from "./pedido";
import {DocumentoTipoProcesso} from "../dto/documento-tipo-processo";

export class CaraterSolicitacao extends Entity {
    public override id: number;
    public nome: string;
    public documentosProcessos: DocumentoTipoProcesso[];
    public pedidos: Pedido[];

}
