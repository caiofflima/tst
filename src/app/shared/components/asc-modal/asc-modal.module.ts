import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscModalComponent} from "./asc-modal/asc-modal.component";
import {DialogModule} from "primeng/dialog";
import {AscModalNavegacaoComponent} from "./asc-modal-navegacao/asc-modal-navegacao.component";
import {AscModalDadosTitularComponent} from "./asc-modal-dados-titular/asc-modal-dados-titular.component";


@NgModule({
  imports: [
    CommonModule,
    DialogModule
  ],
  exports: [
    AscModalComponent,
    AscModalNavegacaoComponent,
    AscModalDadosTitularComponent
  ],
  declarations: [
    AscModalComponent,
    AscModalNavegacaoComponent,
    AscModalDadosTitularComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AscModalModule {
}
