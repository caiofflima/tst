import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ValidationMessageComponent} from './validation-message.component';

/**
 * Responsável por prover recursos de validação de
 * campos nos formulários da aplicação
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ValidationMessageComponent],
  exports: [ValidationMessageComponent]
})
export class ValidationModule {
}
