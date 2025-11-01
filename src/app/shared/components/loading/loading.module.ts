import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingModalComponent } from './loading-modal.component';

@NgModule({
	imports: [CommonModule],
	declarations: [LoadingModalComponent],
	exports: [LoadingModalComponent],
})
export class LoadingModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: LoadingModule
		};
	}
}
