import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcsTableProcedimentoReembolsoAssistencialComponent } from "./acs-table-procedimento-reembolso-assistencial/acs-table-procedimento-reembolso-assistencial.component";
import { AscTableProcedimentoReembolsoConsutlaComponent } from "./asc-table-procedimento-reembolso-consutla/asc-table-procedimento-reembolso-consutla.component";
import { AscTableProcedimentoReembolsoMedicamentoComponent } from "./asc-table-procedimento-reembolso-medicamento/asc-table-procedimento-reembolso-medicamento.component";
import { AscTableProcedimentoReembolsoOdontologicoComponent } from "./asc-table-procedimento-reembolso-odontologico/asc-table-procedimento-reembolso-odontologico.component";
import { AscTableProcedimentosComponent } from "./asc-table-procedimentos/asc-table-procedimentos.component";
import { PipeModule } from "../../../../pipes/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    PipeModule
  ],
  declarations: [
    AcsTableProcedimentoReembolsoAssistencialComponent,
    AscTableProcedimentoReembolsoConsutlaComponent,
    AscTableProcedimentoReembolsoMedicamentoComponent,
    AscTableProcedimentoReembolsoOdontologicoComponent,
    AscTableProcedimentosComponent
  ],
  exports: [
    AscTableProcedimentosComponent
  ]
})
export class AscTableProcedimentosModule {
}
