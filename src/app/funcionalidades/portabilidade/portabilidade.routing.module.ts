import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { PortabilidadeDetailComponent } from "./detail/portabilidade-detail.component";

const portabilidadeRoutes: Routes = [{
    path: '',
    component: PortabilidadeDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
},
{
    path: 'detail/:idBeneficiario',
    component: PortabilidadeDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(portabilidadeRoutes)],
    exports: [RouterModule],
})
export class PortabilidadeRoutingModule {
}
