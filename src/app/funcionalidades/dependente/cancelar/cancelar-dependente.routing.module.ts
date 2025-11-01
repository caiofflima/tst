import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CancelarDependenteComponent} from './cancelar-dependente/cancelar-dependente.component';
import {AcompanhamentoDependenteComponent} from '../acompanhamento-dependente/acompanhamento-dependente.component';
import {PaginaInicialComponent} from './pagina-inicial/pagina-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaInicialComponent
  },
  {
    path: 'cancelar',
    component: CancelarDependenteComponent,
  },
  {
    path: 'cancelar/:idBeneficiario',
    component: CancelarDependenteComponent,
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
export class CancelarDependenteRoutingModule {
}
