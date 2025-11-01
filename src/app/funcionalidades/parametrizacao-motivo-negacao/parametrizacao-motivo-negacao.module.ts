import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrimeNGModule} from "../../shared/primeng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentModule} from "../../shared/components/component.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {InputTextareaModule, } from "primeng/inputtextarea";
import { InputTextModule} from "primeng/inputtext";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";
import { ParametrizacaoMotivoNegacaoHomeComponent } from './parametrizacao-motivo-negacao-home/parametrizacao-motivo-negacao-home.component';
import { ParametrizacaoMotivoNegacaoFormComponent } from './parametrizacao-motivo-negacao-form/parametrizacao-motivo-negacao-form.component';
import { ParametrizacaoMotivoNegacaoListarComponent } from './parametrizacao-motivo-negacao-listar/parametrizacao-motivo-negacao-listar.component';
import { ParametrizacaoMotivoNegacaoRoutingModule } from './parametrizacao-motivo-negacao-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ParametrizacaoMotivoNegacaoRoutingModule,
        PrimeNGModule,
        FormsModule,
        ComponentModule,
        AscSelectModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
        AscMessageErrorModule
    ],
  declarations: [
      ParametrizacaoMotivoNegacaoHomeComponent,
      ParametrizacaoMotivoNegacaoFormComponent,
      ParametrizacaoMotivoNegacaoListarComponent
  ]
})
export class ParametrizacaoMotivoNegacaoModule { }
