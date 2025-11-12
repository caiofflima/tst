import {VincMedPatologiaRoutingModule} from './vinc-med-patologia.routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TemplatesModule} from 'app/arquitetura/shared/templates/templates.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxMaskModule } from 'ngx-mask';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import {AscMessageErrorModule} from 'app/shared/components/message-error/asc-message-error.module';
import {PipeModule} from 'app/shared/pipes/pipe.module';
import {PrimeNGModule} from 'app/shared/primeng.module';
import {ComponentModule} from 'app/shared/components/component.module';
import {VincMedPatologiaHomeComponent} from './vinc-med-patologia-home/vinc-med-patologia-home.component';
import {VincMedPatologiaListarComponent} from './vinc-med-patologia-listar/vinc-med-patologia-listar.component';
import {VincMedPatologiaFormComponent} from './vinc-med-patologia-form/vinc-med-patologia-form.component';
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";

@NgModule({
  imports: [
    CommonModule,
    VincMedPatologiaRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TemplatesModule,
    NgxPaginationModule,
    NgxMaskModule,
    TableModule,
    AscMessageErrorModule,
    FieldsetModule,
    DropdownModule,
    PipeModule,
    PrimeNGModule,
    ComponentModule,
    AscSelectModule,
    InputTextareaModule,
    InputTextModule
  ],
  declarations: [
    VincMedPatologiaHomeComponent,
    VincMedPatologiaListarComponent,
    VincMedPatologiaFormComponent
  ]
})
export class VincMedPatologiaModule {
}
