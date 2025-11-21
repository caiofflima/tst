import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { AscMessageErrorModule } from 'app/shared/components/message-error/asc-message-error.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedModule } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { PerfilUsuarioExternoRoutingModule } from './perfil-usuario-externo.routing.module';
import { PerfilUsuarioExternoHomeComponent } from './perfil-usuario-externo-home/perfil-usuario-externo-home.component';
import { PerfilUsuarioExternoFormComponent } from './perfil-usuario-externo-form/perfil-usuario-externo-form.component';
import { PerfilUsuarioExternoBuscarComponent } from './perfil-usuario-externo-buscar/perfil-usuario-externo-buscar.component';
import { PipeModule } from 'app/shared/pipes/pipe.module';

@NgModule({
  imports: [
		CommonModule,
		PerfilUsuarioExternoRoutingModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
    TemplatesModule,
		NgxPaginationModule,
		NgxMaskDirective, NgxMaskPipe,
		TableModule,
		SharedModule,
		AscMessageErrorModule,
		FieldsetModule,
    DropdownModule,
		CalendarModule,
    PipeModule,
    CheckboxModule
	],
	declarations: [
		PerfilUsuarioExternoHomeComponent,
		PerfilUsuarioExternoFormComponent,
		PerfilUsuarioExternoBuscarComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class PerfilUsuarioExternoModule {

 }
