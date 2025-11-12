import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import {UsuarioService} from '../../../../../app/arquitetura/shared/services/cadastrobasico/usuario.service';
import {MessageService} from '../../../../../app/shared/components/messages/message.service';

/**
 * Guard para verificar a flag ST_ATUALIZA_DADOS
 * se estiver com 'S', deve se abrir a tela para atualizar os dados do usuário
 * Também verifica a situação do usuário
 */
@Injectable()
export class DadosUsuarioGuard  {
  private verificandoUsuario = false;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router,
    public messageService: MessageService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.verificandoUsuario = true;
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Flag para não verificar duas vezes
    if (!this.verificandoUsuario) {
      return this.canActivate(route, state);
    }

    return true;
  }
}
