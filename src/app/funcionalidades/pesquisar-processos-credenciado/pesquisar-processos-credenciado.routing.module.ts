import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "../../../app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "../../../app/arquitetura/shared/guards/security/dados-usuario.guard";

import { PesquisarProcessosCredenciadoHomeComponent } from "./pesquisar-processos-credenciado-home/pesquisar-processos-credenciado-home.component";
import { PesquisarProcessosCredenciadoListarComponent } from "./pesquisar-processos-credenciado-listar/pesquisar-processos-credenciado-listar.component";
import { PesquisarProcessosV2Component } from "./pesquisar-processos-v2/pesquisar-processos-v2.component";
import {PesquisarProcessosListaV2Component} from "./pesquisar-processos-lista-v2/pesquisar-processos-lista-v2.component";

const routes: Routes = [
	{
		path: 'home',
		component: PesquisarProcessosCredenciadoHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'home/:minhasSolicitacoes',
		component: PesquisarProcessosCredenciadoHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'lista-resultado/:voltarPara',
		component: PesquisarProcessosCredenciadoListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'v2',
		component: PesquisarProcessosV2Component,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'v2/lista',
		component: PesquisarProcessosListaV2Component,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PesquisarProcessosCredenciadoRoutingModule { }
