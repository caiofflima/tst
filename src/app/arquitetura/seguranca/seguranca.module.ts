import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { DirectivesModule } from '../shared/directives/directives.module';
import { TemplatesModule } from '../shared/templates/templates.module';
import { SegurancaRoutingModule } from './seguranca.routing.module';
import { PerfilConsultaComponent } from './perfil/consulta/perfil-consulta.component';
import { PerfilCadastroComponent } from './perfil/cadastro/perfil-cadastro.component';
import { ComponentModule } from 'app/shared/components/component.module';

// Aplicação

/**
 * Modulo Segurança
 **/
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		NgxPaginationModule,
		DirectivesModule.forRoot(),
		TemplatesModule,
		SegurancaRoutingModule,
		ComponentModule
	],
	declarations: [
		PerfilConsultaComponent,
		PerfilCadastroComponent
	]
})
export class SegurancaModule { }
