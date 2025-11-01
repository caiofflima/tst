import { Entity } from "../../../../app/arquitetura/shared/models/entity";

import { Endereco } from "./endereco";
import { Contato } from "./contato";
import { Contrato } from "./contrato";
import { Beneficiario } from "./beneficiario";
import { HistoricoCartao } from "../cartao-identificacao/historicocartao-ci";
import { VinculoFuncional } from "./vinculo-funcional";

export class CartaoIdentificacao extends Entity {

    public matricula: number ;
    public nome: string ;

    public contrato: Contrato ;
    public vinculo: VinculoFuncional ;
    public endereco: Endereco ;
    public contato: Contato ;

    public beneficiarios : Beneficiario[] ;
    public historicoCartoes: HistoricoCartao[] ;
}