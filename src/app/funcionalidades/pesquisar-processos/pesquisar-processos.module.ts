import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "../../arquitetura/shared/templates/templates.module";
import {DirectivesModule} from "../../arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {PesquisarProcessosRoutingModule} from "./pesquisar-processos.routing.module";
import {NgxPaginationModule} from "ngx-pagination";
import {TableModule,} from "primeng/table";
import {SharedModule} from "primeng/api";
import {TabViewModule} from "primeng/tabview";
import {CheckboxModule} from "primeng/checkbox";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressBarModule} from "primeng/progressbar";
import {PaginatorModule} from "primeng/paginator";

import {PesquisarProcessosListarComponent} from "./pesquisar-processos-listar/pesquisar-processos-listar.component";
import {PesquisarProcessosHomeComponent} from "./pesquisar-processos-home/pesquisar-processos-home.component";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {ComponentModule} from "../../shared/components/component.module";
import {DscCaixaModule} from "../../shared/dsc-caixa/dsc-caixa.module";

@NgModule({
	imports: [
		CommonModule,
		PesquisarProcessosRoutingModule,
		DirectivesModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		TabsModule.forRoot(),
		TabViewModule,
		CheckboxModule,
		FileUploadModule,
		ProgressBarModule,
		NgxPaginationModule,
		TemplatesModule,
		NgxMaskDirective, 
		NgxMaskPipe,
		TableModule,
		PaginatorModule,
		SharedModule,
		PipeModule,
		ComponentModule,
		DscCaixaModule
	],
	declarations: [
		PesquisarProcessosListarComponent,
		PesquisarProcessosHomeComponent
	]
})
export class PesquisarProcessosModule { }
