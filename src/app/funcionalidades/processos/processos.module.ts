import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "../../../app/arquitetura/shared/templates/templates.module";
import {ComposicaoPedidoModule} from "../../../app/shared/components/pedido/composicao-pedido.module";
import {DirectivesModule} from "../../../app/arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import {ComponentModule} from "../../../app/shared/components/component.module";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
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
import {PipeModule} from "../../../app/shared/pipes/pipe.module";
import {MeusProcessosRoutingModule} from "./processos.routing.module";
import {ProcessosComponent} from "./processos.component";
import {DetalharReembolsoComponent} from "./detalhar-reembolso/detalhar-reembolso.component";
import {AscMessageErrorModule} from "../../../app/shared/components/message-error/asc-message-error.module";
import {ListaProcessosComponent} from "./lista-processos/lista-processos.component";
import {PlaygroundModule} from "../../../app/shared/playground/playground.module";
import {PesquisarProcessoComponent} from "./pesquisar/pesquisar-processo.component";
import {ListaProcessosAnalistaComponent} from "./lista-processos-analista/lista-processos-analista.component";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";
import {DscCaixaModule} from "../../shared/dsc-caixa/dsc-caixa.module";
import {
    DetalharAutorizacaoPreviaComponent
} from "./autorizacao-previa/detalhar-processo/detalhar-autorizacao-previa.component";
import {
    ValidarProcedimentosComponent
} from "./autorizacao-previa/validar-procedimentos/validar-procedimentos.component";

@NgModule({
    imports: [
        CommonModule,
        MeusProcessosRoutingModule,
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
        // TabsModule.forRoot(),
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
        DscCaixaModule
    ],
    declarations: [
        ListaProcessosComponent,
        ProcessosComponent,
        DetalharReembolsoComponent,
        PesquisarProcessoComponent,
        ListaProcessosAnalistaComponent,
        DetalharAutorizacaoPreviaComponent,
        ValidarProcedimentosComponent
    ]
})
export class ProcessosModule {
}
