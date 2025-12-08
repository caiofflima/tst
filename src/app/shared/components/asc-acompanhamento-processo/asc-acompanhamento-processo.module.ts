import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscAcompanhamentoProcessoBaseComponent} from "./asc-acompamento-processo-base/asc-acompanhamento-processo-base.component";
import {AscCardSituacaoProcessoComponent} from "./asc-card-situacao-processo/asc-card-situacao-processo.component";
import {AscCardModule} from "../asc-card/asc-card.module";
import {AscModalModule} from "../asc-modal/asc-modal.module";
import {AscAcompamentoHeaderComponent} from "./asc-acompanhamento-header/asc-acompanhamento-header.component";
import {AscCardDetalheOcorrenciaComponent} from "./asc-card-detalhe-ocorrencia/asc-card-detalhe-ocorrencia.component";
import {AscCardAcompanhamentoHistoricoComponent} from "./asc-card-acompanhamento-historico/asc-card-acompanhamento-historico.component";
import {AscStepperModule} from "../asc-stepper/asc-stepper.module";
import {RouterModule} from "@angular/router";
import {PlaygroundModule} from "../../playground/playground.module";
import {AscPedidoModule} from "../asc-pedido/asc-pedido.module";
import {ComponentModule} from "../component.module";
import {PipeModule} from "../../pipes/pipe.module";
import { AscDetalheSituacaoComponent } from './asc-detalhe-situacao/asc-detalhe-situacao.component';
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        AscCardModule,
        AscModalModule,
        AscStepperModule,
        RouterModule,
        PlaygroundModule,
        AscPedidoModule,
        ComponentModule,
        PipeModule,
        DscCaixaModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        AscAcompanhamentoProcessoBaseComponent,
        AscAcompamentoHeaderComponent,
        AscCardSituacaoProcessoComponent,
        AscCardDetalheOcorrenciaComponent,
        AscCardAcompanhamentoHistoricoComponent,
        AscDetalheSituacaoComponent
    ],
  exports: [AscAcompanhamentoProcessoBaseComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AscAcompanhamentoProcessoModule {
}
