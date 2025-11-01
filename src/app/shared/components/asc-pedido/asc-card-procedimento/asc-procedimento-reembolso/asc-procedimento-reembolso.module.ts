import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscCardProcedimentoReembolsoConsultaComponent } from "./asc-card-procedimento-reembolso-consulta/asc-card-procedimento-reembolso-consulta.component";
import { AscCardProcedimentoReembolsoAssistencialComponent } from "./asc-card-procedimento-reembolso-assistencial/asc-card-procedimento-reembolso-assistencial.component";
import { AscCardProcedimentoReembolsoMedicamentoComponent } from "./asc-card-procedimento-reembolso-medicamento/asc-card-procedimento-reembolso-medicamento.component";
import { AscCardProcedimentoReembolsoVacinaComponent } from "./asc-card-procedimento-reembolso-vacina/asc-card-procedimento-reembolso-vacina.component";
import { AscCardProcedimentoReembolsoComponent } from "./asc-card-procedimento-reembolso/asc-card-procedimento-reembolso.component";
import { PipeModule } from "../../../../pipes/pipe.module";
import { AscTipoProcedimentoFormModule } from "../../asc-tipo-procedimento-form/asc-tipo-procedimento-form.module";
import { AscCardProcedimentoReembolsoOndontologicoComponent } from "./asc-card-procedimento-reembolso-ondontologico/asc-card-procedimento-reembolso-ondontologico.component";
import { ProgressBarModule  } from "primeng/progressbar";
import { ProgressSpinnerModule  } from "primeng/progressspinner";

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    AscTipoProcedimentoFormModule,
    ProgressBarModule,
    ProgressSpinnerModule
  ],
  declarations: [
    AscCardProcedimentoReembolsoConsultaComponent,
    AscCardProcedimentoReembolsoAssistencialComponent,
    AscCardProcedimentoReembolsoMedicamentoComponent,
    AscCardProcedimentoReembolsoVacinaComponent,
    AscCardProcedimentoReembolsoComponent,
    AscCardProcedimentoReembolsoOndontologicoComponent
  ],
  exports: [
    AscCardProcedimentoReembolsoConsultaComponent,
    AscCardProcedimentoReembolsoAssistencialComponent,
    AscCardProcedimentoReembolsoMedicamentoComponent,
    AscCardProcedimentoReembolsoVacinaComponent,
    AscCardProcedimentoReembolsoComponent,
    AscCardProcedimentoReembolsoOndontologicoComponent
  ]
})
export class AscProcedimentoReembolsoModule {
}
