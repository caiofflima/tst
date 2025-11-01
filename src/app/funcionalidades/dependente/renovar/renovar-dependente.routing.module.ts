import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {RenovarDependenteComponent} from './renovar-dependente/renovar-dependente.component';
import {AcompanhamentoDependenteComponent} from '../acompanhamento-dependente/acompanhamento-dependente.component';
import {PaginaInicialComponent} from './pagina-inicial/pagina-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaInicialComponent
  },
  {
    path: 'renovar',
    component: RenovarDependenteComponent,
  },
  {
    path: 'renovar/:idBeneficiario',
    component: RenovarDependenteComponent,
  },
  {
    path: ':idPedido/acompanhamento',
    component: AcompanhamentoDependenteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenovarDependenteRoutingModule {
}
