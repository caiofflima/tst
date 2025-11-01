import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';

import { PaginationComponent } from './pagination.component';

@NgModule({
	imports: [CommonModule, NgxPaginationModule],
	declarations: [PaginationComponent],
	exports: [PaginationComponent, NgxPaginationModule],
})
export class PaginationModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: PaginationModule
		};
	}
}
