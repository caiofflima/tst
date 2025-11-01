import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {Municipio} from "../../../../shared/models/comum/municipio";

export interface DocumentoFiscal {
    cpfCnpj: string,
    nome?: string,
    uf: string,
    municipio: string,
    idEstado: number,
    idMunicipio: number,
    numeroDoc: string,
    data: string | Date | any,
    valor: string,
    ufAsObject?: DadoComboDTO;
    municipioAsObject?: Municipio;
}
