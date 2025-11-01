import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "app/arquitetura/shared/guards/security/auth.guard";
import { DadosUsuarioGuard } from "app/arquitetura/shared/guards/security/dados-usuario.guard";

import { TrilhaAuditoriaComponent } from "./trilha-auditoria.component";

const routes: Routes = [
	{
		path: '',
		component: TrilhaAuditoriaComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class TrilhaAuditoriaRoutingModule { }