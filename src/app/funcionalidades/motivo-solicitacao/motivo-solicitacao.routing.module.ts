
import { RouterModule, Routes } from "@angular/router";
import { MotivoSolicitacaoComponent } from "./motivo-solicitacao-home/motivo-solicitacao-home.component";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { NgModule } from "@angular/core";
import { MotivoSolicitacaoListarComponent } from "./motivo-solicitacao-listar/motivo-solicitacao-listar.component";
import { MotivoSolicitacaoFormComponent } from "./motivo-solicitacao-form/motivo-solicitacao-form.component";


const ROUTES: Routes = [
    {
        path: '',
        component: MotivoSolicitacaoComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'listar',
        component: MotivoSolicitacaoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]   
    },
    {
        path: 'novo',
        component: MotivoSolicitacaoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]   
    },
    {
        path: 'editar/:id',
        component: MotivoSolicitacaoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
]

@NgModule({
    imports: [RouterModule.forChild( ROUTES )],
    exports: [RouterModule]
})
export class MotivoSolicitacaoRoutingModule {}