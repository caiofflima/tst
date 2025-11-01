
export class ReembolsoDTO {

    constructor(	 
         public ano: number,
         public mesCompetencia: string,
         public codigoBeneficiario: number,
         public nomeBeneficiario: string,
         public codigoPrestador: number,
         public nomePrestador: string,
         public cpfCnpjPrestador: string,
         public dataPagamento: string,
         public valorApresentado: number,
         public valorNaoReembolsado: number,
         public valorReembolso: number,
         public valorPagamento: number,
         public dataAtendimento: string,
		) 
    {
    } 
}