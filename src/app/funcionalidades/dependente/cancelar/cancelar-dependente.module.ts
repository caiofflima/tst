import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginaInicialComponent} from './pagina-inicial/pagina-inicial.component';
import {EtapaMotivoDependenteComponent} from './etapa-motivo-beneficiario/etapa-motivo-beneficiario.component';

import {CancelarDependenteComponent} from './cancelar-dependente/cancelar-dependente.component';
import {CancelarDependenteRoutingModule} from './cancelar-dependente.routing.module'
import {InputTextareaModule, } from "primeng/inputtextarea";
import {ProgressSpinnerModule, } from "primeng/progressspinner";
import {InputTextModule, } from "primeng/inputtext";
import {DialogModule, } from "primeng/dialog";
import {MessageModule as PrimeMessageModule, } from "primeng/message";
import {OverlayPanelModule, } from "primeng/overlaypanel";
import {TextMaskModule} from 'angular2-text-mask';
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
import {EtapaResumoCancelarComponent} from './etapa-resumo-cancelar/etapa-resumo-cancelar.component'
import {PipeModule} from "../../../shared/pipes/pipe.module";
import {AscCardModule} from "../../../shared/components/asc-card/asc-card.module";

@NgModule({
    imports: [
        CommonModule,
        TextMaskModule,
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
        CancelarDependenteRoutingModule,
        ReciboModule,
        AcompanhamentoDependenteModule,
        PipeModule,
        AscCardModule
    ],
  declarations: [
    PaginaInicialComponent,
    CancelarDependenteComponent,
    EtapaMotivoDependenteComponent,
    EtapaResumoCancelarComponent
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CancelarDependenteModule {
}
