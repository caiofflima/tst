import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TemplatesModule} from 'app/arquitetura/shared/templates/templates.module';
import {DirectivesModule} from 'app/arquitetura/shared/directives/directives.module';
import {TrilhaAuditoriaComponent} from 'app/funcionalidades/trilha-auditoria/trilha-auditoria.component';
import {TrilhaAuditoriaRoutingModule} from 'app/funcionalidades/trilha-auditoria/trilha-auditoria.routing.module';
import {ComposicaoPedidoModule} from 'app/shared/components/pedido/composicao-pedido.module';
import {PipeModule} from 'app/shared/pipes/pipe.module';
import {PrimeNGModule} from 'app/shared/primeng.module';
import {
  TrilhaAnexosDocumentosComponent,
  TrilhaAutorizacoesProcedimentosComponent,
  TrilhaDadosGeraisComponent,
  TrilhaDocumentosComponent,
  TrilhaEmailsComponent,
  TrilhaEmpresaPrestadorExternoComponent,
  TrilhaGipesEmpresaPrestadorExternoComponent,
  TrilhaMensagensComponent,
  TrilhaOcorrenciasComponent,
  TrilhaPerfilPrestadorExternoComponent,
  TrilhaPrestadorExternoComponent,
  TrilhaProcedimentosComponent,
  TrilhaTiposDestinatarioEmailComponent,
  TrilhaValidacoesDocumentosComponent,
  TrilhaVinculosEmpresaPrestadorComponent
} from 'app/funcionalidades/trilha-auditoria/dados-consulta/dados-consulta.component';

@NgModule({
    imports: [
        CommonModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TemplatesModule,
        TrilhaAuditoriaRoutingModule,
        PrimeNGModule,
        ComposicaoPedidoModule,
        PipeModule
    ],
    exports: [
        TrilhaDocumentosComponent
    ],
    declarations: [
        TrilhaAuditoriaComponent,
        TrilhaAnexosDocumentosComponent,
        TrilhaDadosGeraisComponent,
        TrilhaDocumentosComponent,
        TrilhaEmpresaPrestadorExternoComponent,
        TrilhaMensagensComponent,
        TrilhaOcorrenciasComponent,
        TrilhaPerfilPrestadorExternoComponent,
        TrilhaProcedimentosComponent,
        TrilhaValidacoesDocumentosComponent,
        TrilhaEmailsComponent,
        TrilhaPrestadorExternoComponent,
        TrilhaGipesEmpresaPrestadorExternoComponent,
        TrilhaAutorizacoesProcedimentosComponent,
        TrilhaTiposDestinatarioEmailComponent,
        TrilhaVinculosEmpresaPrestadorComponent
    ]
})
export class TrilhaAuditoriaModule { }
