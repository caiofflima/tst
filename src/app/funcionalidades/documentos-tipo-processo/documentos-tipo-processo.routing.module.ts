import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "app/arquitetura/shared/guards/security/auth.guard";
import {DadosUsuarioGuard} from "app/arquitetura/shared/guards/security/dados-usuario.guard";
import { DocumentosTipoProcessoParamComponent } from "./param/documentos-tipo-processo-param.component";
import { DocumentosTipoProcessoResultComponent } from "./result/documentos-tipo-processo-result.component";

const documentosTipoProcessoRoutes: Routes = [
    {
        path: '',
        component: DocumentosTipoProcessoParamComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard]
    },
    {
        path: 'buscar',
        component: DocumentosTipoProcessoResultComponent,
        canActivate: [AuthGuard, DadosUsuarioGuard],
        canActivateChild: [AuthGuard, DadosUsuarioGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(documentosTipoProcessoRoutes)],
    exports: [RouterModule],
})
export class DocumentosTipoProcessoRoutingModule {
}
