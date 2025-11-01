import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { SiascTableComponent } from './siasc-table/siasc-table.component';

@NgModule({
	imports: [
		CommonModule,
		NgxPaginationModule
	],
	declarations: [
		SiascTableComponent
	],
	exports: [
		SiascTableComponent
	],
})
export class SiascTableModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: SiascTableModule
		};
	}
}
