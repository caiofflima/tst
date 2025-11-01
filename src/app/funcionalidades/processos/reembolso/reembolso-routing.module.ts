import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReembolsoBaseComponent } from './reembolso-base/reembolso-base.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { ReciboComponent } from "./recibo/recibo.component";

const routes: Routes = [
  {
    path: 'stepper',
    component: ReembolsoBaseComponent
  },
  {
    path: '',
    component: PaginaInicialComponent
  },
  {
    path: 'recibo/:idPedido',
    component: ReciboComponent
  },
  {
    path: 'acompanhamento',
    loadChildren: () => import('./acompanhamento-reembolso/acompanhamento-reembolso.module').then(x => x.AcompanhamentoReembolsoModule),

  },
  {
    path: ':idPedido/acompanhamento',
    loadChildren: () => import('./acompanhamento-reembolso/acompanhamento-reembolso.module').then(x => x.AcompanhamentoReembolsoModule),

  },
  {
    path: ':idPedido/analise',
    loadChildren: () => import('./acompanhamento-reembolso/acompanhamento-reembolso.module').then(x => x.AcompanhamentoReembolsoModule),
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReembolsoRoutingModule {
}
