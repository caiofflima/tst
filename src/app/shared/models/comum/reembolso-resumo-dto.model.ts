
import {ReembolsoDTO} from "./reembolso-dto.model";

export class ReembolsoResumoDTO {

    constructor(	 
      public ano: number,
      public mesCompetencia: number,
      public totalApresentado: number,
      public totalNaoReembolsado: number,
      public totalReembolso: number, 
      public totalPagamento: number,
      public reembolsos?: ReembolsoDTO[]
		) 
    {
    } 
}