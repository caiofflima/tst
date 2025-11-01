import { ExtratoDTO } from "./extrato-dto.model";
import { MensalidadeUsuarioDTO } from "./mensalidade-usuario-dto.model";

export class RetornoExtratoConsolidadoDTO {

    constructor(	 
         public fltSumTotEscDirigidaAcumulado: number,
		 public fltSumTotLivEscolhaAcumulado: number,
		 public fltSumTotEscDirigicaCaixaAcumulado: number,
		 public fltSumTotEscDirigicaMes: number,
		 public fltSumTotLivEscolhaMes: number,
		 public fltSumTotEscDirigicaCaixaMes: number,
		 public fltSumMensalidades: number,
		 public fltTetoCopartAnual: number,
		 public extratos: ExtratoDTO[],
		 public mensalidadesUsuario: MensalidadeUsuarioDTO[]) {
    } 
}