import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginaInicialAlterarComponent} from './cadastro/pagina-inicial-alterar/pagina-inicial-alterar.component';
import {PaginaInicialComponent} from './cadastro/pagina-inicial/pagina-inicial.component';
import {EtapaSelecaoDependenteComponent} from './cadastro/etapa-selecao-dependente/etapa-selecao-dependente.component';
import {EtapaTipoDependenteComponent} from './cadastro/etapa-tipo-dependente/etapa-tipo-dependente.component';
import {
    EtapaComplementoDependenteComponent
} from './cadastro/etapa-complemento-dependente/etapa-complemento-dependente.component';
import {EtapaDadosDependenteComponent} from './cadastro/etapa-dados-dependente/etapa-dados-dependente.component';
import {AlterarDependenteComponent} from './cadastro/alterar-dependente/alterar-dependente.component';
import {CadastroDependenteComponent} from './cadastro/cadastro-dependente/cadastro-dependente.component';
import {DependenteRoutingModule} from './dependente.routing.module'
import {InputTextareaModule} from "primeng/inputtextarea";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {MessageModule as PrimeMessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { NgxMaskModule } from 'ngx-mask';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../shared/components/asc-stepper/asc-stepper.module';
import {ComponentModule} from '../../shared/components/component.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AscPedidoModule} from "../../shared/components/asc-pedido/asc-pedido.module";
import {AscButtonsModule} from "../../shared/components/asc-buttons/asc-buttons.module";
import {MessageModule} from "../../shared/components/messages/message.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {PrimeNGModule} from '../../shared/primeng.module';
import {ReciboModule} from './recibo/recibo.module';
import {AcompanhamentoDependenteModule} from './acompanhamento-dependente/acompanhamento-dependente.module'
import {EtapaResumoIncluirComponent} from './cadastro/etapa-resumo-incluir/etapa-resumo-incluir.component'
import {PipeModule} from 'app/shared/pipes/pipe.module';
import {EtapaResumoAlterarComponent} from "./cadastro/etapa-resumo-alterar/etapa-resumo-alterar.component";
import {AscCardModule} from "../../shared/components/asc-card/asc-card.module";

@NgModule({
    imports: [
        CommonModule,
        NgxMaskModule,
        AscStepperModule,
        CdkStepperModule,
        ComponentModule,
        ReactiveFormsModule,
        AscPedidoModule,
        AscButtonsModule,
        MessageModule,
        PrimeNGModule,
        DialogModule,
        PrimeMessageModule,
        OverlayPanelModule,
        AscSelectModule,
        InputTextareaModule,
        InputTextModule,
        ProgressSpinnerModule,
        DependenteRoutingModule,
        ReciboModule,
        PipeModule,
        AcompanhamentoDependenteModule,
        AscCardModule
    ],
    declarations: [
        PaginaInicialComponent,
        PaginaInicialAlterarComponent,
        CadastroDependenteComponent,
        EtapaTipoDependenteComponent,
        EtapaComplementoDependenteComponent,
        EtapaDadosDependenteComponent,
        EtapaResumoIncluirComponent,
        EtapaResumoAlterarComponent,
        EtapaSelecaoDependenteComponent,
        AlterarDependenteComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DependenteModule {
}
