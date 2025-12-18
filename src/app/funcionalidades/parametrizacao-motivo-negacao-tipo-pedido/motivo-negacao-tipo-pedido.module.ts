import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AscSelectModule } from "app/shared/components/asc-select/asc-select.module";
import { ComponentModule } from "app/shared/components/component.module";
import { AscMessageErrorModule } from "app/shared/components/message-error/asc-message-error.module";
import { AscMultiSelectModule } from "app/shared/components/multiselect/asc-multiselect.module";
import { PipeModule } from "app/shared/pipes/pipe.module";
import { PrimeNGModule } from "app/shared/primeng.module";
import { MotivoNegacaoTipoPedidoRoutingModule } from "./motivo-negacao-tipo-pedido.routing.module";
import { NgModule } from "@angular/core";
import { MotivoNegacaoTipoPedidoHomeComponent } from "./motivo-negacao-tipo-pedido-home/motivo-negacao-tipo-pedido-home.component";
import { MotivoNegacaoTipoPedidoListarComponent } from "./motivo-negacao-tipo-pedido-listar/motivo-negacao-tipo-pedido-listar.component";
import { MotivoNegacaoTipoPedidoFormComponent } from "./motivo-negacao-tipo-pedido-form/motivo-negacao-tipo-pedido-form.component";
import { MotivoNegacaoTipoPedidoService } from '../../shared/services/comum/motivo-negacao-tipo-pedido.service';
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module'; 

@NgModule({
    imports: [
        CommonModule,
        MotivoNegacaoTipoPedidoRoutingModule,
        ComponentModule,
        PrimeNGModule,
        AscSelectModule,
        ReactiveFormsModule,
        AscMessageErrorModule,
        FormsModule,
        PipeModule,
        AscMultiSelectModule,
        DscCaixaModule
    ],
  declarations: [
    MotivoNegacaoTipoPedidoHomeComponent,
    MotivoNegacaoTipoPedidoListarComponent,
    MotivoNegacaoTipoPedidoFormComponent
  ],
  providers:[MotivoNegacaoTipoPedidoService]
})
export class MotivoNegacaoTipoPedidoModule { }