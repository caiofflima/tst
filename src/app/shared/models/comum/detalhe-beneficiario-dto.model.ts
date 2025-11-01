export class DetalheBeneficiarioDTO {

    constructor(	 
        public dataNascimento: Date,
        public nome: string,
        public ativo: boolean,
	    public idade: number,
        public municipio: string,
        public cpf: string,
        public nomeMae: string,
        public nomePai: string,
        public rg: string,
        public orgaoEmissor: string,
        public dataExpedicaoRg: Date,
        public estadoCivil: string,
        public sexo: string,
        public email: string,
        public tipoBeneficiario: string,
        public tipoDeficiencia: string,
        public decisaoJudicial: string,
        public codigoBeneficiario: string,
        public declaracaoNascidoVivo: string,
        public nrCartao: string,
        public motivoCancelamento: number,
        public dataCancelamento: Date,
        public cartao: string,
        public dataAdesao: Date,
        public dataTermino: Date,
        public cartaoLegado: string,
        public cartaoLegadoAnterior: string,
        public isTitular: boolean,
        public isCartaoExpirado: boolean,
        public conta: string,
        public contaDv: string,
        public agencia: string,
        public restrito: boolean
        ) {
    }

 
}