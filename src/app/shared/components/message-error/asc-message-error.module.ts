import { MultiSelectModule } from 'primeng/multiselect';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscMessageError } from './asc-message-error.component';


@NgModule({
  declarations: [AscMessageError],
  exports: [AscMessageError],
  imports: [CommonModule, MultiSelectModule, FormsModule]
})
export class AscMessageErrorModule { }
