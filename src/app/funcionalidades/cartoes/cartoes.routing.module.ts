import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { CartoesDetailComponent } from "./detail/cartoes-detail.component";

const cartoesRoutes: Routes = [{
    path: '',
    component: CartoesDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
},
{
    path: 'detail/:idBeneficiario',
    component: CartoesDetailComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(cartoesRoutes)],
    exports: [RouterModule],
})
export class CartoesRoutingModule {
}
