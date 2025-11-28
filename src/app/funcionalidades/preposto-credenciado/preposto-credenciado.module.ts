import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { DirectivesModule } from 'app/arquitetura/shared/directives/directives.module';

import { EmpresaCredenciadaHomeComponent } from 'app/funcionalidades/preposto-credenciado/preposto-credenciado-home/empresa-credenciada-home.component';
import { EmpresaCredenciadaFormComponent } from 'app/funcionalidades/preposto-credenciado/preposto-credenciado-form/empresa-credenciada-form.component';
import { EmpresaCredenciadaListarComponent } from 'app/funcionalidades/preposto-credenciado/preposto-credenciado-listar/empresa-credenciada-listar.component';
import { EmpresaCredenciadaRoutingModule } from './preposto-credenciado.routing.module';
import { ComposicaoPedidoModule } from 'app/shared/components/pedido/composicao-pedido.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PrimeNGModule } from 'app/shared/primeng.module';
import { PipeModule } from 'app/shared/pipes/pipe.module';
import { AscSelectModule } from 'app/shared/components/asc-select/asc-select.module';

@NgModule( {
    imports: [
        CommonModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TemplatesModule,
        EmpresaCredenciadaRoutingModule,
        ComposicaoPedidoModule,
		NgxMaskDirective, NgxMaskPipe,
		PrimeNGModule,
		PipeModule,
		AscSelectModule
    ],
    declarations: [
        EmpresaCredenciadaHomeComponent,
        EmpresaCredenciadaFormComponent,
        EmpresaCredenciadaListarComponent
    ]
} )
export class EmpresaCredenciadaModule { }
