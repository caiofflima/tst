import { Injectable } from '@angular/core';
import { Route, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { SessaoService } from '../../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import { MessageService } from '../../../../../app/shared/components/messages/message.service';

/**
 * Guard para verificar a autenticação e a verificação da permissão na rota acessada
 */
@Injectable()
export class AuthGuard  {
	constructor(
		private sessaoService: SessaoService,
		private messageService: MessageService
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.verificarPermissao(route);
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivate(route, state);
	}

	canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
		return this.sessaoService.verificarAutenticacao();
	}

	private verificarPermissao(route: ActivatedRouteSnapshot): boolean {
		if (!this.sessaoService.verificarAutenticacao()) {
			return false;
		}

		// Verifica se tem scopes para verificação do ACL
		if ((route.data['scopes'] !== undefined) &&
				(!this.sessaoService.validarPermissao(route.data['scopes']))) {
			this.messageService.addMsgInf('Você não possui permissão para acessar esta funcionalidade.')
			this.sessaoService.rotearParaHome();
			return false;
		}

		return true;
	}
}
