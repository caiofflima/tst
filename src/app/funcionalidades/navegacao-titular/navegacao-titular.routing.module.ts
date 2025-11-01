import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {NavegacaoTitularHomeComponent} from "./navegacao-titular-home/navegacao-titular-home.component";

const navegacaoTitularRoutes: Routes = [{
    path: '',
    component: NavegacaoTitularHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(navegacaoTitularRoutes)],
    exports: [RouterModule],
})
export class NavegacaoTitularRoutingModule {
}
