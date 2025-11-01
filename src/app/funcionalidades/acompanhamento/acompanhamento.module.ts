import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AcompanhamentoRoutingModule} from './acompanhamento-routing.module';
import {AcompanhamentoComponent} from './acompanhamento.component';
import {PrimeNGModule} from '../../shared/primeng.module';
import {ComponentModule} from '../../shared/components/component.module';
import {PlaygroundModule} from '../../shared/playground/playground.module';
import {AscAcompanhamentoProcessoModule} from "../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import {AscCardAcompanhamentoConteudoModule} from "../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import {AscPedidoModule} from "../../shared/components/asc-pedido/asc-pedido.module";
import {BeneficiarioCardComponent} from "./beneficiario-card/beneficiario-card.component";
import {ProfissionalCardComponent} from "./profissional-card/profissional-card.component";
import {ListagemComponent} from "./listagem/listagem.component";
import {DadosProcessoCardComponent} from "./dados-processo-card/dados-processo-card.component";
import {ProcedimentoPedidoCardComponent} from "./procedimento-pedido-card/procedimento-pedido-card.component";
import {PipeModule} from "../../shared/pipes/pipe.module";

@NgModule({
    imports: [
        CommonModule,
        AcompanhamentoRoutingModule,
        PrimeNGModule,
        ComponentModule,
        PlaygroundModule,
        AscAcompanhamentoProcessoModule,
        AscCardAcompanhamentoConteudoModule,
        AscPedidoModule,
        PipeModule
    ],
  declarations: [
    AcompanhamentoComponent,
    BeneficiarioCardComponent,
    DadosProcessoCardComponent,
    ListagemComponent,
    ProcedimentoPedidoCardComponent,
    ProfissionalCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcompanhamentoModule {
}
