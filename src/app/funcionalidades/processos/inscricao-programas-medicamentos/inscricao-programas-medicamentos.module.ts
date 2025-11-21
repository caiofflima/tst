import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InscricaoProgramasMedicamentosRoutingModule} from './inscricao-programas-medicamentos.routing.module';
import {PaginaIncialComponent} from './pagina-incial/pagina-incial.component';
import {SolicitacaoComponent} from './solicitacao/solicitacao.component';
import {PatologiaComponent} from './patologia/patologia.component';
import {ResumoComponent} from './resumo/resumo.component';
import {DialogModule,} from "primeng/dialog";
import {MessageModule as PrimeMessageModule} from "primeng/message";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import {
    InscricaoProgramasMendicamentosBaseComponent
} from './inscricao-programas-medicamentos-base/inscricao-programas-medicamentos-base.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {AscStepperModule} from '../../../shared/components/asc-stepper/asc-stepper.module';
import {ComponentModule} from '../../../shared/components/component.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AscPedidoModule} from "../../../shared/components/asc-pedido/asc-pedido.module";
import {AscButtonsModule} from "../../../shared/components/asc-buttons/asc-buttons.module";
import {MessageModule} from "../../../shared/components/messages/message.module";
import {ReciboComponent} from './recibo/recibo.component';

import {PrimeNGModule} from '../../../shared/primeng.module';
import {PipeModule} from "../../../shared/pipes/pipe.module";
import {AcompanhamentoPmdComponent} from "./acompanhamento-pmd/acompanhamento-pmd.component";
import {
    AscAcompanhamentoProcessoModule
} from "../../../shared/components/asc-acompanhamento-processo/asc-acompanhamento-processo.module";
import {
    AscCardAcompanhamentoConteudoModule
} from "../../../shared/components/asc-acompanhamento-processo/asc-card-acompanhamento-conteudo/asc-card-acompanhamento-conteudo.module";
import {AscModalModule} from "../../../shared/components/asc-modal/asc-modal.module";
import {AscDocumentosModule} from "../../../shared/components/asc-pedido/asc-documentos/asc-documentos.module";
import {PlaygroundModule} from "../../../shared/playground/playground.module";
import { AcompanhamentoModule } from '../../acompanhamento/acompanhamento.module';

@NgModule({
    imports: [
        CommonModule,
        InscricaoProgramasMedicamentosRoutingModule,
        NgxMaskDirective, NgxMaskPipe,
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
        PipeModule,
        AcompanhamentoModule,
        AscAcompanhamentoProcessoModule,
        AscCardAcompanhamentoConteudoModule,
        AscModalModule,
        AscDocumentosModule,
        PlaygroundModule
    ],
    declarations: [
        InscricaoProgramasMendicamentosBaseComponent,
        PaginaIncialComponent,
        SolicitacaoComponent,
        PatologiaComponent,
        ResumoComponent,
        ReciboComponent,
        AcompanhamentoPmdComponent
    ],
    exports: [
        ResumoComponent
    ]
})
export class InscricaoProgramasMedicamentosModule {
}
