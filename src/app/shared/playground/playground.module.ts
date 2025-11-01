import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaProcessoPlComponent } from './consulta-processo-pl/consulta-processo-pl.component';
import { ComponentModule } from "../components/component.module";
import { StatusIconManagerComponent } from './status-icon-manager/status-icon-manager.component';
import { CardListagemProcessoPlComponent } from './card-listagem-processo-pl/card-listagem-processo-pl.component';
import { MudancaSituacaoCardPlComponent } from './mudanca-situacao-card-pl/mudanca-situacao-card-pl.component';
import { PrimeNGModule } from '../../../app/shared/primeng.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AscFileModule } from "../../../app/shared/components/asc-file/asc-file.module";
import { AscDocumentosModule } from "../components/asc-pedido/asc-documentos/asc-documentos.module";
import { AscModalMensagemPedidoComponent } from "./asc-modal-mensagem-pedido/asc-modal-mensagem-pedido.component";
import { AscModalCoparticipacaoComponent } from "./asc-modal-coparticipacao/asc-modal-coparticipacao.component";
import { AscModalModule } from "../components/asc-modal/asc-modal.module";
import { AscButtonsModule } from "../../../app/shared/components/asc-buttons/asc-buttons.module";
import { AscCardModule } from "../components/asc-card/asc-card.module";
import { ProcedimentoPedidoCardPlComponent } from './procedimento-pedido-card-pl/procedimento-pedido-card-pl.component';
import { PipeModule } from "../pipes/pipe.module";
import { AscAutorizacaoPreviaComponentsModule } from "../components/asc-pedido/asc-autorizacao-previa-components/asc-autorizacao-previa-components.module";
import {AscSelectModule} from "../components/asc-select/asc-select.module";

@NgModule({
    imports: [
        CommonModule,
        ComponentModule,
        PrimeNGModule,
        FormsModule,
        AscFileModule,
        AscDocumentosModule,
        AscModalModule,
        AscButtonsModule,
        AscCardModule,
        PipeModule,
        AscAutorizacaoPreviaComponentsModule,
        ReactiveFormsModule,
        AscSelectModule
    ],
  declarations: [ConsultaProcessoPlComponent, StatusIconManagerComponent, CardListagemProcessoPlComponent, 
    MudancaSituacaoCardPlComponent, AscModalMensagemPedidoComponent, ProcedimentoPedidoCardPlComponent,
    AscModalCoparticipacaoComponent],
  exports: [ConsultaProcessoPlComponent, CardListagemProcessoPlComponent, MudancaSituacaoCardPlComponent, 
    AscModalMensagemPedidoComponent, ProcedimentoPedidoCardPlComponent, AscModalCoparticipacaoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlaygroundModule {
}
