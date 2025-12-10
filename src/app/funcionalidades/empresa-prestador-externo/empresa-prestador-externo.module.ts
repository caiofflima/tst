import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
// Aplicação
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { EmpresaPrestadorExternoFormComponent } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-form/empresa-prestador-externo-form.component';
import { EmpresaPrestadorExternoHomeComponent } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-home/empresa-prestador-externo-home.component';
import { EmpresaPrestadorExternoRoutingModule } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo.routing.module';
import { AscMessageErrorModule } from 'app/shared/components/message-error/asc-message-error.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { EmpresaPrestadorExternoListarComponent } from './empresa-prestador-externo-listar/empresa-prestador-externo-listar.component';
import {ComponentModule} from "../../shared/components/component.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";

/**
 * Modulo Empresa Prestadora
 **/
@NgModule({
    imports: [
        CommonModule,
        EmpresaPrestadorExternoRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TemplatesModule,
        NgxPaginationModule,
        NgxMaskDirective, NgxMaskPipe,
        TableModule,
        AscMessageErrorModule,
        FieldsetModule,
        DropdownModule,
        PipeModule,
        ComponentModule,
        AscMultiSelectModule
    ],
	declarations: [
		EmpresaPrestadorExternoHomeComponent,
		EmpresaPrestadorExternoFormComponent,
		EmpresaPrestadorExternoListarComponent
	]
    ,
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class EmpresaPrestadorExternoModule { }
