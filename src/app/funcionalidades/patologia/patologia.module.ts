import { PrimeNGModule } from './../../shared/primeng.module';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
// Aplicação
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';

import { EmpresaPrestadorExternoRoutingModule } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo.routing.module';
import { AscMessageErrorModule } from 'app/shared/components/message-error/asc-message-error.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/fieldset';
import {InputTextModule} from 'primeng/inputtext';
import { PatologiaHomeComponent } from './patologia-home/patologia-home.component';
import { PatologiaRoutingModule } from './patologia.routing.module';
import { PatologiaListarComponent } from './patologia-listar/patologia-listar.component';
import { PatologiaFormComponent } from './patologia-form/patologia-form.component';
import { ComponentModule } from 'app/shared/components/component.module';
//import { RadioButton } from 'primeng/primeng';
import { DscCaixaModule } from '../../shared/dsc-caixa/dsc-caixa.module'; 

/**
 * Modulo Empresa Prestadora
 **/
@NgModule({
    imports: [
        CommonModule,
        PatologiaRoutingModule,
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
        PrimeNGModule,
        ComponentModule,
        InputTextModule,
        DscCaixaModule
    ],
	declarations: [
		PatologiaHomeComponent,
		PatologiaListarComponent,
		PatologiaFormComponent
	//	EmpresaPrestadorExternoFormComponent,
	//	EmpresaPrestadorExternoListarComponent
	]
})

export class PatologiaoModule { }
