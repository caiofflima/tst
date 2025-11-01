import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../arquitetura/shared/guards/security/dados-usuario.guard";
import {RelatorioTempoMedioProcessosListarComponent} from "./tempo-medio-processos-listar/tempo-medio-processos-listar.component";
import {RelatorioTempoMedioProcessosHomeComponent} from "./tempo-medio-processos-home/tempo-medio-processos-home.component";


const relatoriosRoutes: Routes = [
	{
		path: 'lista',
		component: RelatorioTempoMedioProcessosListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: '',
		component: RelatorioTempoMedioProcessosHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(relatoriosRoutes)],
	exports: [RouterModule],
})
export class RelatorioTempoMedioProcessosRoutingModule { }
