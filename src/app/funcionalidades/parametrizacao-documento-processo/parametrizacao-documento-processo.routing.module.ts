import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {
    ParametrizacaoDocumentoProcessoHomeComponent
} from "./parametrizacao-documento-processo-home/parametrizacao-documento-processo-home.component";
import {
    ParametrizacaoDocumentoProcessoListarComponent
} from "./parametrizacao-documento-processo-listar/parametrizacao-documento-processo-listar.component";
import {
    ParametrizacaoDocumentoProcessoFormComponent
} from "./parametrizacao-documento-processo-form/parametrizacao-documento-processo-form.component";


const parametrizacaoDocumentoProcessoRoute: Routes = [
    {
        path: '',
        component: ParametrizacaoDocumentoProcessoHomeComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: ParametrizacaoDocumentoProcessoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'novo',
        component: ParametrizacaoDocumentoProcessoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'editar/:id/:idTipoProcesso',
        component: ParametrizacaoDocumentoProcessoFormComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(parametrizacaoDocumentoProcessoRoute)],
    exports: [RouterModule],
})

export class ParametrizacaoDocumentoProcessoRoutingModule {
}
