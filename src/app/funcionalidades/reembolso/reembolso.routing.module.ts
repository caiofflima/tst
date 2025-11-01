import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { ReembolsoDetailComponent } from "./detail/reembolso-detail.component";
const reembolsoRoutes: Routes = [{
    path: '',
    component: ReembolsoDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}];
@NgModule({
    imports: [RouterModule.forChild(reembolsoRoutes)],
    exports: [RouterModule],
})
export class ReembolsoRoutingModule {
}