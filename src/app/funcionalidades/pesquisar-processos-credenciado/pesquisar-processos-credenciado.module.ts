import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {TemplatesModule} from "../../../app/arquitetura/shared/templates/templates.module";
import {DirectivesModule} from "../../../app/arquitetura/shared/directives/directives.module";
import {PesquisarProcessosCredenciadoHomeComponent} from "./pesquisar-processos-credenciado-home/pesquisar-processos-credenciado-home.component";
import {PesquisarProcessosCredenciadoListarComponent} from "./pesquisar-processos-credenciado-listar/pesquisar-processos-credenciado-listar.component";
import {PesquisarProcessosCredenciadoRoutingModule} from "./pesquisar-processos-credenciado.routing.module";
import {PipeModule} from "../../../app/shared/pipes/pipe.module";
import {ResultadoPesquisaProcessosCredenciadoComponent} from "./resultado-pesquisa-processos-credenciado/resultado-pesquisa-processos-credenciado.component";
import {TextMaskModule} from "angular2-text-mask";
import { PesquisarProcessosV2Component } from './pesquisar-processos-v2/pesquisar-processos-v2.component';
import { PesquisarProcessosListaV2Component } from './pesquisar-processos-lista-v2/pesquisar-processos-lista-v2.component';
import {PrimeNGModule} from "../../../app/shared/primeng.module";
import { ComponentModule } from "../../../app/shared/components/component.module";
import {AscMultiSelectModule} from "../../../app/shared/components/multiselect/asc-multiselect.module";

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TemplatesModule,
    PesquisarProcessosCredenciadoRoutingModule,
    TextMaskModule,
    PipeModule,
    PrimeNGModule,
    ComponentModule,
    AscMultiSelectModule
  ],exports:[
    ResultadoPesquisaProcessosCredenciadoComponent
  ],
  declarations: [
    PesquisarProcessosCredenciadoHomeComponent,
    PesquisarProcessosCredenciadoListarComponent,
    ResultadoPesquisaProcessosCredenciadoComponent,
    PesquisarProcessosV2Component,
    PesquisarProcessosListaV2Component
  ]
})
export class PesquisarProcessosCredenciadoModule {
}
