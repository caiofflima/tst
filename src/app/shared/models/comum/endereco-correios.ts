import { Localidade } from "../localidate";
import { TipoLogradouro } from "../tipo-logradouro";

export class EnderecoCorreios {
	
    constructor(public cep?: string, 
                public codigoLogradouro?: string,
                public logradouro?: string,
                public complemento?: string,
                public limiteInferior?: string,
                public limiteSuperior?: string,
                public codigo?: string,
                public bairro?: string,
                public siglaUf?: string,
                public codigoTreco?: string,
                public tipoLogradouro?: TipoLogradouro,
                public localidade?: Localidade,
                public codigoEstadoSIAGS?: number,
                public codigoMunicipioSIAGS?: number
             	){
    }
}