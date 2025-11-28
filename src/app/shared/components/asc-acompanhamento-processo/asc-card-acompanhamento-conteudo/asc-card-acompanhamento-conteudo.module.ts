import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficiarioCardComponent } from "./beneficiario-card/beneficiario-card.component";
import { DadosProcessoCardComponent } from "./dados-processo-card/dados-processo-card.component";
import { DocumentosCondicionadosComponent } from "./documentos-condicionados/documentos-condicionados.component";
import { DocumentosObrigatoriosCardComponent } from "./documentos-obrigatorios-card/documentos-obrigatorios-card.component";
import { ListagemComponent } from "./listagem/listagem.component";
import { ProcedimentoPedidoCardComponent } from "./procedimento-pedido-card/procedimento-pedido-card.component";
import { ProfissionalCardComponent } from "./profissional-card/profissional-card.component";
import { ConsultaProcessoPlComponent } from "./consulta-processo-pl/consulta-processo-pl.component";
import { ComponentModule } from "../../component.module";
import { CardListagemProcessoPlComponent } from "./card-listagem-processo-pl/card-listagem-processo-pl.component";
import { StatusIconManagerComponent } from "./status-icon-manager/status-icon-manager.component";
import { AscDocumentosModule } from "../../asc-pedido/asc-documentos/asc-documentos.module";
import { ProgressBarModule } from "primeng/progressbar";
import {PipeModule} from "../../../pipes/pipe.module";
import {AscModalModule} from "../../asc-modal/asc-modal.module";
import {AscButtonsModule} from "../../asc-buttons/asc-buttons.module";
import { FormsModule } from '@angular/forms';
import {DscCaixaModule} from 'app/shared/dsc-caixa/dsc-caixa.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    AscDocumentosModule,
    ProgressBarModule,
    PipeModule,
    AscModalModule,
    AscButtonsModule,
    FormsModule,
    DscCaixaModule
  ],
  declarations: [
    BeneficiarioCardComponent,
    DadosProcessoCardComponent,
    DocumentosCondicionadosComponent,
    DocumentosObrigatoriosCardComponent,
    ListagemComponent,
    ProcedimentoPedidoCardComponent,
    ProfissionalCardComponent,
    ConsultaProcessoPlComponent,
    CardListagemProcessoPlComponent,
    StatusIconManagerComponent
  ],
  exports: [
    BeneficiarioCardComponent,
    DadosProcessoCardComponent,
    DocumentosCondicionadosComponent,
    DocumentosObrigatoriosCardComponent,
    ListagemComponent,
    ProcedimentoPedidoCardComponent,
    ProfissionalCardComponent,
    ConsultaProcessoPlComponent,
    CardListagemProcessoPlComponent,
    StatusIconManagerComponent
  ]
})
export class AscCardAcompanhamentoConteudoModule {
}
