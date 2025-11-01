import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import { BeneficiarioPedidoHomeComponent } from './beneficiario-pedido-home/beneficiario-pedido-home.component';
import { BeneficiarioPedidoListarComponent } from './beneficiario-pedido-listar/beneficiario-pedido-listar.component';
import { BeneficiarioPedidoFormComponent } from './beneficiario-pedido-form/beneficiario-pedido-form.component';

const beneficiarioPedidoRoute: Routes = [
    {
        path: '',
        component: BeneficiarioPedidoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: BeneficiarioPedidoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: BeneficiarioPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id',
        component: BeneficiarioPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(beneficiarioPedidoRoute)],
    exports: [RouterModule],
})

export class BeneficiarioPedidoRoutingModule {
}
