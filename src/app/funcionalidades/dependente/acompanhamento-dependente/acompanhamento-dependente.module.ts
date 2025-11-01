import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {AcompanhamentoDependenteComponent} from "./acompanhamento-dependente.component";
import {
    AscAcompanhamentoProcessoModule
} from "../../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import {
    AscCardAcompanhamentoConteudoModule
} from "../../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import {AscResumoModule} from "../../../shared/components/asc-pedido/asc-resumo/asc-resumo.module";
import {PlaygroundModule} from "../../../shared/playground/playground.module";
import {AscDocumentosModule} from "app/shared/components/asc-pedido/asc-documentos/asc-documentos.module";
import {AscPedidoModule} from "../../../shared/components/asc-pedido/asc-pedido.module";

@NgModule({
    imports: [
        CommonModule,
        AscAcompanhamentoProcessoModule,
        AscCardAcompanhamentoConteudoModule,
        AscResumoModule,
        PlaygroundModule,
        AscDocumentosModule,
        AscPedidoModule
    ],
    declarations: [AcompanhamentoDependenteComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AcompanhamentoDependenteModule {
}
