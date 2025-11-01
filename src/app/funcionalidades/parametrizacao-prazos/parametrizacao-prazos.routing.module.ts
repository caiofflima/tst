import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {ParametrizacaoPrazosFormComponent} from "./parametrizacao-prazos-form/parametrizacao-prazos-form.component";
import {
    ParametrizacaoPrazosListarComponent
} from "./parametrizacao-prazos-listar/parametrizacao-prazos-listar.component";
import {ParametrizacaoPrazosHomeComponent} from "./parametrizacao-prazos-home/parametrizacao-prazos-home.component";

const parametrizacaoPrazosRoute: Routes = [
    {
        path: '',
        component: ParametrizacaoPrazosHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: ParametrizacaoPrazosListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: ParametrizacaoPrazosFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id',
        component: ParametrizacaoPrazosFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(parametrizacaoPrazosRoute)],
    exports: [RouterModule],
})

export class ParametrizacaoPrazosRoutingModule {
}
