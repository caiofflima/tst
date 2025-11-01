import { Injectable } from '@angular/core';

import { SessaoService } from '../../../../../app/arquitetura/shared/services/seguranca/sessao.service';

@Injectable()
export class PermissaoService {
	constructor(private sessaoService: SessaoService) {
	}

	public possuiPerfil(perfil: string): boolean {
		try {
			return this.sessaoService.getUsuario()!.hasPerfil(perfil);
		} catch (error) {
			return false;
		}
	}

	public possuiUmDosPerfis(perfis: string[]): boolean {
		for (const perfil of perfis) {
			if (this.possuiPerfil(perfil)) {
				return true;
			}
		}

		return false;
	}

	public possuiRecurso(recurso: string): boolean {
		try {
			return this.sessaoService.getUsuario()!.recursos!.indexOf(recurso) !== -1;
		} catch (error) {
			return false;
		}
	}

	public possuiUmDosRecursos(recursos: string[]): boolean {
		for (const recurso of recursos) {
			if (this.possuiRecurso(recurso)) {
				return true;
			}
		}

		return false;
	}
}
