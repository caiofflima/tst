import { PatologiaFormComponent } from './patologia-form/patologia-form.component';
import { PatologiaListarComponent } from './patologia-listar/patologia-listar.component';

import { PatologiaHomeComponent } from './patologia-home/patologia-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';


const patologiarExternoRoutes: Routes = [
    {path: '',
     component: PatologiaHomeComponent,
     canActivate: [AuthGuard, DadosUsuarioGuard],
     canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }, 
    {
        path: 'buscar',
        component: PatologiaListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: PatologiaFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    } ,   
    {
        path: 'editar/:id',
        component: PatologiaFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule( {
    imports: [RouterModule.forChild( patologiarExternoRoutes )],
    exports: [RouterModule],
} )

export class PatologiaRoutingModule { }
