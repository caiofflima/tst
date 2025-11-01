import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { PermissaoService } from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';

@Directive({
	selector: '[appPermissaoPerfis]'
})
export class PermissaoPerfisDirective {
	constructor(
		private permissaoService: PermissaoService,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef
	) { }

	@Input() set appPermissaoPerfis(perfis: string[]) {
		if (this.permissaoService.possuiUmDosPerfis(perfis)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}
