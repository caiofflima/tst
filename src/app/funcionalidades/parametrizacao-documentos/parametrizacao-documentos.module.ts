import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParametrizacaoDocumentosHomeComponent} from "./parametrizacao-documentos-home/parametrizacao-documentos-home.component";
import {ParametrizacaoDocumentosFromComponent} from "./parametrizacao-documentos-from/parametrizacao-documentos-from.component";
import {ParametrizacaoDocumentosListarComponent} from "./parametrizacao-documentos-listar/parametrizacao-documentos-listar.component";
import { ParametrizacaoDocumentosRoutingModule } from './parametrizacao-documentos-routing.module';
import {PrimeNGModule} from "../../shared/primeng.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentModule} from "../../shared/components/component.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";

@NgModule({
    imports: [
        CommonModule,
        ParametrizacaoDocumentosRoutingModule,
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
      ParametrizacaoDocumentosHomeComponent,
      ParametrizacaoDocumentosFromComponent,
      ParametrizacaoDocumentosListarComponent
  ]
})
export class ParametrizacaoDocumentosModule { }
