import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentModule} from '../../component.module';
import {AscCardBeneficiarioComponent} from "./asc-card-beneficiario/asc-card-beneficiario.component";
import {AscCardInfoAdicionalComponent} from "./asc-card-info-adicional/asc-card-info-adicional.component";
import {MessageModule} from "../../messages/message.module";
import {AscCardDadosProcessoComponent} from "./asc-card-dados-processo/asc-card-dados-processo.component";
import {AscStepperModule} from "../../asc-stepper/asc-stepper.module";
import {AscCardProcedimentoComponent} from "./asc-card-procedimento/asc-card-procedimento.component";
import {AscStepsModule} from "../asc-steps/asc-steps.module";
import {AscProfissionalExecutanteComponent} from "./asc-profissional-executante/asc-profissional-executante.component";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ProgressBarModule} from "primeng/progressbar";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {PipeModule} from "../../../pipes/pipe.module";
import {AscProcedimentoReembolsoModule} from "../asc-card-procedimento/asc-procedimento-reembolso/asc-procedimento-reembolso.module";
import {AscCardDocumentoFiscalComponent} from "./asc-card-documento-fiscal/asc-card-documento-fiscal.component";
import {AscCardModule} from "../../asc-card/asc-card.module";
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    MessageModule,
    AscStepperModule,
    AscStepsModule,
    ReactiveFormsModule,
    InputTextModule,
    PipeModule,
    AscProcedimentoReembolsoModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    AscCardModule,
    DscCaixaModule
  ],
  declarations: [
    AscCardBeneficiarioComponent,
    AscCardInfoAdicionalComponent,
    AscCardDadosProcessoComponent,
    AscCardProcedimentoComponent,
    AscProfissionalExecutanteComponent,
    AscCardDocumentoFiscalComponent
  ],
  exports: [
    AscCardBeneficiarioComponent,
    AscCardInfoAdicionalComponent,
    AscCardDadosProcessoComponent,
    AscCardProcedimentoComponent,
    AscProfissionalExecutanteComponent,
    AscCardDocumentoFiscalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AscResumoModule {
}
