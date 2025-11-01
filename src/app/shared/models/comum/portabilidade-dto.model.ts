export class PortabilidadeDTO {

    constructor(
        public nomeBeneficiario: string,
        public cpfBeneficiario: string,
        public sexoBeneficiario: string,
        public nomeTitular: string,
        public cpfTitular: string,
        public sexoTitular: string,
        public beneficiarioEhTitular: string,
        public codigoFilhoOuEnteado: number,
        public dtAdesao: Date,
        public dtValidadeCartao: Date,
        public dtValidadePlano: Date) {
    }
}