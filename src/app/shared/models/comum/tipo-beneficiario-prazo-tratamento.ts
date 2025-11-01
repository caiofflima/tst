import { Entity } from "../../../../app/arquitetura/shared/models/entity";
import {TipoProcesso} from "./tipo-processo";
import {PrazoTratamento} from "./prazo-tratamento";

export class TipoBeneficiarioPrazoTratamento extends Entity {
    public idPrazoTratamento: number;
    public idTipoProcesso: number;
    public idTipoBeneficiario: number;
    public tipoProcesso: TipoProcesso[];
    public prazoTratamento: PrazoTratamento;
}