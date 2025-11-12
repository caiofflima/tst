import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcompanhamentoAdesaoComponent } from "./acompanhamento-adesao/acompanhamento-adesao.component";
import { AscAcompanhamentoProcessoModule } from "../../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import { AscCardAcompanhamentoConteudoModule } from "../../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import { AcompanhamentoAdesaoRoutingModule } from "./acompanhamento-adesao.routing.module";
import { AscPedidoModule } from "../../../shared/components/asc-pedido/asc-pedido.module";
import { PlaygroundModule } from '../../../shared/playground/playground.module';
import { AscCardModule } from "../../../shared/components/asc-card/asc-card.module";
import { AscDocumentosModule } from "../../../shared/components/asc-pedido/asc-documentos/asc-documentos.module";
import { ComponentModule } from "../../../shared/components/component.module";

@NgModule({
  imports: [
    CommonModule,
    AcompanhamentoAdesaoRoutingModule,
    AscAcompanhamentoProcessoModule,
    AscCardAcompanhamentoConteudoModule,
    AscPedidoModule,
    PlaygroundModule,
    AscCardModule,
    AscDocumentosModule,
    ComponentModule
  ],
  declarations: [AcompanhamentoAdesaoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcompanhamentoAdesaoModule {
}
