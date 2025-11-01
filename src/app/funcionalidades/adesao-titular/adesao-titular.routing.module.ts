import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInicialAdesaoTitularComponent } from './pagina-inicial/pagina-inicial-adesao-titular.component';
import { CadastroTitularComponent } from './cadastro/cadastro-titular.component';
import { AcompanhamentoAdesaoComponent } from './acompanhamento-adesao/acompanhamento-adesao/acompanhamento-adesao.component';

const routes: Routes = [
    {
        path: 'inicio',
        component: PaginaInicialAdesaoTitularComponent
    },
    {
        path: 'inicio/stepper',
        component: CadastroTitularComponent
    },
    {
        path: 'acompanhamento',
        component: AcompanhamentoAdesaoComponent
    },
    {
        path: ':idPedido/acompanhamento',
        component: AcompanhamentoAdesaoComponent
    },
    {
        path: ':idPedido/analise',
        component: AcompanhamentoAdesaoComponent
    },
    // Adicione outras rotas para outros componentes base, se necessário
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdesaoTitularRoutingModule {
}
