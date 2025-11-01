/*
export class Anexo extends Entity {

    public idPedido: number;

    public idTipoDocumento: number;

    public nome: string;

    public pedido: Pedido;

    public tipoDocumento: TipoDocumento;

}

export class Beneficiario extends Entity {

    public nome: string = null;
    public cpf: string = null;
    public contato: Contato = new Contato();
    public endereco: Endereco = new Endereco();
    public codFamilia: number;
    public dtNascimento: Date = null;
    public nomeMae: string = null;
    public nomePai: string = null;
    public estadoCivil: string = null;
    public sexo: string = null;

    public matricula: any = null;
    public matriculaFuncional: string = null;
    public tipo: string = null;
    public restrito: string = null;
    public situacao: string = null;
    public codBeneficiario: string = null;
    public contrato: Contrato = new Contrato();
    public tipoDesconto: string = null;

    public nuCartao: string = null;
    public nuConta: string = null;
    public dtInicioCartao: Date = null;
    public dtFimCartao: Date = null;
    public cns: string = null;

    public celular: string;
    public remuneracaoBase: string = null;
    public filial: string = null;
    public vinculoFuncional: VinculoFuncional = new VinculoFuncional();
    public beneficiarios: Beneficiario[] = [];
    public titular: Beneficiario;
    public tipoBeneficiario: TipoBeneficiario;
}

export class CaraterSolicitacao extends Entity {
    public nome: string;
    public documentosProcessos: DocumentoTipoProcesso[];
    public pedidos: Pedido[];

}

export class CartaoIdentificacao extends Entity {

    public matricula: number = null;
    public nome: string = null;

    public contrato: Contrato = null;
    public vinculo: VinculoFuncional = null;
    public endereco: Endereco = null;
    public contato: Contato = null;

    public beneficiarios : Beneficiario[] = null;
    public historicoCartoes: HistoricoCartao[] = null;
}

*/