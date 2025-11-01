import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcompanhamentoComponent } from "./acompanhamento/acompanhamento.component";
import { AscAcompanhamentoProcessoModule } from "../../../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import { AscCardAcompanhamentoConteudoModule } from "../../../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import { AscResumoModule } from "../../../../shared/components/asc-pedido/asc-resumo/asc-resumo.module";
import { PlaygroundModule } from "../../../../shared/playground/playground.module";
import { AcompanhamentoReembolsoRoutingModule } from "./acompanhamento-reembolso.routing.module";
import {AscDocumentosModule} from "../../../../../app/shared/components/asc-pedido/asc-documentos/asc-documentos.module";

@NgModule({
  imports: [
    CommonModule,
    AcompanhamentoReembolsoRoutingModule,
    AscAcompanhamentoProcessoModule,
    AscCardAcompanhamentoConteudoModule,
    AscResumoModule,
    PlaygroundModule,
    AscDocumentosModule
  ],
  declarations: [AcompanhamentoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcompanhamentoReembolsoModule {
}
