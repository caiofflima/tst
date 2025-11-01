import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { ProcedimentosListarAutorizacaoPreviaComponent } from "./listar-autorizacao-previa/procedimentos-listar-autorizacao-previa.component";

const procedimentosRoutes: Routes = [{
    path: '',
    component: ProcedimentosListarAutorizacaoPreviaComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(procedimentosRoutes)],
    exports: [RouterModule],
})
export class ProcedimentosRoutingModule {
}
