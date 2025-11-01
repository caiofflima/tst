import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../arquitetura/shared/guards/security/dados-usuario.guard";
import { ParametrizacaoMedicamentosFormComponent } from './parametrizacao-medicamentos-form/parametrizacao-medicamentos-form.component';
import { ParametrizacaoMedicamentosHomeComponent } from './parametrizacao-medicamentos-home/parametrizacao-medicamentos-home.component';
import { ParametrizacaoMedicamentosListarComponent } from './parametrizacao-medicamentos-listar/parametrizacao-medicamentos-listar.component';

const ParametrizacaoMedicamentosRoute: Routes =[
  {path: '',
    component: ParametrizacaoMedicamentosHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'buscar',
    component: ParametrizacaoMedicamentosListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'novo',
    component: ParametrizacaoMedicamentosFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  } ,
  {
    path: 'editar/:id',
    component: ParametrizacaoMedicamentosFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ParametrizacaoMedicamentosRoute)],
  exports: [RouterModule]
})
export class ParametrizacaoMedicamentosRoutingModule { }
