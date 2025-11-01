import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { DirectivesModule } from 'app/arquitetura/shared/directives/directives.module';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { TextMaskModule } from 'angular2-text-mask';

import { NgxPaginationModule } from 'ngx-pagination';
import { TabViewModule} from 'primeng/tabview';
import { DropdownModule} from 'primeng/dropdown';
import { CheckboxModule} from 'primeng/checkbox';
import { InputMaskModule} from 'primeng/inputmask';
import { FileUploadModule} from 'primeng/fileupload';
import { ProgressBarModule} from 'primeng/progressbar';
import { ListaMensagensComponent } from '../lista-mensagens/lista-mensagens.component';
import { DetalharMensagensComponent } from '../detalhar-mensagens/detalhar-mensagens.component';
import { ListaMensagensRoutingModule } from './lista-mensagens.routing.module';

@NgModule({
	imports: [
		CommonModule,
		ListaMensagensRoutingModule,
		DirectivesModule.forRoot(),
		FormsModule,
		DropdownModule,
		TabViewModule,
		CheckboxModule,
		InputMaskModule,
		FileUploadModule,
		ProgressBarModule,
		NgxPaginationModule,
		ReactiveFormsModule,
		RouterModule,
		TabsModule.forRoot(),
		TemplatesModule,
		TextMaskModule,
	],
	declarations: [
		ListaMensagensComponent,
		DetalharMensagensComponent
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class ListaMensagensModule { }