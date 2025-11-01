import { NgModule } from '@angular/core';
import { AcompanhamentoComponent } from "./acompanhamento/acompanhamento.component";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    component: AcompanhamentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcompanhamentoReembolsoRoutingModule {
}
