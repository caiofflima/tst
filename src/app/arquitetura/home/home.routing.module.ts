import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../../app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from '../../../app/arquitetura/shared/guards/security/dados-usuario.guard';
import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
	{
		path: '',
		component: HomeComponent,
		canActivate: [AuthGuard, DadosUsuarioGuard],
		canActivateChild: [AuthGuard, DadosUsuarioGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(homeRoutes)],
	exports: [RouterModule],
})
export class HomeRoutingModule { }
