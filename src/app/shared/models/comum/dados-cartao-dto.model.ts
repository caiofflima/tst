export class DadosCartaoDTO {

    constructor(	 
        public nuCartao: string,
        public nuCartaoCompleto: string,
        public noTitular: string,
        public noBeneficiario: string,
        public noRegistroBeneficiario: string,
        public dtNascimento: string,
        public dtEmissao: string,
        public dtInicioValidade: string,
        public dtFimValidade: string,
        public codigoTipoDependente: string,
        public tipoBeneficiario: string,
        public nuCodigoBeneficiario: string,
        public deContrato: string,
        public dePlano: string,
        public tipoCartao: string,
        public cpf: string) {
    }
}