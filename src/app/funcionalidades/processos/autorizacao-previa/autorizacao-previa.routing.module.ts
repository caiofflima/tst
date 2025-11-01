import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorizacaoPreviaBaseComponent } from './autorizacao-previa-base/autorizacao-previa-base.component';
import { PaginaInicialAprComponent } from './pagina-inicial/pagina-inicial-apr.component';
import { PedidoEnviadoComponent } from './pedido-enviado/pedido-enviado.component';

const routes: Routes = [
  {
    path: 'stepper',
    component: AutorizacaoPreviaBaseComponent
  },
  {
    path: 'pedido-enviado/:idPedido',
    component: PedidoEnviadoComponent
  },
  {
    path: '',
    component: PaginaInicialAprComponent
  },
  {
    path: 'acompanhamento',
    loadChildren: () => import('./acompanhamento-apr/acompanhamento-apr.module').then(x => x.AcompanhamentoAprModule),
  },
  {
    path: ':idPedido/acompanhamento',
    loadChildren: () => import('./acompanhamento-apr/acompanhamento-apr.module').then(x => x.AcompanhamentoAprModule),

  },
  {
    path: ':idPedido/analise',
    loadChildren: () => import('./acompanhamento-apr/acompanhamento-apr.module').then(x => x.AcompanhamentoAprModule),

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorizacaoPreviaRoutingModule {
}
