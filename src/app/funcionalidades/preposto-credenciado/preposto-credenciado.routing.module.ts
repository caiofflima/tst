import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";

import { EmpresaCredenciadaHomeComponent} from "./preposto-credenciado-home/empresa-credenciada-home.component";
import { EmpresaCredenciadaFormComponent } from "./preposto-credenciado-form/empresa-credenciada-form.component";
import { EmpresaCredenciadaListarComponent } from "./preposto-credenciado-listar/empresa-credenciada-listar.component";

const realizarAtendimentoRoutes: Routes = [
	{
		path: '',
		component: EmpresaCredenciadaHomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'busca',
		component: EmpresaCredenciadaListarComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'novo',
		component: EmpresaCredenciadaFormComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
	{
		path: 'editar/:id',
		component: EmpresaCredenciadaFormComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	},
];

@NgModule({
	imports: [RouterModule.forChild(realizarAtendimentoRoutes)],
	exports: [RouterModule],
})
export class EmpresaCredenciadaRoutingModule { }
