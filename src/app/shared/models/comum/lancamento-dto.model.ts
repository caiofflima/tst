
export class LancamentoDTO {

    constructor(	 
         public mes: number,
		     public strMes: string,
		     public ano: number,
         public valor: number,
         public valorCoparticipacao: number,
         public valorMensalidade: number,
         public status: string, 
         public codigosBeneficiarios: number[]
		) 
    {
    } 
}