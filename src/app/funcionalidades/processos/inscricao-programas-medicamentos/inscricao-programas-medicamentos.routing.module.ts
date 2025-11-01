import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
    InscricaoProgramasMendicamentosBaseComponent,
} from './inscricao-programas-medicamentos-base/inscricao-programas-medicamentos-base.component';
import {PaginaIncialComponent} from './pagina-incial/pagina-incial.component';
import {ReciboComponent} from "./recibo/recibo.component";
import {AcompanhamentoPmdComponent} from "./acompanhamento-pmd/acompanhamento-pmd.component";

const routes: Routes = [
    {
        path: 'novo',
        component: InscricaoProgramasMendicamentosBaseComponent,
    },
    {
        path: 'pedido-enviado/:idPedido',
        component: ReciboComponent
    },
    {
        path: '',
        component: PaginaIncialComponent
    },
    {
        path: ':idPedido/acompanhamento',
        component: AcompanhamentoPmdComponent
    },
    {
        path: ':idPedido/analise',
        component: AcompanhamentoPmdComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InscricaoProgramasMedicamentosRoutingModule {
}
