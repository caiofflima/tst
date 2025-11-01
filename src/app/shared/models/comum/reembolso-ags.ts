
export class ReembolsoAGS {

    constructor(	 
             public id: number,
		     public nomeBeneficiario: string,
		     public competencia: Date,
             public handlePrestador: number,
             public nomePrestador: string,
             public cpfCnpj: string,
             public dataAtendimento: Date,
             public dataCredito: Date,
             public status: string,
             public valorPagto: number,
             public valorNaoReembolsado: number,
             public valorReembolso: number,
             public valorApresentado: number,
             public cpf: string
		) {
    } 
}
