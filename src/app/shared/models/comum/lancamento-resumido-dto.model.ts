export class LancamentoResumidoDTO {

    constructor(	 
		public mesCompetencia: number,
		public codigoBeneficiario: number,
		public nomeBeneficiario: string,
		public totalApresentado: number,
		public totalPago: number,
		public totalPendente: number,
		public totalMensalidadeApresentado: number,
		public totalCoparticipacaoApresentado: number,
		public totalEstornoApresentado: number,
		public totalMensalidadePago: number,
		public totalCoparticipacaoPago: number,
		public totalEstornoPago: number,
		public status: string
		 ) {} 
}