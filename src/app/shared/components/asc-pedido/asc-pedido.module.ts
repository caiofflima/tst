import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscDocumentosModule } from "./asc-documentos/asc-documentos.module";
import { AscDocumentoCardComponent } from "./asc-documentos/documento-card/asc-documento-card.component";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { ComponentModule } from "../component.module";
import { InputMaskModule } from "primeng/inputmask";
import { RouterModule } from "@angular/router";
import { AscBeneficiarioPedido } from "./asc-steps/asc-beneficiario-pedido/asc-beneficiario-pedido.component";
import { AscStepsModule } from "./asc-steps/asc-steps.module";
import { AscDocumentosRequeridosPedidoComponent } from "./asc-steps/asc-documentos-requeridos-pedido/asc-documentos-requeridos-pedido.component";
import { AscCardBeneficiarioComponent } from "./asc-resumo/asc-card-beneficiario/asc-card-beneficiario.component";
import { AscCardInfoAdicionalComponent } from "./asc-resumo/asc-card-info-adicional/asc-card-info-adicional.component";
import { AscResumoModule } from "./asc-resumo/asc-resumo.module";
import { AscFinalidadeComponent } from "./asc-steps/asc-finalidade-beneficiario/asc-finalidade.component";
import { ProcedimentoFormComponent } from "./asc-steps/procedimento-form/procedimento-form.component";
import { AscProcedimentoPedidoComponent } from "./asc-steps/procedimento/asc-procedimento-pedido.component";
import { AscProfissionalPedidoComponent } from "./asc-steps/asc-profissional-pedido/asc-profissional-pedido.component";
import { AscCardDadosProcessoComponent } from "./asc-resumo/asc-card-dados-processo/asc-card-dados-processo.component";
import { AscCardProcedimentoComponent } from "./asc-resumo/asc-card-procedimento/asc-card-procedimento.component";
import { AscProfissionalExecutanteComponent } from "./asc-resumo/asc-profissional-executante/asc-profissional-executante.component";
import { AscModalOcorrenciaComponent } from "./asc-modal-ocorrencia/asc-modal-ocorrencia.component";
import { AscModalModule } from "../asc-modal/asc-modal.module";
import { AscSelectModule } from "../asc-select/asc-select.module";
import { AscDependentesCardComponent } from './asc-dependentes/asc-dependentes-card/asc-dependentes-card.component';
import {PipeModule} from "../../pipes/pipe.module";
import { AscDadosContatoCardComponent } from './asc-dados-contato-card/asc-dados-contato-card.component';
import { AscDadosEnderecoCardComponent } from './asc-dados-endereco-card/asc-dados-endereco-card.component';

@NgModule({
    imports: [
        CommonModule,
        AscDocumentosModule,
        CdkStepperModule,
        ReactiveFormsModule,
        ComponentModule,
        InputMaskModule,
        RouterModule,
        AscStepsModule,
        AscResumoModule,
        AscModalModule,
        AscSelectModule,
        PipeModule
    ],
  declarations: [AscModalOcorrenciaComponent, 
                 AscDependentesCardComponent, 
                 AscDadosContatoCardComponent,
                 AscDadosEnderecoCardComponent
                ],
    exports: [
        AscDocumentoCardComponent,
        AscBeneficiarioPedido,
        AscDocumentosRequeridosPedidoComponent,
        AscCardBeneficiarioComponent,
        AscCardInfoAdicionalComponent,
        AscFinalidadeComponent,
        ProcedimentoFormComponent,
        AscProcedimentoPedidoComponent,
        AscProfissionalPedidoComponent,
        AscCardDadosProcessoComponent,
        AscCardProcedimentoComponent,
        AscProfissionalExecutanteComponent,
        AscModalOcorrenciaComponent,
        AscDependentesCardComponent,
        AscDadosContatoCardComponent,
        AscDadosEnderecoCardComponent
    ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AscPedidoModule {
}
