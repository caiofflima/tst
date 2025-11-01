import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "../../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../../arquitetura/shared/guards/security/dados-usuario.guard";
import {RelatorioJuntaMedicaOdontologicaListarComponent} from "./junta-medica-odontologica-listar/junta-medica-odontologica-listar.component";
import {RelatorioJuntaMedicaOdontologicaHomeComponent} from "./junta-medica-odontologica-home/junta-medica-odontologica-home.component";


const relatoriosRoutes: Routes = [
	{
		path: 'lista',
		component: RelatorioJuntaMedicaOdontologicaListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: '',
		component: RelatorioJuntaMedicaOdontologicaHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(relatoriosRoutes)],
	exports: [RouterModule],
})
export class RelatorioJuntaMedicaOdontologicaRoutingModule { }
