import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "app/arquitetura/shared/templates/templates.module";
import {ComposicaoPedidoModule} from "app/shared/components/pedido/composicao-pedido.module";
import {DirectivesModule} from "app/arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import {ComponentModule} from "app/shared/components/component.module";
import {TextMaskModule} from "angular2-text-mask";
import {NgxPaginationModule} from "ngx-pagination";
import {
    DataTableModule,
    SharedModule,
    DialogModule,
    TabViewModule,
    DropdownModule,
    CheckboxModule,
    InputMaskModule,
    FileUploadModule,
    ProgressBarModule,
    PaginatorModule,
    MultiSelectModule,
    ProgressSpinnerModule,
} from "primeng/primeng";
import {PipeModule} from "app/shared/pipes/pipe.module";
import {AscMessageErrorModule} from "app/shared/components/message-error/asc-message-error.module";
import {PlaygroundModule} from "app/shared/playground/playground.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";
import { DadosCadastraisDetailComponent } from "./detail/dados-cadastrais-detail.component";
import { DadosCadastraisRoutingModule } from "./dados-cadastrais.routing.module";
import { AscFileModule } from "app/shared/components/asc-file/asc-file.module";
import { InformacoesPedidoDetailComponent } from "./informacoes-pedido-detail/informacoes-pedido-detail.component";
import { DependenteDetailComponent } from "./dependente-detail/dependente-detail.component";
import { AscDocumentosModule } from "app/shared/components/asc-pedido/asc-documentos/asc-documentos.module";

@NgModule({
    imports: [
        CommonModule,
        DadosCadastraisRoutingModule,
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
        TextMaskModule,
        DataTableModule,
        SharedModule,
        PipeModule,
        DialogModule,
        AscMessageErrorModule,
        ComponentModule,
        PlaygroundModule,
        PaginatorModule,
        MultiSelectModule,
        AscMultiSelectModule,
        AscDocumentosModule,
        AscButtonsModule,
        AscFileModule,
        ProgressSpinnerModule,
    ],
    declarations: [
        DadosCadastraisDetailComponent,
        InformacoesPedidoDetailComponent,
        DependenteDetailComponent
    ] 
 
})
export class DadosCadastraisModule {
}
