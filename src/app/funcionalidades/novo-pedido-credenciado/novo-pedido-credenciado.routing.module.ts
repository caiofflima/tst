import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";

import { NovoPedidoAutorizadorComponent } from "./novo-pedido-credenciado.component";

const routes: Routes = [
	{
		path: '',
		component: NovoPedidoAutorizadorComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class NovoPedidoCredenciadoRoutingModule { }
