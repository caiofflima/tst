import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TemplatesModule } from 'app/arquitetura/shared/templates/templates.module';
import { DirectivesModule } from 'app/arquitetura/shared/directives/directives.module';

import { NovoPedidoAutorizadorComponent } from './novo-pedido-credenciado.component';
import { NovoPedidoCredenciadoRoutingModule } from './novo-pedido-credenciado.routing.module';
import { ComposicaoPedidoModule } from 'app/shared/components/pedido/composicao-pedido.module';
import { PrimeNGModule } from 'app/shared/primeng.module';
import { ComponentModule } from 'app/shared/components/component.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@NgModule( {
    imports: [
        CommonModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TemplatesModule,
        NovoPedidoCredenciadoRoutingModule,
        ComposicaoPedidoModule,
        NgxMaskDirective, NgxMaskPipe,
        PrimeNGModule,
        ComponentModule
    ],
    declarations: [
        NovoPedidoAutorizadorComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
} )
export class NovoPedidoCredenciadoModule { }
