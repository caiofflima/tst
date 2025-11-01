import {VincMedPatologiaFormComponent} from './vinc-med-patologia-form/vinc-med-patologia-form.component';
import {VincMedPatologiaListarComponent} from './vinc-med-patologia-listar/vinc-med-patologia-listar.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/arquitetura/shared/guards/security/auth.guard';
import {DadosUsuarioGuard} from 'app/arquitetura/shared/guards/security/dados-usuario.guard';
import {VincMedPatologiaHomeComponent} from './vinc-med-patologia-home/vinc-med-patologia-home.component';

const vincMedPatologiaRoutes: Routes = [{
    path: '',
    component: VincMedPatologiaHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'listar',
    component: VincMedPatologiaListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'editar/:id',
    component: VincMedPatologiaFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}, {
    path: 'novo',
    component: VincMedPatologiaFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
}];

@NgModule({
    imports: [RouterModule.forChild(vincMedPatologiaRoutes)],
    exports: [RouterModule],
})
export class VincMedPatologiaRoutingModule {
}
