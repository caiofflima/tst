import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "../../arquitetura/shared/templates/templates.module";
import {DirectivesModule} from "../../arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import {TextMaskModule} from "angular2-text-mask";
import {PesquisarProcessosRoutingModule} from "./pesquisar-processos.routing.module";
import {NgxPaginationModule} from "ngx-pagination";
import {TableModule,} from "primeng/table";
import {SharedModule} from "primeng/api";
import {TabViewModule} from "primeng/tabview";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {InputMaskModule} from "primeng/inputmask";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressBarModule} from "primeng/progressbar";
import {MultiSelectModule} from "primeng/multiselect";
import {PaginatorModule} from "primeng/paginator";

import {PesquisarProcessosListarComponent} from "./pesquisar-processos-listar/pesquisar-processos-listar.component";
import {PesquisarProcessosHomeComponent} from "./pesquisar-processos-home/pesquisar-processos-home.component";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {PipeModule} from "../../shared/pipes/pipe.module";

@NgModule({
	imports: [
		CommonModule,
		PesquisarProcessosRoutingModule,
		DirectivesModule.forRoot(),
		FormsModule,
		DropdownModule,
		TabViewModule,
		CheckboxModule,
		InputMaskModule,
		FileUploadModule,
		ProgressBarModule,
		NgxPaginationModule,
		MultiSelectModule,
		ReactiveFormsModule,
		RouterModule,
		TabsModule.forRoot(),
		TemplatesModule,
		TextMaskModule,
		TableModule,
		PaginatorModule,
		SharedModule,
		PipeModule,
    AscMultiSelectModule
	],
	declarations: [
		PesquisarProcessosListarComponent,
		PesquisarProcessosHomeComponent
	]
})
export class PesquisarProcessosModule { }
