import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrimeNGModule} from "../../shared/primeng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentModule} from "../../shared/components/component.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";
import { ParametrizacaoMedicamentosHomeComponent } from './parametrizacao-medicamentos-home/parametrizacao-medicamentos-home.component';
import { ParametrizacaoMedicamentosFormComponent } from './parametrizacao-medicamentos-form/parametrizacao-medicamentos-form.component';
import { ParametrizacaoMedicamentosListarComponent } from './parametrizacao-medicamentos-listar/parametrizacao-medicamentos-listar.component';
import { ParametrizacaoMedicamentosRoutingModule } from './parametrizacao-medicamentos-routing.module';
import { AscMultiSelectModule } from "app/shared/components/multiselect/asc-multiselect.module";
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
    imports: [
        CommonModule,
        ParametrizacaoMedicamentosRoutingModule,
        PrimeNGModule,
        FormsModule,
        ComponentModule,
        AscSelectModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
        AscMessageErrorModule,
        AscMultiSelectModule,
        MatGridListModule
    ],
  declarations: [
      ParametrizacaoMedicamentosHomeComponent,
      ParametrizacaoMedicamentosFormComponent,
      ParametrizacaoMedicamentosListarComponent
  ]
})
export class ParametrizacaoMedicamentosModule { }
