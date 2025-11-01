import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../arquitetura/shared/guards/security/dados-usuario.guard";
import {RelatorioProcedimentosSolicitadosPorProfissionalListarComponent} from "./procedimentos-solicitados-por-profissional-listar/procedimentos-solicitados-por-profissional-listar.component";
import {RelatorioProcedimentosSolicitadosPorProfissionalHomeComponent} from "./procedimentos-solicitados-por-profissional-home/procedimentos-solicitados-por-profissional-home.component";


const relatoriosRoutes: Routes = [
	{
		path: 'lista',
		component: RelatorioProcedimentosSolicitadosPorProfissionalListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: '',
		component: RelatorioProcedimentosSolicitadosPorProfissionalHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(relatoriosRoutes)],
	exports: [RouterModule],
})
export class RelatorioProcedimentosSolicitadosPorProfissionalRoutingModule { }
