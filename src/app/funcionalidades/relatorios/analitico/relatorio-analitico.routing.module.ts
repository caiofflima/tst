import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../arquitetura/shared/guards/security/dados-usuario.guard";
import {RelatorioAnaliticoListarComponent} from "./analitico-listar/analitico-listar.component";

const relatoriosRoutes: Routes = [
    {
        path: 'lista',
        component: RelatorioAnaliticoListarComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(relatoriosRoutes)],
    exports: [RouterModule],
})
export class RelatorioAnaliticoRoutingModule {
}
