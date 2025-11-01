import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {
    ParametrizacaoMotivoTipoPedidoHomeComponent
} from "./parametrizacao-motivo-tipo-pedido-home/parametrizacao-motivo-tipo-pedido-home.component";
import {
    ParametrizacaoMotivoTipoPedidoListarComponent
} from "./parametrizacao-motivo-tipo-pedido-listar/parametrizacao-motivo-tipo-pedido-listar.component";
import {
    ParametrizacaoMotivoTipoPedidoFormComponent
} from "./parametrizacao-motivo-tipo-pedido-form/parametrizacao-motivo-tipo-pedido-form.component";


const ParametrizacaoMotivoTipoPedidoRoute: Routes = [
    {
        path: '',
        component: ParametrizacaoMotivoTipoPedidoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: ParametrizacaoMotivoTipoPedidoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: ParametrizacaoMotivoTipoPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id',
        component: ParametrizacaoMotivoTipoPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(ParametrizacaoMotivoTipoPedidoRoute)],
    exports: [RouterModule],
})

export class ParametrizacaoMotivoTipoPedidoRoutingModule {
}
