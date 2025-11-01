import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParametrizacaoDocumentoProcessoHomeComponent} from "./parametrizacao-documento-processo-home/parametrizacao-documento-processo-home.component";
import {ParametrizacaoDocumentoProcessoListarComponent} from "./parametrizacao-documento-processo-listar/parametrizacao-documento-processo-listar.component";
import {ParametrizacaoDocumentoProcessoFormComponent} from "./parametrizacao-documento-processo-form/parametrizacao-documento-processo-form.component";
import {ParametrizacaoDocumentoProcessoRoutingModule} from "./parametrizacao-documento-processo.routing.module";
import {ComponentModule} from "../../shared/components/component.module";
import {PrimeNGModule} from "../../shared/primeng.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";

@NgModule({
    imports: [
        CommonModule,
        ParametrizacaoDocumentoProcessoRoutingModule,
        ComponentModule,
        PrimeNGModule,
        AscSelectModule,
        ReactiveFormsModule,
        AscMessageErrorModule,
        FormsModule,
        PipeModule,
        AscMultiSelectModule
    ],
  declarations: [
    ParametrizacaoDocumentoProcessoHomeComponent,
    ParametrizacaoDocumentoProcessoListarComponent,
    ParametrizacaoDocumentoProcessoFormComponent
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ParametrizacaoDocumentoProcessoModule { }
