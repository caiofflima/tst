import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcompanhamentoAprComponent } from "./acompanhamento-apr/acompanhamento-apr.component";
import { AscAcompanhamentoProcessoModule } from "../../../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import { AscCardAcompanhamentoConteudoModule } from "../../../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import { AcompanhamentoAprRoutingModule } from "./acompanhamento-apr.routing.module";
import { AscPedidoModule } from "../../../../shared/components/asc-pedido/asc-pedido.module";
import { PlaygroundModule } from '../../../../shared/playground/playground.module';
import { AscCardModule } from "../../../../shared/components/asc-card/asc-card.module";
import {AscDocumentosModule} from "../../../../../app/shared/components/asc-pedido/asc-documentos/asc-documentos.module";

@NgModule({
  imports: [
    CommonModule,
    AcompanhamentoAprRoutingModule,
    AscAcompanhamentoProcessoModule,
    AscCardAcompanhamentoConteudoModule,
    AscPedidoModule,
    PlaygroundModule,
    AscCardModule,
    AscDocumentosModule
  ],
  declarations: [AcompanhamentoAprComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcompanhamentoAprModule {
}
