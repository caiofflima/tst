import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProgressSpinnerModule} from "primeng/progressspinner";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogModule} from "primeng/dialog";
import {MessageModule  as PrimeMessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { NgxMaskModule } from 'ngx-mask';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../../shared/components/asc-stepper/asc-stepper.module';
import {ComponentModule} from '../../../shared/components/component.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AscPedidoModule} from "../../../shared/components/asc-pedido/asc-pedido.module";
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import {MessageModule} from "../../../shared/components/messages/message.module";
import {AscSelectModule } from "../../../shared/components/asc-select/asc-select.module";
import {PrimeNGModule} from '../../../shared/primeng.module';
import {ReciboComponent} from './recibo.component';

@NgModule({
  imports: [
    CommonModule,
    NgxMaskModule,
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
  ],
  exports: [
    ReciboComponent,
  ],
  declarations: [
    ReciboComponent,
  ]
})
export class ReciboModule {
}
