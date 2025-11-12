import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "../../../../app/arquitetura/shared/templates/templates.module";
import {ComposicaoPedidoModule} from "../../../../app/shared/components/pedido/composicao-pedido.module";
import {DirectivesModule} from "../../../../app/arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import {ComponentModule} from "../../../../app/shared/components/component.module";
import { NgxMaskModule } from 'ngx-mask';
import {NgxPaginationModule} from "ngx-pagination";
import {TableModule} from "primeng/table";
import {SharedModule} from "primeng/api";
import {DialogModule} from "primeng/dialog";
import {TabViewModule} from "primeng/tabview";
import {DropdownModule} from "primeng/dropdown";
import {CheckboxModule} from "primeng/checkbox";
import {InputMaskModule} from "primeng/inputmask";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressBarModule} from "primeng/progressbar";
import {PaginatorModule} from "primeng/paginator";
import {MultiSelectModule} from "primeng/multiselect";

import {AscMessageErrorModule} from "../../../../app/shared/components/message-error/asc-message-error.module";
import {PlaygroundModule} from "../../../../app/shared/playground/playground.module";
import {AscMultiSelectModule} from "../../../shared/components/multiselect/asc-multiselect.module";
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import { LiberacaoAlcadaListarComponent } from "./liberacao-alcada-listar/liberacao-alcada-listar.component";
import { LiberacaoAlcadaRoutingModule } from "./liberacao-alcada.routing.module";
import { PipeModule } from "app/shared/pipes/pipe.module";

@NgModule({
    imports: [
        CommonModule,
        LiberacaoAlcadaRoutingModule,
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
        NgxMaskModule,
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
        AscButtonsModule
    ],
    declarations: [
        LiberacaoAlcadaListarComponent
    ]
})
export class LiberacaoAlcadaModule {
}
