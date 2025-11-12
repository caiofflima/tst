import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorizacaoPreviaRoutingModule } from './autorizacao-previa.routing.module';
import { PaginaInicialAprComponent } from './pagina-inicial/pagina-inicial-apr.component';
import { FinalidadeBeneficiarioComponent } from './finalidade-beneficiario/finalidade-beneficiario.component';
import { ProcedimentoComponent } from './procedimento/procedimento.component';
import { ProfissionalComponent } from './profissional/profissional.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { ResumoComponent } from './resumo/resumo.component';
import { SolicitacaoComponent } from './solicitacao/solicitacao.component';
import { NgxMaskModule } from 'ngx-mask';
import { AutorizacaoPreviaBaseComponent } from './autorizacao-previa-base/autorizacao-previa-base.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { AscStepperModule } from '../../../shared/components/asc-stepper/asc-stepper.module';
import { ComponentModule } from '../../../shared/components/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PedidoEnviadoComponent } from './pedido-enviado/pedido-enviado.component';
import { AscSelectModule } from '../../../shared/components/asc-select/asc-select.module';
import {  InputTextareaModule} from 'primeng/inputtextarea';
import {  InputTextModule} from 'primeng/inputtext';
import {  MessageModule} from 'primeng/message';
import {  MessagesModule} from 'primeng/messages';
import {  OverlayPanelModule} from 'primeng/overlaypanel';
import {  ProgressSpinnerModule} from 'primeng/progressspinner';

import { PrimeNGModule } from '../../../shared/primeng.module';
import { ProcedimentoFormComponent } from './procedimento-form/procedimento-form.component';
import { PipeModule } from "../../../shared/pipes/pipe.module";
import { AscDocumentosModule } from "../../../shared/components/asc-pedido/asc-documentos/asc-documentos.module";
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import {AscCardModule} from "../../../shared/components/asc-card/asc-card.module";

@NgModule({
    imports: [
        CommonModule,
        AutorizacaoPreviaRoutingModule,
        NgxMaskModule,
        AscStepperModule,
        CdkStepperModule,
        ComponentModule,
        ReactiveFormsModule,
        AscSelectModule,
        InputTextModule,
        PrimeNGModule,
        ProgressSpinnerModule,
        InputTextareaModule,
        FormsModule,
        OverlayPanelModule,
        MessagesModule,
        MessageModule,
        AscDocumentosModule,
        PipeModule,
        AscButtonsModule,
        AscCardModule,
    ],
    declarations: [
        PaginaInicialAprComponent,
        FinalidadeBeneficiarioComponent,
        ProcedimentoComponent,
        ProfissionalComponent,
        DocumentosComponent,
        ResumoComponent,
        SolicitacaoComponent,
        AutorizacaoPreviaBaseComponent,
        PedidoEnviadoComponent,
        ProcedimentoFormComponent,
    ],
    exports: [
        ProcedimentoFormComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutorizacaoPreviaModule {
}
