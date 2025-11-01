import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { PermissaoService } from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';

@Directive({
	selector: '[appPermissaoPerfil]'
})
export class PermissaoPerfilDirective {
	constructor(
		private permissaoService: PermissaoService,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef
	) { }

	@Input() set appPermissaoPerfil(perfil: string) {
		if (this.permissaoService.possuiPerfil(perfil)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}
