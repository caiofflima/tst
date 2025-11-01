import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders } from '@angular/core';

import { MessageService } from './message.service';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { InternacionalizacaoPipe } from './internacionalizacao.pipe';
import { ConfirmMessageComponent } from './confirm-message/confirm-message.component';

/**
 * Modulo responsável por prover recursos de 'mensagens' e 'i18n' para aplicação.
 */
@NgModule({
	imports: [CommonModule],
	declarations: [
		InternacionalizacaoPipe,
		AlertMessageComponent,
		ConfirmMessageComponent
	],
	exports: [
		InternacionalizacaoPipe,
		AlertMessageComponent,
		ConfirmMessageComponent
	]
})
export class MessageModule {
	static forRoot(): ModuleWithProviders<any> {
		return {
			ngModule: MessageModule,
			providers: [
				MessageService,
				InternacionalizacaoPipe
			]
		};
	}
}
