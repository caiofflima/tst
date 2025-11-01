import { Entity } from 'app/arquitetura/shared/models/entity';

export class Recurso extends Entity {
	public nome: string = null;
	public descricao: string = null;
	public usuarioUltimaAtualizacao: string = null;
	public terminalUltimaAtualizacao: string = null;
	public dataHoraUltimaAtualizacao: Date = null;
}
