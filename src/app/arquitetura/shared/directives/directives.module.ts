import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NamedOutletDirective } from '../../../../app/arquitetura/shared/directives/named-outlet.directive';
import { PermissaoPerfilDirective } from './permissao-perfil.directive';
import { PermissaoPerfisDirective } from './permissao-perfis.directive';
import { SemPermissaoPerfilDirective } from './sem-permissao-perfil.directive';
import { PermissaoRecursoDirective } from './permissao-recurso.directive';
import { PermissaoRecursosDirective } from './permissao-recursos.directive';
import { SemPermissaoRecursoDirective } from './sem-permissao-recurso.directive';

const DIRECTIVES_COMPONENTS = [
	NamedOutletDirective,
	PermissaoPerfilDirective,
	PermissaoPerfisDirective,
	SemPermissaoPerfilDirective,
	PermissaoRecursoDirective,
	PermissaoRecursosDirective,
	SemPermissaoRecursoDirective
];

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: DIRECTIVES_COMPONENTS,
	exports: DIRECTIVES_COMPONENTS
})
export class DirectivesModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: DirectivesModule
		};
	}
}
