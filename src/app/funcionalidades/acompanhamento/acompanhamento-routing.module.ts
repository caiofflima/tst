import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AcompanhamentoComponent} from './acompanhamento.component';
import {ListagemComponent} from '../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/listagem/listagem.component';

const routes: Routes = [
  {path:'listagem', component: ListagemComponent},
  {path: ':idPedido', component: AcompanhamentoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcompanhamentoRoutingModule { }
