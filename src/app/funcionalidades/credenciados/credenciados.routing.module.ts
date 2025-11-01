import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {CredenciadosComponent} from "./credenciados/credenciados.component";

const credenciadosRoutes: Routes = [{
    path: '',
    component: CredenciadosComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(credenciadosRoutes)],
    exports: [RouterModule],
})
export class CredenciadosRoutingModule {
}
