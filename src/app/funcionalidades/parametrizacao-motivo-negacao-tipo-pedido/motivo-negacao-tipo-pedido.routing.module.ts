import { RouterModule, Routes } from "@angular/router";
import { MotivoNegacaoTipoPedidoHomeComponent } from "./motivo-negacao-tipo-pedido-home/motivo-negacao-tipo-pedido-home.component";
import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { NgModule } from "@angular/core";
import { MotivoNegacaoTipoPedidoListarComponent } from "./motivo-negacao-tipo-pedido-listar/motivo-negacao-tipo-pedido-listar.component";
import { MotivoNegacaoTipoPedidoFormComponent } from "./motivo-negacao-tipo-pedido-form/motivo-negacao-tipo-pedido-form.component";

const parametrizacaoDocumentoProcessoRoute: Routes = [
    {
        path: '',
        component: MotivoNegacaoTipoPedidoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'listar',
        component: MotivoNegacaoTipoPedidoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: MotivoNegacaoTipoPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:atualizar/:idMotivoNegacao/:idTipoProcesso/:listaBeneficiarios',
        component: MotivoNegacaoTipoPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:atualizar',
        component: MotivoNegacaoTipoPedidoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(parametrizacaoDocumentoProcessoRoute)],
    exports: [RouterModule],
})

export class MotivoNegacaoTipoPedidoRoutingModule {
}