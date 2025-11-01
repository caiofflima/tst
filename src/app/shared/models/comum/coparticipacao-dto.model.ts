import { EventoDTO } from "./evento-dto.model"

export class CoparticipacaoDTO {

    constructor( 
		public codigoPrestador: number,
		public nomePrestador: string,
		public cpfCnpjPrestador: string,
		public dataAtendimento: Date,
		public totalApresentado: number,
		public totalCoparticipacao: number,
		public status: string,
		public eventosDtos: EventoDTO[]) {
    }
} 