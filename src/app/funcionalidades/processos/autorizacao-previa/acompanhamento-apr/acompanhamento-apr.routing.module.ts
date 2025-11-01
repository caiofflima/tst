import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AcompanhamentoAprComponent} from './acompanhamento-apr/acompanhamento-apr.component'

const routes: Routes = [
  {
    path: '',
    component: AcompanhamentoAprComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcompanhamentoAprRoutingModule {
}
