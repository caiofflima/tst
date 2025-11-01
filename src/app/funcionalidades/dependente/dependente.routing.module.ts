import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AlterarDependenteComponent} from './cadastro/alterar-dependente/alterar-dependente.component';
import {CadastroDependenteComponent} from './cadastro/cadastro-dependente/cadastro-dependente.component';
import {AcompanhamentoDependenteComponent} from './acompanhamento-dependente/acompanhamento-dependente.component';
import {PaginaInicialAlterarComponent} from './cadastro/pagina-inicial-alterar/pagina-inicial-alterar.component';
import {PaginaInicialComponent} from './cadastro/pagina-inicial/pagina-inicial.component';
import {ReciboComponent} from './recibo/recibo.component'

const routes: Routes = [
    {path: 'incluir', component: PaginaInicialComponent},
    {path: 'incluir/stepper', component: CadastroDependenteComponent},
    {path: 'alterar', component: PaginaInicialAlterarComponent},
    {path: 'alterar-dependente', component: AlterarDependenteComponent},
    {path: 'alterar-dependente/:idBeneficiario', component: AlterarDependenteComponent},
    {path: 'pedido-enviado/:idPedido', component: ReciboComponent},
    {path: 'alterar/:idPedido/acompanhamento', component: AcompanhamentoDependenteComponent},
    {path: ':idPedido/acompanhamento', component: AcompanhamentoDependenteComponent},
    {path: ':idPedido/analise', component: AcompanhamentoDependenteComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DependenteRoutingModule {
}
