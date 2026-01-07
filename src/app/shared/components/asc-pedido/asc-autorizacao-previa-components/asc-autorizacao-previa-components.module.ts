import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscProcedimentoAutorizacaoPreviaFormComponent } from "./procedimento-form/asc-procedimento-autorizacao-previa-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AscSelectModule } from "../../asc-select/asc-select.module";
import { ComponentModule } from "../../component.module";
import { InputTextModule } from "primeng/inputtext";
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AscSelectModule,
    ComponentModule,
    InputTextModule,
    DscCaixaModule
  ],
  declarations: [AscProcedimentoAutorizacaoPreviaFormComponent],
  exports: [AscProcedimentoAutorizacaoPreviaFormComponent]
})
export class AscAutorizacaoPreviaComponentsModule {
}
