import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../../app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from '../../../app/arquitetura/shared/guards/security/dados-usuario.guard';
import { PerfilConsultaComponent } from '../../../app/arquitetura/seguranca/perfil/consulta/perfil-consulta.component';
import { PerfilCadastroComponent } from '../../../app/arquitetura/seguranca/perfil/cadastro/perfil-cadastro.component';

const segurancaRoutes: Routes = [
	{
		path: '',
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard],
		children: [
			{
				path: 'perfil',
				children: [
					{
						path: '',
						component: PerfilConsultaComponent
					},
					{
						path: 'novo',
						component: PerfilCadastroComponent
					},
					{
						path: ':id/editar',
						component: PerfilCadastroComponent
					}
				]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(segurancaRoutes)],
	exports: [RouterModule],
})
export class SegurancaRoutingModule { }
