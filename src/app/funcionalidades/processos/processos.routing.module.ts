import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../app/arquitetura/shared/guards/security/dados-usuario.guard";
import {ListaProcessosComponent} from "./lista-processos/lista-processos.component";
import {ProcessosComponent} from "./processos.component";
import {PesquisarProcessoComponent} from "./pesquisar/pesquisar-processo.component";
import {ListaProcessosAnalistaComponent} from "./lista-processos-analista/lista-processos-analista.component";

const listaProcessosRoutes: Routes = [{
    path: '',
    component: ListaProcessosComponent,
    
    canActivate: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'detalhar/:origem',
    component: ProcessosComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
}, {
    path: 'reembolso',
    loadChildren: () => import('./reembolso/reembolso.module').then(x => x.ReembolsoModule),
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canLoad: [AuthGuard]
}, {
    path: ':idPedido/reembolso',
    loadChildren: () => import('./reembolso/reembolso.module').then(x => x.ReembolsoModule),
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canLoad: [AuthGuard]
}, {
    path: 'autorizacao-previa',
    loadChildren: () => import('./autorizacao-previa/autorizacao-previa.module').then(x => x.AutorizacaoPreviaModule),
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canLoad: [AuthGuard]
}, {
    path: ':idPedido/autorizacao-previa',
    loadChildren: () => import('./autorizacao-previa/autorizacao-previa.module').then(x => x.AutorizacaoPreviaModule),
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canLoad: [AuthGuard]
}, {
    path: 'pesquisar',
    component: PesquisarProcessoComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
}, {
    path: 'pesquisar/lista',
    component: ListaProcessosAnalistaComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
}];

@NgModule({
    imports: [RouterModule.forChild(listaProcessosRoutes)],
    exports: [RouterModule],
})
export class MeusProcessosRoutingModule {
}
