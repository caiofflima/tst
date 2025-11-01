import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { PermissaoService } from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';

@Directive({
	selector: '[appSemPermissaoPerfil]'
})
export class SemPermissaoPerfilDirective {
	constructor(
		private permissaoService: PermissaoService,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef
	) { }

	@Input() set semPermissaoPerfil(perfil: string) {
		if (!this.permissaoService.possuiPerfil(perfil)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}
