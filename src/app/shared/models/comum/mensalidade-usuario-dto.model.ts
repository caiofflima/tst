export class MensalidadeUsuarioDTO {

    constructor(	 
        public codigoDependente: number,
        public nomeBeneficiario: string,
        public matricula: string,
        public dataAdmissao: string,
        public dataNascimento: string,
        public codBeneficiario: string,
        public nomeMae: string,
        public cpf: string,
        public rg: string,
        public codigo: number,
        public agencia: string,
        public operacao: string,
        public contaCorrente: string,
        public dv: string,
        public contrato: number,
        public situacao: string,
        public titular: number,
        public sumValorMensalidade: number) {
    } 
}