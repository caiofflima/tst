import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../arquitetura/shared/guards/security/dados-usuario.guard";
import { ParametrizacaoMotivoNegacaoFormComponent } from './parametrizacao-motivo-negacao-form/parametrizacao-motivo-negacao-form.component';
import { ParametrizacaoMotivoNegacaoHomeComponent } from './parametrizacao-motivo-negacao-home/parametrizacao-motivo-negacao-home.component';
import { ParametrizacaoMotivoNegacaoListarComponent } from './parametrizacao-motivo-negacao-listar/parametrizacao-motivo-negacao-listar.component';

const parametrizacaoMotivoNegacaoRoute: Routes =[
  {path: '',
    component: ParametrizacaoMotivoNegacaoHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'buscar',
    component: ParametrizacaoMotivoNegacaoListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'novo',
    component: ParametrizacaoMotivoNegacaoFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  } ,
  {
    path: 'editar/:id',
    component: ParametrizacaoMotivoNegacaoFormComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(parametrizacaoMotivoNegacaoRoute)],
  exports: [RouterModule]
})
export class ParametrizacaoMotivoNegacaoRoutingModule { }
