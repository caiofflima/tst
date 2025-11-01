export class CartaoDTO {

    constructor(	 
        public nrCartao: string,
        public noTitular: string,
        public nomeBeneficiario: string,
        public dtValidade: Date,
        public dtNascimento: Date,
        public dtAdesao: Date,
        public dtEmissao: Date,
        public coBeneficiario: string,
        public acomodacao: string,
        public noContrato: string,
        public nuContrato: string,
        public noOperadora: string,
        public restrito: string) {

    }
}
