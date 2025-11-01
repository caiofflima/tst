import { Storage } from '../../../../app/arquitetura/shared/storage/storage';
import { Usuario } from '../../../../app/arquitetura/shared/models/cadastrobasico/usuario';

export class UsuarioStorage extends Storage<Usuario> {
	constructor() {
		super(Usuario, 'usuario');
	}
}
