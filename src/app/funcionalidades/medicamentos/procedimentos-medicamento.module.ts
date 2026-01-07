import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AscSelectModule } from "app/shared/components/asc-select/asc-select.module";
import { ComponentModule } from "app/shared/components/component.module";
import { AscMessageErrorModule } from "app/shared/components/message-error/asc-message-error.module";
import { DscCaixaModule } from "app/shared/dsc-caixa/dsc-caixa.module";
import { PipeModule } from "app/shared/pipes/pipe.module";
import { PrimeNGModule } from "app/shared/primeng.module";
import { TableModule } from 'primeng/table';
import { AscMultiSelectModule } from "../../shared/components/multiselect/asc-multiselect.module";
import { ListarProcedimentosComMedicamentoComponent } from "./listar-procedimentos-com-medicamento.component";
import { ProcedimentosMedicamentoRoutingModule } from "./procedimentos-medicamento.routing.module";


@NgModule({
    imports: [
        CommonModule,
        ProcedimentosMedicamentoRoutingModule,
        CommonModule,
        ComponentModule,
        PrimeNGModule,
        AscSelectModule,
        ReactiveFormsModule,
        AscMessageErrorModule,
        FormsModule,
        PipeModule,
        AscMultiSelectModule,
        TableModule,
        DscCaixaModule,
    ],
    declarations: [
        ListarProcedimentosComMedicamentoComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]

})
export class ProcedimentosMedicamentoModule {
}
