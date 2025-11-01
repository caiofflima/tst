import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { ListarProcedimentosComMedicamentoComponent } from "./listar-procedimentos-com-medicamento.component";

const procedimentosMedicamentoRoutes: Routes = [
    {
        path: '',
        component: ListarProcedimentosComMedicamentoComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(procedimentosMedicamentoRoutes)],
    exports: [RouterModule],
})
export class ProcedimentosMedicamentoRoutingModule {
}
