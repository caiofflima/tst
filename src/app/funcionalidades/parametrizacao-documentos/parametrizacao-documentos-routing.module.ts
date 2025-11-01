import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from "../../arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "../../arquitetura/shared/guards/security/dados-usuario.guard";
import {ParametrizacaoDocumentosHomeComponent} from "./parametrizacao-documentos-home/parametrizacao-documentos-home.component";
import {ParametrizacaoDocumentosListarComponent} from "./parametrizacao-documentos-listar/parametrizacao-documentos-listar.component";
import {ParametrizacaoDocumentosFromComponent} from "./parametrizacao-documentos-from/parametrizacao-documentos-from.component";

const parametrizacaoDocumentosRoute: Routes =[
  {path: '',
    component: ParametrizacaoDocumentosHomeComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'buscar',
    component: ParametrizacaoDocumentosListarComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  },
  {
    path: 'novo',
    component: ParametrizacaoDocumentosFromComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  } ,
  {
    path: 'editar/:id',
    component: ParametrizacaoDocumentosFromComponent,
    canActivate: [AuthGuard, DadosUsuarioGuard],
    canActivateChild: [AuthGuard, DadosUsuarioGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(parametrizacaoDocumentosRoute)],
  exports: [RouterModule]
})
export class ParametrizacaoDocumentosRoutingModule { }
