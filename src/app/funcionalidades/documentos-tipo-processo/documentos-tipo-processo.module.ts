import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "app/arquitetura/shared/templates/templates.module";
import {ComposicaoPedidoModule} from "app/shared/components/pedido/composicao-pedido.module";
import {DirectivesModule} from "app/arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import {ComponentModule} from "app/shared/components/component.module";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {NgxPaginationModule} from "ngx-pagination";
import { TableModule,} from "primeng/table";
import { SharedModule} from "primeng/api";
import { DialogModule} from "primeng/dialog";
import { TabViewModule} from "primeng/tabview";
import { DropdownModule} from "primeng/dropdown";
import { CheckboxModule} from "primeng/checkbox";
import { InputMaskModule} from "primeng/inputmask";
import { FileUploadModule} from "primeng/fileupload";
import { ProgressBarModule} from "primeng/progressbar";
import { PaginatorModule} from "primeng/paginator";
import { MultiSelectModule} from "primeng/multiselect";
import {PipeModule} from "app/shared/pipes/pipe.module";
import {AscMessageErrorModule} from "app/shared/components/message-error/asc-message-error.module";
import {PlaygroundModule} from "app/shared/playground/playground.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";
import { AscFileModule } from "app/shared/components/asc-file/asc-file.module";
import { DocumentosTipoProcessoRoutingModule } from "./documentos-tipo-processo.routing.module";
import { AscSelectModule } from "app/shared/components/asc-select/asc-select.module";
import { DocumentosTipoProcessoParamComponent } from "./param/documentos-tipo-processo-param.component";
import { DocumentosTipoProcessoResultComponent } from "./result/documentos-tipo-processo-result.component";

@NgModule({
    imports: [
        CommonModule,
        DocumentosTipoProcessoRoutingModule,
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
        ComposicaoPedidoModule,
        NgxMaskDirective, NgxMaskPipe,
        TableModule,
        SharedModule,
        PipeModule,
        DialogModule,
        AscMessageErrorModule,
        ComponentModule,
        PlaygroundModule,
        PaginatorModule,
        MultiSelectModule,
        AscMultiSelectModule,
        AscButtonsModule,
        AscFileModule,
        AscSelectModule
    ],
    declarations: [
        DocumentosTipoProcessoParamComponent,
        DocumentosTipoProcessoResultComponent
    ] ,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]

})
export class DocumentosTipoProcessoModule {
}
