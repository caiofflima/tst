import { LancamentoResumidoDTO } from "./lancamento-resumido-dto.model"

export class ExtratoConsolidadoDTO {

    constructor(	 
		 public mesCompetencia: number,
		 public totalApresentado: number,
		 public totalPago: number,
		 public totalPendente: number,
		 public totalMensalidadeApresentado: number,
		 public totalCoparticipacaoApresentado: number,
		 public totalEstornoApresentado: number,
		 public totalMensalidadePago: number,
		 public totalCoparticipacaoPago: number,
		 public totalEstornoPago: number,
		 public status: string,
		 public lancamentosResumidos: LancamentoResumidoDTO[]
		 ) {} 
}