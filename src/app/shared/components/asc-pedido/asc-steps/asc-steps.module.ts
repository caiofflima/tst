import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscBeneficiarioPedido } from "./asc-beneficiario-pedido/asc-beneficiario-pedido.component";
import { AscDocumentosRequeridosPedidoComponent } from "./asc-documentos-requeridos-pedido/asc-documentos-requeridos-pedido.component";
import { ComponentModule } from "../../component.module";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { AscDocumentosModule } from "../asc-documentos/asc-documentos.module";
import { AscButtonsModule } from "../../asc-buttons/asc-buttons.module";
import { AscFinalidadeComponent } from "./asc-finalidade-beneficiario/asc-finalidade.component";
import { PipeModule } from "../../../pipes/pipe.module";
import { ProcedimentoFormComponent } from "./procedimento-form/procedimento-form.component";
import { AscSelectModule } from "../../asc-select/asc-select.module";
import { AscProcedimentoPedidoComponent } from "./procedimento/asc-procedimento-pedido.component";
import { AscProfissionalPedidoComponent } from "./asc-profissional-pedido/asc-profissional-pedido.component";
import { AscTipoProcedimentoFormModule } from "../asc-tipo-procedimento-form/asc-tipo-procedimento-form.module";
import {DropdownModule} from 'primeng/dropdown';
import { ProgressBarModule} from 'primeng/progressbar';

@NgModule({
    imports: [
        CommonModule,
        AscDocumentosModule,
        CdkStepperModule,
        ReactiveFormsModule,
        ComponentModule,
        InputMaskModule,
        RouterModule,
        AscButtonsModule,
        PipeModule,
        AscSelectModule,
        InputTextModule,
        AscTipoProcedimentoFormModule,
        DropdownModule, ProgressBarModule
    ],
  declarations: [
    AscBeneficiarioPedido,
    AscDocumentosRequeridosPedidoComponent,
    AscFinalidadeComponent,
    ProcedimentoFormComponent,
    AscProcedimentoPedidoComponent,
    AscProfissionalPedidoComponent,
  ],
  exports: [
    AscBeneficiarioPedido,
    AscDocumentosRequeridosPedidoComponent,
    AscFinalidadeComponent,
    ProcedimentoFormComponent,
    AscProcedimentoPedidoComponent,
    AscProfissionalPedidoComponent,
    DropdownModule, ProgressBarModule
  ]
})
export class AscStepsModule {
}
