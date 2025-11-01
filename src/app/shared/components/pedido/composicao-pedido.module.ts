import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CheckboxModule} from 'primeng/checkbox';
import {TableModule} from 'primeng/table';
import {DialogModule,} from 'primeng/dialog';
import {DropdownModule,} from 'primeng/dropdown';
import {FileUploadModule,} from 'primeng/fileupload';
import {InputMaskModule,} from 'primeng/inputmask';
import {InputTextareaModule,} from 'primeng/inputtextarea';
import {OverlayPanelModule,} from 'primeng/overlaypanel';
import {ProgressBarModule,} from 'primeng/progressbar';
import {SharedModule} from 'primeng/api';
import {TabViewModule,} from 'primeng/tabview';

import {PipeModule} from '../../../../app/shared/pipes/pipe.module';
import {ComponentModule} from '../../../../app/shared/components/component.module';
import {AscMessageErrorModule} from '../../../../app/shared/components/message-error/asc-message-error.module';
import {AscVisDadosTitularComponent} from '../../../../app/shared/components/pedido/vis-dados-titular/vis-dados-titular.component';
import {AscVisDadosProcessoComponent} from '../../../../app/shared/components/pedido/vis-dados-processo/vis-dados-processo.component';
import {AscVisDadosBeneficiarioComponent} from '../../../../app/shared/components/pedido/vis-dados-beneficiario/vis-dados-beneficiario.component';
import {AscAtualizarSituacaoProcessoComponent} from '../../../../app/shared/components/pedido/atualizar-situacao-processo/atualizar-situacao-processo.component';
import {AscHistoricoProcessoComponent} from '../../../../app/shared/components/pedido/historico-processo/historico-processo.component';
import {AscMensagensEnviadasComponent} from '../../../../app/shared/components/pedido/mensagens-enviadas/mensagens-enviadas.component';
import {AscRelacaoDocumentosUploadComponent} from '../../../../app/shared/components/pedido/relacao-documentos-upload/relacao-documentos-upload.component';
import {AscSolicitarDocumentacaoAdicionalComponent} from '../../../../app/shared/components/pedido/modais/solicitar-documentacao-adicional/solicitar-documentacao-adicional.component';
import {AscAnexosPedidoComponent} from '../../../../app/shared/components/pedido/anexos-pedido/anexos-pedido.component';
import {AscDadosGeraisComponent} from '../../../../app/shared/components/pedido/dados-gerais/dados-gerais.component';
import {AscNovaOcorrenciaComponent} from '../../../../app/shared/components/pedido/modais/nova-ocorrencia/nova-ocorrencia.component';
import {AscExibirOcorrenciaComponent} from '../../../../app/shared/components/pedido/modais/exibir-ocorrencia/exibir-ocorrencia.component';
import {SituacaoPedidoService} from '../../../../app/shared/services/comum/situacao-pedido.service';
import {SituacaoProcessoService} from '../../../../app/shared/services/comum/situacao-processo.service';
import {FileUploadService} from '../../../../app/shared/services/comum/file-upload.service';
import {HistoricoProcessoService} from '../../../../app/shared/services/comum/historico-processo.service';
import {ComposicaoPedidoService} from '../../../../app/shared/services/components/composicao-pedido.service';
import {MensagemPedidoService} from '../../../../app/shared/services/comum/mensagem-enviada.service';
import {AscMensagensEnviadasDetalharComponent} from './modais/mensagens-enviadas-detalhar/mensagens-enviadas-detalhar.component';
import {AscProgressoPrazoComponent} from './progresso-prazo/progresso-prazo.component';
import {AscProcedimentosPedidoComponent} from './procedimentos-pedido/procedimentos-pedido.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        SharedModule,
        TabViewModule,
        DropdownModule,
        CheckboxModule,
        InputMaskModule,
        FileUploadModule,
        ProgressBarModule,
        PipeModule,
        DialogModule,
        OverlayPanelModule,
        AscMessageErrorModule,
        ComponentModule,
        InputTextareaModule
    ],
  declarations: [
    AscVisDadosTitularComponent,
    AscVisDadosProcessoComponent,
    AscVisDadosBeneficiarioComponent,
    AscAtualizarSituacaoProcessoComponent,
    AscHistoricoProcessoComponent,
    AscMensagensEnviadasComponent,
    AscMensagensEnviadasDetalharComponent,
    AscRelacaoDocumentosUploadComponent,
    AscDadosGeraisComponent,
    AscAnexosPedidoComponent,
    AscProgressoPrazoComponent,
    AscSolicitarDocumentacaoAdicionalComponent,
    AscNovaOcorrenciaComponent,
    AscExibirOcorrenciaComponent,
    AscProcedimentosPedidoComponent,
  ],
  exports: [
    AscVisDadosTitularComponent,
    AscVisDadosProcessoComponent,
    AscVisDadosBeneficiarioComponent,
    AscAtualizarSituacaoProcessoComponent,
    AscHistoricoProcessoComponent,
    AscMensagensEnviadasComponent,
    AscMensagensEnviadasDetalharComponent,
    AscRelacaoDocumentosUploadComponent,
    AscDadosGeraisComponent,
    AscAnexosPedidoComponent,
    AscSolicitarDocumentacaoAdicionalComponent,
    AscNovaOcorrenciaComponent,
    AscExibirOcorrenciaComponent,
    AscProcedimentosPedidoComponent,
    AscMessageErrorModule
  ],
  providers: [SituacaoPedidoService,
    SituacaoProcessoService,
    FileUploadService,
    HistoricoProcessoService,
    ComposicaoPedidoService,
    MensagemPedidoService
  ],
  entryComponents: []
})
export class ComposicaoPedidoModule {
}
