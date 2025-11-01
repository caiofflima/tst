import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../../../app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../../app/arquitetura/shared/guards/security/dados-usuario.guard";
import { LiberacaoAlcadaListarComponent } from "./liberacao-alcada-listar/liberacao-alcada-listar.component";

const procedimentosRoutes: Routes = [{
    path: '',
    component: LiberacaoAlcadaListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(procedimentosRoutes)],
    exports: [RouterModule],
})
export class LiberacaoAlcadaRoutingModule {
}
