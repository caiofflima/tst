import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TemplatesModule} from "../../arquitetura/shared/templates/templates.module";
import {DirectivesModule} from "../../arquitetura/shared/directives/directives.module";
import {TabsModule} from "ngx-bootstrap/tabs";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {RelatorioAnaliticoRoutingModule} from "./analitico/relatorio-analitico.routing.module";
import {
    RelatorioControlePrazosProcessosRoutingModule
} from "./controle-prazos-processos/relatorio-controle-prazos-processos.routing.module";
import {
    RelatorioJuntaMedicaOdontologicaRoutingModule
} from "./junta-medica-odontologica/relatorio-junta-medica-odontologica.routing.module";
import {
    RelatorioProcedimentosSolicitadosPorProfissionalRoutingModule
} from "./procedimentos-solicitados-por-profissional/relatorio-procedimentos-solicitados-por-profissional.routing.module";
import {
    RelatorioTempoMedioProcessosRoutingModule
} from "./tempo-medio-processos/relatorio-tempo-medio-processos.routing.module";
import {RelatorioAnaliticoListarComponent} from "./analitico/analitico-listar/analitico-listar.component";
import {
    RelatorioControlePrazosProcessosListarComponent
} from "./controle-prazos-processos/controle-prazos-processos-listar/controle-prazos-processos-listar.component";
import {
    RelatorioControlePrazosProcessosHomeComponent
} from "./controle-prazos-processos/controle-prazos-processos-home/controle-prazos-processos-home.component";
import {
    RelatorioJuntaMedicaOdontologicaListarComponent
} from "./junta-medica-odontologica/junta-medica-odontologica-listar/junta-medica-odontologica-listar.component";
import {
    RelatorioJuntaMedicaOdontologicaHomeComponent
} from "./junta-medica-odontologica/junta-medica-odontologica-home/junta-medica-odontologica-home.component";
import {
    RelatorioProcedimentosSolicitadosPorProfissionalListarComponent
} from "./procedimentos-solicitados-por-profissional/procedimentos-solicitados-por-profissional-listar/procedimentos-solicitados-por-profissional-listar.component";
import {
    RelatorioProcedimentosSolicitadosPorProfissionalHomeComponent
} from "./procedimentos-solicitados-por-profissional/procedimentos-solicitados-por-profissional-home/procedimentos-solicitados-por-profissional-home.component";
import {
    RelatorioTempoMedioProcessosListarComponent
} from "./tempo-medio-processos/tempo-medio-processos-listar/tempo-medio-processos-listar.component";
import {
    RelatorioTempoMedioProcessosHomeComponent
} from "./tempo-medio-processos/tempo-medio-processos-home/tempo-medio-processos-home.component";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {PrimeNGModule} from "app/shared/primeng.module";
import {AscMessageErrorModule} from "../../shared/components/message-error/asc-message-error.module";
import {ComponentModule} from "../../shared/components/component.module";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { DscCaixaModule } from "app/shared/dsc-caixa/dsc-caixa.module";
import { DscInputComponent } from 'sidsc-components/dsc-input';

@NgModule({
    imports: [
        CommonModule,
        RelatorioAnaliticoRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskDirective, NgxMaskPipe,
        PipeModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PrimeNGModule,
        TableModule,
        DscInputComponent
    ],
    declarations: [
        RelatorioAnaliticoListarComponent
    ]
})
export class RelatorioAnaliticoModule {
}

@NgModule({
    imports: [
        CommonModule,
        RelatorioControlePrazosProcessosRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskDirective, NgxMaskPipe,
        PipeModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PrimeNGModule,
        ComponentModule,
        ProgressSpinnerModule,
        TableModule,
        DscCaixaModule,
        DscInputComponent
    ],
    declarations: [
        RelatorioControlePrazosProcessosListarComponent,
        RelatorioControlePrazosProcessosHomeComponent
    ]
})
export class RelatorioControlePrazosModule {
}

@NgModule({
    imports: [
        CommonModule,
        RelatorioJuntaMedicaOdontologicaRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskDirective, NgxMaskPipe,
        PipeModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PrimeNGModule,
        ComponentModule,
        TableModule,
        DscCaixaModule,
        DscInputComponent
    ],
    declarations: [
        RelatorioJuntaMedicaOdontologicaListarComponent,
        RelatorioJuntaMedicaOdontologicaHomeComponent
    ]
})
export class RelatorioJuntaMedicaOdontologicaModule {
}


@NgModule({
    imports: [
        CommonModule,
        RelatorioProcedimentosSolicitadosPorProfissionalRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskDirective, NgxMaskPipe,
        PipeModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PrimeNGModule,
        ComponentModule,
        ProgressSpinnerModule,
        TableModule,
        DscCaixaModule,
        DscInputComponent
    ],
    declarations: [
        RelatorioProcedimentosSolicitadosPorProfissionalListarComponent,
        RelatorioProcedimentosSolicitadosPorProfissionalHomeComponent
    ]
})
export class RelatorioProcedimentosSolicitadosPorProfissionalModule {
}


@NgModule({
    imports: [
        CommonModule,
        RelatorioTempoMedioProcessosRoutingModule,
        DirectivesModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TabsModule.forRoot(),
        TemplatesModule,
        NgxMaskDirective, NgxMaskPipe,
        PipeModule,
        AscMultiSelectModule,
        AscMessageErrorModule,
        PrimeNGModule,
        ComponentModule,
        ProgressSpinnerModule,
        TableModule,
        DscCaixaModule,
        DscInputComponent
    ],
    declarations: [
        RelatorioTempoMedioProcessosListarComponent,
        RelatorioTempoMedioProcessosHomeComponent
    ]
})
export class RelatorioTempoMedioProcessosModule {
}
