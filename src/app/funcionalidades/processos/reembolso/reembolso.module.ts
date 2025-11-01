import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReembolsoRoutingModule} from './reembolso-routing.module';
import {BeneficiarioComponent} from './beneficiario/beneficiario.component';
import {FinalidadeComponent} from './finalidade/finalidade.component';
import {ReembolsoProcedimentoComponent} from './procedimento/reembolso-procedimento.component';
import {ProfissionalComponent} from './profissional/profissional.component';
import {DocumentosFiscalComponent} from './documentos-fiscal/documentos-fiscal.component';
import {DocumentosComponent} from './documentos/documentos.component';
import {ResumoComponent} from './resumo/resumo.component';
import {PaginaInicialComponent} from './pagina-inicial/pagina-inicial.component';
import {ReembolsoBaseComponent} from './reembolso-base/reembolso-base.component';

import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../../shared/components/asc-stepper/asc-stepper.module';
import {PrimeNGModule} from '../../../shared/primeng.module';
import {ComponentModule} from '../../../shared/components/component.module';
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import {AscStepsModule} from "../../../shared/components/asc-pedido/asc-steps/asc-steps.module";
import {ProcedimentoComponent} from "./procedimento/procedimento.component";
import {AscPedidoModule} from "../../../shared/components/asc-pedido/asc-pedido.module";
import {ReciboComponent} from "./recibo/recibo.component";
import {AscReciboModule} from "../../../shared/components/asc-pedido/asc-recibo/asc-recibo.module";
import {AscResumoModule} from "../../../shared/components/asc-pedido/asc-resumo/asc-resumo.module";
import {AscCardModule} from "../../../shared/components/asc-card/asc-card.module";

@NgModule({
  imports: [
    CommonModule,
    ReembolsoRoutingModule,
    AscStepperModule,
    CdkStepperModule,
    PrimeNGModule,
    ComponentModule,
    AscButtonsModule,
    AscStepsModule,
    AscPedidoModule,
    AscReciboModule,
    AscResumoModule,
    AscCardModule
  ],
  exports: [
    DocumentosFiscalComponent
  ],
  declarations: [
    BeneficiarioComponent,
    FinalidadeComponent,
    ReembolsoProcedimentoComponent,
    ProfissionalComponent,
    DocumentosFiscalComponent,
    DocumentosComponent,
    ResumoComponent,
    PaginaInicialComponent,
    ReembolsoBaseComponent,
    ProcedimentoComponent,
    ReciboComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReembolsoModule {
}
