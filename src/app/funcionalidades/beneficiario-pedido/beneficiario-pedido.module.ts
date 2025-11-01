import {NgModule} from '@angular/core';
import { BeneficiarioPedidoHomeComponent } from './beneficiario-pedido-home/beneficiario-pedido-home.component';
import { BeneficiarioPedidoRoutingModule } from './beneficiario-pedido.routing.module';
import { BeneficiarioPedidoListarComponent } from './beneficiario-pedido-listar/beneficiario-pedido-listar.component';
import { BeneficiarioPedidoFormComponent } from './beneficiario-pedido-form/beneficiario-pedido-form.component';
import { BaseModule } from 'app/shared/base.module';

@NgModule({
    imports: [
        BaseModule,
        BeneficiarioPedidoRoutingModule
    ],
    declarations: [
        BeneficiarioPedidoHomeComponent,
        BeneficiarioPedidoListarComponent,
        BeneficiarioPedidoFormComponent
    ]
})
export class BeneficiarioPedidoModule { }
