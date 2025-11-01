import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Aplicação
import { DirectivesModule } from '../../../app/arquitetura/shared/directives/directives.module';
import { TemplatesModule } from '../../../app/arquitetura/shared/templates/templates.module';
import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import {PesquisarProcessosCredenciadoModule} from "../../funcionalidades/pesquisar-processos-credenciado/pesquisar-processos-credenciado.module";

/**
 * Modulo Acesso
 **/
@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		DirectivesModule.forRoot(),
		TemplatesModule,
		HomeRoutingModule,
    	PesquisarProcessosCredenciadoModule
	],
	declarations: [
		HomeComponent
	]
})
export class HomeModule { }
