import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import { EmpresaPrestadorExternoFormComponent } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-form/empresa-prestador-externo-form.component';
import { EmpresaPrestadorExternoHomeComponent } from 'app/funcionalidades/empresa-prestador-externo/empresa-prestador-externo-home/empresa-prestador-externo-home.component';
import { EmpresaPrestadorExternoListarComponent } from './empresa-prestador-externo-listar/empresa-prestador-externo-listar.component';


const empresaPrestadorExternoRoutes: Routes = [
    {
        path: '',
        component: EmpresaPrestadorExternoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: EmpresaPrestadorExternoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'busca',
        component: EmpresaPrestadorExternoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id',
        component: EmpresaPrestadorExternoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( empresaPrestadorExternoRoutes )],
    exports: [RouterModule],
} )

export class EmpresaPrestadorExternoRoutingModule { }
