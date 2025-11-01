import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";

import { ListaMensagensComponent } from "./lista-mensagens.component";
import { DetalharMensagensComponent } from "../detalhar-mensagens/detalhar-mensagens.component";

const listaMensagensRoutes: Routes = [
	{
		path: '',
		component: ListaMensagensComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'detalhar',
		component: DetalharMensagensComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(listaMensagensRoutes)],
	exports: [RouterModule],
})
export class ListaMensagensRoutingModule { }