import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { PermissaoService } from '../../../../app/arquitetura/shared/services/seguranca/permissao.service';

@Directive({
	selector: '[appPermissaoRecursos]'
})
export class PermissaoRecursosDirective {
	constructor(
		private permissaoService: PermissaoService,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef
	) { }

	@Input() set appPermissaoRecursos(recursos: string[]) {
		if (this.permissaoService.possuiUmDosRecursos(recursos)) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}
}
