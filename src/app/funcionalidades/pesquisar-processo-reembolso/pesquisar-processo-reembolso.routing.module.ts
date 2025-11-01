import { PesquisarProcessoReembolsoFormComponent } from './pesquisar-processo-reembolso-form/pesquisar-processo-reembolso-form.component';
import { PesquisarProcessoReembolsoListarComponent } from './pesquisar-processo-reembolso-listar/pesquisar-processo-reembolso-listar.component';

import { PesquisarProcessoReembolsoHomeComponent } from './pesquisar-processo-reembolso-home/pesquisar-processo-reembolso-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';


const processosReembolsoRoutes: Routes = [
    {path: '',
     component: PesquisarProcessoReembolsoHomeComponent,
     canActivate: [AuthGuard, DadosUsuarioGuard],
     canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }, 
    {
        path: 'buscar',
        component: PesquisarProcessoReembolsoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( processosReembolsoRoutes )],
    exports: [RouterModule],
} )

export class PesquisarProcessoReembolsoRoutingModule { }
