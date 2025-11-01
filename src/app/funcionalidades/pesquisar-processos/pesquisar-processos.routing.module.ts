import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../arquitetura/shared/guards/security/dados-usuario.guard";
import {PesquisarProcessosListarComponent} from "./pesquisar-processos-listar/pesquisar-processos-listar.component";
import {PesquisarProcessosHomeComponent} from "./pesquisar-processos-home/pesquisar-processos-home.component";

const listaProcessosRoutes: Routes = [
	{
		path: 'lista',
		component: PesquisarProcessosListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: '',
		component: PesquisarProcessosHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(listaProcessosRoutes)],
	exports: [RouterModule],
})
export class PesquisarProcessosRoutingModule { }
