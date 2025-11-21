import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
// Aplicação
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { PrestadorExternoHomeComponent } from 'app/funcionalidades/prestador-externo/prestador-externo-home/prestador-externo-home.component';
import { PrestadorExternoFormComponent } from 'app/funcionalidades/prestador-externo/prestador-externo-form/prestador-externo-form.component';
import { PrestadorExternoRoutingModule } from 'app/funcionalidades/prestador-externo/prestador-externo.routing.module';
import { AscMessageErrorModule } from 'app/shared/components/message-error/asc-message-error.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AutoCompleteModule} from 'primeng/autocomplete';
import { CalendarModule} from 'primeng/calendar';
import { CheckboxModule} from 'primeng/checkbox';
import { TableModule} from 'primeng/table';
import { DialogModule} from 'primeng/dialog';
import { DropdownModule} from 'primeng/dropdown';
import { FieldsetModule} from 'primeng/fieldset';
import { InputMaskModule} from 'primeng/inputmask';
import { MultiSelectModule} from 'primeng/multiselect';
import { OverlayPanelModule} from 'primeng/overlaypanel';
import { TabViewModule} from 'primeng/tabview';
import { PrestadorExternoListarComponent } from './prestador-externo-listar/prestador-externo-listar.component';
import {ComponentModule} from "../../shared/components/component.module";

/**
 * Modulo Acesso
 **/
@NgModule( {
    imports: [
        CommonModule,
        PrestadorExternoRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TemplatesModule,
        NgxPaginationModule,
        TableModule,
        TabViewModule,
        DropdownModule,
        CheckboxModule,
        InputMaskModule,
        MultiSelectModule,
        AutoCompleteModule,
        CalendarModule,
        OverlayPanelModule,
        DialogModule,
        NgxMaskDirective, NgxMaskPipe,
        AscMessageErrorModule,
        FieldsetModule,
        PipeModule,
        ComponentModule
    ],
    declarations: [
        PrestadorExternoHomeComponent,
        PrestadorExternoFormComponent,
        PrestadorExternoListarComponent
    ]
} )

export class PrestadorExternoModule { }
