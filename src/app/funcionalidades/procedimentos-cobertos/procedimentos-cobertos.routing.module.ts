import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { ProcedimentosCobertosParamComponent } from "./param/procedimentos-cobertos-param.component";
import { ProcedimentosCobertosResultComponent } from "./result/procedimentos-cobertos-result.component";
import { ListarProcedimentosComReembolsoComponent } from "./listar-procedimentos-com-reembolso/listar-procedimentos-com-reembolso.component";

const procedimentosCobertosRoutes: Routes = [
    {
        path: '',
        component: ListarProcedimentosComReembolsoComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: ProcedimentosCobertosResultComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(procedimentosCobertosRoutes)],
    exports: [RouterModule],
})
export class ProcedimentosCobertosRoutingModule {
}
