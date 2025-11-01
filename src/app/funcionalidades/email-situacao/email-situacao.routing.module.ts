import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";

import {EmailSituacaoHomeComponent} from "./email-situacao-home/email-situacao-home.component";
import {EmailSituacaoListarComponent} from "./email-situacao-listar/email-situacao-listar.component";
import {EmailSituacaoFormComponent} from "./email-situacao-form/email-situacao-form.component";

const configurarEmailRoutes: Routes = [{
    path: '',
    component: EmailSituacaoHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'buscar',
    component: EmailSituacaoListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'novo',
    component: EmailSituacaoFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'editar/:id',
    component: EmailSituacaoFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(configurarEmailRoutes)],
    exports: [RouterModule],
})
export class EmailSituacaoRoutingModule {
}
