import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'app/arquitetura/shared/guards/security/auth.guard';
import { DadosUsuarioGuard } from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import { DadosTitularComponent } from './visualizar-dados-titular/dados-titular.component';
import { CabecalhoPadraoComponent } from 'app/arquitetura/shared/templates/cabecalho-padrao.component';
import { RodapePadraoComponent } from 'app/arquitetura/shared/templates/rodape-padrao.component';

const routes: Routes = [{
	path: '',
	component: DadosTitularComponent,
	canActivate: [AuthGuard, DadosUsuarioGuard],
	canActivateChild: [AuthGuard, DadosUsuarioGuard],
	children: [
		{
			path: '',
			outlet: 'header',
			component: CabecalhoPadraoComponent
		},
		{
			path: '',
			outlet: 'footer',
			component: RodapePadraoComponent
		},
	]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MeusDadosRoutingModule { }
