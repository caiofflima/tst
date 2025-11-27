import {TooltipModule} from 'primeng/tooltip';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Input, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AscMultiSelectComponent} from './asc-multiselect.component';
import {DscSelectComponent} from 'sidsc-components/dsc-select';

@NgModule({
    declarations: [AscMultiSelectComponent],
    exports: [AscMultiSelectComponent],
    imports: [CommonModule, DscSelectComponent, FormsModule, ReactiveFormsModule, TooltipModule]
})
export class AscMultiSelectModule {

}
