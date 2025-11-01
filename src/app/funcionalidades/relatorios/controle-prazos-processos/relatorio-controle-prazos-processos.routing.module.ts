import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../arquitetura/shared/guards/security/dados-usuario.guard";
import {RelatorioControlePrazosProcessosListarComponent} from "./controle-prazos-processos-listar/controle-prazos-processos-listar.component";
import {RelatorioControlePrazosProcessosHomeComponent} from "./controle-prazos-processos-home/controle-prazos-processos-home.component";


const relatoriosRoutes: Routes = [
	{
		path: 'lista',
		component: RelatorioControlePrazosProcessosListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: '',
		component: RelatorioControlePrazosProcessosHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(relatoriosRoutes)],
	exports: [RouterModule],
})
export class RelatorioControlePrazosProcessosRoutingModule { }
