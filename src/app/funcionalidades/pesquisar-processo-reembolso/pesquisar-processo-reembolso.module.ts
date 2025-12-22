import { PrimeNGModule } from './../../shared/primeng.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
// Aplicação
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';

import { AscMessageErrorModule } from 'app/shared/components/message-error/asc-message-error.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { NgxPaginationModule } from 'ngx-pagination';
import {TableModule,} from 'primeng/table';
import {DropdownModule,} from 'primeng/dropdown';
import {FieldsetModule,} from 'primeng/fieldset';
import {InputTextModule,} from 'primeng/inputtext';
import { PesquisarProcessoReembolsoHomeComponent } from './pesquisar-processo-reembolso-home/pesquisar-processo-reembolso-home.component';
import { PesquisarProcessoReembolsoRoutingModule } from './pesquisar-processo-reembolso.routing.module';
import { PesquisarProcessoReembolsoListarComponent } from './pesquisar-processo-reembolso-listar/pesquisar-processo-reembolso-listar.component';
import { PesquisarProcessoReembolsoFormComponent } from './pesquisar-processo-reembolso-form/pesquisar-processo-reembolso-form.component';
import { ComponentModule } from 'app/shared/components/component.module';
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";

import { EmpresaPrestadorExternoRoutingModule } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo.routing.module';
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';

//import { RadioButton } from 'primeng/primeng';


/**
 * Modulo Empresa Prestadora
 **/
@NgModule({
    imports: [
        CommonModule,
        PesquisarProcessoReembolsoRoutingModule,
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
        AscMultiSelectModule,
        DscCaixaModule
    ],
	declarations: [
		PesquisarProcessoReembolsoHomeComponent,
		PesquisarProcessoReembolsoListarComponent,
		PesquisarProcessoReembolsoFormComponent
	//	EmpresaPrestadorExternoFormComponent,
	//	EmpresaPrestadorExternoListarComponent
	]
})

export class PesquisarProcessoReembolsoModule { }
