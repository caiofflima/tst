import {CUSTOM_ELEMENTS_SCHEMA,NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginaInicialComponent} from './pagina-inicial/pagina-inicial.component';
import {EtapaMotivoRenovacaoComponent} from './etapa-motivo-renovacao/etapa-motivo-renovacao.component';

import {RenovarDependenteComponent} from './renovar-dependente/renovar-dependente.component';
import {RenovarDependenteRoutingModule} from './renovar-dependente.routing.module'
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageModule as PrimeMessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {InputTextareaModule} from "primeng/inputtextarea";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../../shared/components/asc-stepper/asc-stepper.module';
import {ComponentModule} from '../../../shared/components/component.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AscPedidoModule} from "../../../shared/components/asc-pedido/asc-pedido.module";
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import {MessageModule} from "../../../shared/components/messages/message.module";
import {AscSelectModule } from "../../../shared/components/asc-select/asc-select.module";
import {PrimeNGModule} from '../../../shared/primeng.module';
import {ReciboModule} from '../recibo/recibo.module';
import {AcompanhamentoDependenteModule} from '../acompanhamento-dependente/acompanhamento-dependente.module'
import {EtapaResumoRenovarComponent} from './etapa-resumo-renovar/etapa-resumo-renovar.component'
import {AscCardModule} from "../../../shared/components/asc-card/asc-card.module";
import {PipeModule} from "../../../shared/pipes/pipe.module";

@NgModule({
    imports: [
        CommonModule,
        NgxMaskDirective, NgxMaskPipe,
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
        RenovarDependenteRoutingModule,
        ReciboModule,
        AcompanhamentoDependenteModule,
        AscCardModule,
        PipeModule
    ],
  declarations: [
    PaginaInicialComponent,
    RenovarDependenteComponent,
    EtapaMotivoRenovacaoComponent,
    EtapaResumoRenovarComponent
  ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class RenovarDependenteModule {
}
