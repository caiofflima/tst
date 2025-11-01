import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import { PrestadorExternoHomeComponent } from 'app/funcionalidades/prestador-externo/prestador-externo-home/prestador-externo-home.component';
import { PrestadorExternoFormComponent } from 'app/funcionalidades/prestador-externo/prestador-externo-form/prestador-externo-form.component';
import { PrestadorExternoListarComponent } from './prestador-externo-listar/prestador-externo-listar.component';

const prestadorExternoRoutes: Routes = [
    {
        path: '',
        component: PrestadorExternoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: PrestadorExternoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id',
        component: PrestadorExternoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'busca',
        component: PrestadorExternoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( prestadorExternoRoutes )],
    exports: [RouterModule],
} )

export class PrestadorExternoRoutingModule { }
