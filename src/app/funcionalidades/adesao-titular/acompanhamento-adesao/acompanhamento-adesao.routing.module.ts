import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcompanhamentoAdesaoComponent } from './acompanhamento-adesao/acompanhamento-adesao.component';

const routes: Routes = [
  {
    path: '',
    component: AcompanhamentoAdesaoComponent
  },
  // Outras rotas específicas para acompanhamento, se necessário
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcompanhamentoAdesaoRoutingModule {
}
