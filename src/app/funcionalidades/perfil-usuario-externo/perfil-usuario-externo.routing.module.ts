import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import { PerfilUsuarioExternoBuscarComponent } from './perfil-usuario-externo-buscar/perfil-usuario-externo-buscar.component';
import { PerfilUsuarioExternoFormComponent } from './perfil-usuario-externo-form/perfil-usuario-externo-form.component';
import { PerfilUsuarioExternoHomeComponent } from './perfil-usuario-externo-home/perfil-usuario-externo-home.component';


const perfilUsuarioExternoRoutes: Routes = [
    {
        path: '',
        component: PerfilUsuarioExternoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'busca',
        component: PerfilUsuarioExternoBuscarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'atualizar-credencial',
        component: PerfilUsuarioExternoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( perfilUsuarioExternoRoutes )],
    exports: [RouterModule],
} )

export class PerfilUsuarioExternoRoutingModule { }
