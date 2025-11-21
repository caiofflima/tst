import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
    InputTextareaModule,

} from "primeng/inputtextarea";
import {
    ProgressSpinnerModule,

} from "primeng/progressspinner";
import {
    InputTextModule,

} from "primeng/inputtext";
import {
    DialogModule,

} from "primeng/dialog";
import {
    MessageModule as PrimeMessageModule,

} from "primeng/message";
import {
    OverlayPanelModule,

} from "primeng/overlaypanel";

// import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../shared/components/asc-stepper/asc-stepper.module';
import {ComponentModule} from '../../shared/components/component.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AscPedidoModule} from "../../shared/components/asc-pedido/asc-pedido.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";
import {MessageModule} from "../../shared/components/messages/message.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {PrimeNGModule} from '../../shared/primeng.module';
import {PipeModule} from 'app/shared/pipes/pipe.module';
import {AscCardModule} from "../../shared/components/asc-card/asc-card.module";
import { PaginaInicialAdesaoTitularComponent } from './pagina-inicial/pagina-inicial-adesao-titular.component';
import { AdesaoTitularRoutingModule } from './adesao-titular.routing.module';
import { EtapaTipoTitularComponent } from './etapa-tipo-titular/etapa-tipo-titular.component';
import { CadastroTitularComponent } from './cadastro/cadastro-titular.component';
import { EtapaContatoTitularComponent } from './etapa-contato-titular/etapa-contato-titular.component';
import { EtapaComplementotitularComponent } from './etapa-complemento-titular/etapa-complemento-titular.component';
import { EtapaResumoTitularComponent } from './etapa-resumo-titular/etapa-resumo-titular.component';
import { AcompanhamentoModule } from '../acompanhamento/acompanhamento.module';
import { AscCardAcompanhamentoConteudoModule } from 'app/shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module';
import { AscDocumentosModule } from 'app/shared/components/asc-pedido/asc-documentos/asc-documentos.module';
import { PlaygroundModule } from 'app/shared/playground/playground.module';
import { AscAcompanhamentoProcessoModule } from 'app/shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module';
import { AscModalModule } from 'app/shared/components/asc-modal/asc-modal.module';
import { AcompanhamentoAdesaoComponent } from './acompanhamento-adesao/acompanhamento-adesao.component';

@NgModule({
    imports: [
        CommonModule,
        // NgxMaskDirective, NgxMaskPipe,
        AscStepperModule,
        CdkStepperModule,
        ComponentModule,
        ReactiveFormsModule,
        AscPedidoModule,
        AscButtonsModule,
        MessageModule,
        PrimeNGModule,
        DialogModule,
        PrimeMessageModule,
        OverlayPanelModule,
        AscSelectModule,
        InputTextareaModule,
        InputTextModule,
        ProgressSpinnerModule,
        AdesaoTitularRoutingModule,
        AcompanhamentoModule,
        AscAcompanhamentoProcessoModule,
        AscCardAcompanhamentoConteudoModule,
        PipeModule,
        AscCardModule,
        AscModalModule,
        AscDocumentosModule,
        PlaygroundModule
    ],

    declarations: [
        PaginaInicialAdesaoTitularComponent,
        EtapaTipoTitularComponent,
        CadastroTitularComponent,
        EtapaContatoTitularComponent,
        EtapaComplementotitularComponent,
        EtapaResumoTitularComponent,
        AcompanhamentoAdesaoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdesaoTitularModule {
}
