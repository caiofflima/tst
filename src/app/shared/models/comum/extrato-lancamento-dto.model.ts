import { CoparticipacaoDTO } from "./coparticipacao-dto.model"

export class ExtratoLancamentoDTO {

    constructor( 
		public numeroDocumento: number,
		public mesCompetencia: number,
		public codigoBeneficiario: number,
		public nomeBeneficiario: string,
		public dataVencimento: Date,
		public dataPagamento: Date,
		public tipoLancamento: string,
		public totalApresentado: number,
		public totalPago: number,
		public totalPendente: number,
		public status: string,
		public coparticipacoes:CoparticipacaoDTO[]) {
    }
} 