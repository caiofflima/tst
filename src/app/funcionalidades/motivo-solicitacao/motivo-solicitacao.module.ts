import { NgModule } from "@angular/core";
import { MotivoSolicitacaoComponent } from "./motivo-solicitacao-home/motivo-solicitacao-home.component";
import { BaseModule } from "app/shared/base.module";
import { MotivoSolicitacaoRoutingModule } from "./motivo-solicitacao.routing.module";
import { MotivoSolicitacaoListarComponent } from "./motivo-solicitacao-listar/motivo-solicitacao-listar.component";
import { MotivoSolicitacaoFormComponent } from "./motivo-solicitacao-form/motivo-solicitacao-form.component";
import { MotivoSolicitacaoTipoPedidoService } from "app/shared/services/comum/motivo-solicitacao-tipo-pedido.service";


@NgModule({
    declarations: [
        MotivoSolicitacaoComponent,
        MotivoSolicitacaoListarComponent,
        MotivoSolicitacaoFormComponent
    ],
    imports: [
        BaseModule,
        MotivoSolicitacaoRoutingModule
    ],
    exports: [],
    providers: [MotivoSolicitacaoTipoPedidoService]
})
export class MotivoSolicitacaoModule{}