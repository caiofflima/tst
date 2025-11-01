import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {NgIdleModule} from '@ng-idle/core';

import {KeycloakService} from '../../../../app/arquitetura/shared/services/seguranca/keycloak.service';
import {ConfiguracaoSegurancaService} from '../../../../app/arquitetura/shared/services/seguranca/configuracao-seguranca.service';
import {SessaoService} from '../../../../app/arquitetura/shared/services/seguranca/sessao.service';
import {PermissaoService} from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';
import {UsuarioService} from '../../../../app/arquitetura/shared/services/cadastrobasico/usuario.service';
import {PerfilService} from '../../../../app/arquitetura/shared/services/seguranca/perfil.service';
import {PerfilRecursoService} from '../../../../app/arquitetura/shared/services/seguranca/perfil-recurso.service';
import {SistemaService} from '../../../../app/arquitetura/shared/services/sobre/sistema.service';

/**
 * Modulo responsável por prover os serviços de integração e de apoio
 */
@NgModule({
    imports: [
        CommonModule,
        NgIdleModule.forRoot(),
    ],
    declarations: []
})
export class ServiceModule {
    static JWT_CUSTOM_OPTIONS = {config: {}};

    /**
     * Convenção usada para que o módulo 'app' disponibilize as instâncias 'providers'
     * como singleton para todos os modulos da aplicação.
     */
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: ServiceModule,
            providers: [{
                provide: JWT_OPTIONS,
                useValue: ServiceModule.JWT_CUSTOM_OPTIONS.config
            },
                JwtHelperService,
                KeycloakService,
                ConfiguracaoSegurancaService,
                SessaoService,
                PermissaoService,
                UsuarioService,
                PerfilService,
                PerfilRecursoService,
                SistemaService
            ]
        };
    }
}
