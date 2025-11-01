import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParametrizacaoMotivoTipoPedidoHomeComponent} from "./parametrizacao-motivo-tipo-pedido-home/parametrizacao-motivo-tipo-pedido-home.component";
import {ParametrizacaoMotivoTipoPedidoListarComponent} from "./parametrizacao-motivo-tipo-pedido-listar/parametrizacao-motivo-tipo-pedido-listar.component";
import {ParametrizacaoMotivoTipoPedidoFormComponent} from "./parametrizacao-motivo-tipo-pedido-form/parametrizacao-motivo-tipo-pedido-form.component";
import {ParametrizacaoMotivoTipoPedidoRoutingModule} from "./parametrizacao-motivo-tipo-pedido.routing.module";
import {ComponentModule} from "../../shared/components/component.module";
import {PrimeNGModule} from "../../shared/primeng.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import { MotivoSolicitacaoTipoPedidoService } from 'app/shared/services/comum/motivo-solicitacao-tipo-pedido.service';

@NgModule({
    imports: [
        CommonModule,
        ParametrizacaoMotivoTipoPedidoRoutingModule,
        ComponentModule,
        PrimeNGModule,
        AscSelectModule,
        ReactiveFormsModule,
        AscMessageErrorModule,
        FormsModule,
        PipeModule,
        AscMultiSelectModule
    ],
  declarations: [
    ParametrizacaoMotivoTipoPedidoHomeComponent,
    ParametrizacaoMotivoTipoPedidoListarComponent,
    ParametrizacaoMotivoTipoPedidoFormComponent
  ],
  providers:[MotivoSolicitacaoTipoPedidoService]
})
export class ParametrizacaoMotivoTipoPedidoModule { }
