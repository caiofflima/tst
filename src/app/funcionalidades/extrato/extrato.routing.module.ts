import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { ExtratoIRPFComponent } from "./extrato-irpf/extrato-irpf.component";
import { ExtratoIRPFDetalharComponent } from "./extrato-irpf-detalhar/extrato-irpf-detalhar.component";

const extratoRoutes: Routes = [{
    path: '',
    component: ExtratoIRPFComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard]
},
{
  path: 'detalhar',
  component: ExtratoIRPFDetalharComponent,
  canActivate: [AuthGuard, DadosUsuarioGuard],
  canActivateChild: [AuthGuard, DadosUsuarioGuard]
}
];

@NgModule({
    imports: [RouterModule.forChild(extratoRoutes)],
    exports: [RouterModule],
})

export class ExtratoRoutingModule {
}
