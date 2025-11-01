import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscFormularioReembolsoConsultaComponent} from "./asc-formulario-reembolso-consulta/asc-formulario-reembolso-consulta.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AscSelectModule} from "../../asc-select/asc-select.module";
import {ComponentModule} from "../../component.module";
import {AscButtonsModule} from "../../asc-buttons/asc-buttons.module";
import {AscReembolsoAssistencialComponent} from "./asc-reembolso-assistencial/asc-reembolso-assistencial.component";
import {AscFormularioReembolsoMedicamentoComponent} from "./asc-formulario-reembolso-medicamento/asc-formulario-reembolso-medicamento.component";
import {AscFormularioReembolsoVacinaComponent} from "./asc-formulario-reembolso-vacina/asc-formulario-reembolso-vacina.component";
import {AscFormularioReembolsoOdontologicoComponent} from "./asc-formulario-reembolso-odontologico/asc-formulario-reembolso-odontologico.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AscSelectModule,
    ComponentModule,
    AscButtonsModule,
    ProgressSpinnerModule
  ],
  declarations: [
    AscFormularioReembolsoConsultaComponent,
    AscReembolsoAssistencialComponent,
    AscFormularioReembolsoMedicamentoComponent,
    AscFormularioReembolsoOdontologicoComponent,
    AscFormularioReembolsoVacinaComponent
  ],
  exports: [
    AscFormularioReembolsoConsultaComponent,
    AscReembolsoAssistencialComponent,
    AscFormularioReembolsoMedicamentoComponent,
    AscFormularioReembolsoOdontologicoComponent,
    AscFormularioReembolsoVacinaComponent
  ],
})
export class AscTipoProcedimentoFormModule {
}
