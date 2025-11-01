import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DadosTitularComponent } from './visualizar-dados-titular/dados-titular.component';
import { DadosBeneficiarioComponent } from './exibir-dados-beneficiario/dados-beneficiario.component';
import { MeusDadosRoutingModule } from './meus-dados.routing.module';
import { SiascTableModule } from 'app/shared/components/table/table.module';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		TemplatesModule,
		NgxPaginationModule,
		TextMaskModule,
		MeusDadosRoutingModule,
		SiascTableModule
	],
	declarations: [
		DadosTitularComponent,
		DadosBeneficiarioComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class MeusDadosModule { }
