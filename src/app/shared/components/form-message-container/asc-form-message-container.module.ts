import { MultiSelectModule } from 'primeng/multiselect';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AscFormMessageContainer } from './asc-form-message-container.component';

@NgModule({
  declarations: [AscFormMessageContainer],
  exports: [AscFormMessageContainer],
  imports: [CommonModule, MultiSelectModule, FormsModule]
})
export class AscFormMessageContainerModule { }
