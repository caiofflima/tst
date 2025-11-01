import {MultiSelectModule} from 'primeng/multiselect';
import {TooltipModule} from 'primeng/tooltip';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AscMultiSelectComponent} from './asc-multiselect.component';

@NgModule({
    declarations: [AscMultiSelectComponent],
    exports: [AscMultiSelectComponent],
    imports: [CommonModule, MultiSelectModule, FormsModule, ReactiveFormsModule, TooltipModule]
})
export class AscMultiSelectModule {

}
