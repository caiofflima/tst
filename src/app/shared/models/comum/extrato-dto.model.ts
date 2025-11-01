export class ExtratoDTO {

    constructor(	 
        public intHandle: number,
        public strCPF: string,
        public strCompetencia: string,
        public strNoBeneficiario: string,
        public fltTotEscDirigida: number,
        public fltTotEscDirigicaCaixa: number,
        public fltTotLivEscolha: number,
        public strRegimePGTO: string) {
    }  

}