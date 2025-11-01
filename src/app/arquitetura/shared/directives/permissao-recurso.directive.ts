import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { PermissaoService } from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';

@Directive({
	selector: '[appPermissaoRecurso]'
})
export class PermissaoRecursoDirective {
	constructor(
		private permissaoService: PermissaoService,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef
	) { }

	@Input() set appPermissaoRecurso(recurso: string) {
		if (this.permissaoService.possuiRecurso(recurso)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}
