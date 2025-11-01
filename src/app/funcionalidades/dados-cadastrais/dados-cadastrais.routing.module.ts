import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { DependenteDetailComponent } from "./dependente-detail/dependente-detail.component";
import { DadosCadastraisDetailComponent } from "./detail/dados-cadastrais-detail.component";
import { InformacoesPedidoDetailComponent } from "./informacoes-pedido-detail/informacoes-pedido-detail.component";

const dadosCadastraisRoutes: Routes = [
{
    path: '',
    component: DadosCadastraisDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
},
{
    path: 'informacoes-pedido-detail/:idPedido',
    component: InformacoesPedidoDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
},
{
    path: 'dependente-detail/:idBeneficiario',
    component: DependenteDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}
];

@NgModule({
    imports: [RouterModule.forChild(dadosCadastraisRoutes)],
    exports: [RouterModule],
})
export class DadosCadastraisRoutingModule {
}
