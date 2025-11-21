import {CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatalistComponent} from './datalist/datalist.component';
import {
    AscProfissionalExecutanteComponent
} from '../../../app/shared/components/autorizacao-previa/profissional-executante/profissional-executante.component';
import {AngularMyDatePickerModule} from 'angular-mydatepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectivesModule} from '../../../app/arquitetura/shared/directives/directives.module';
import {AscMultiSelectModule} from './multiselect/asc-multiselect.module';
import {AscApresentadorComponent} from '../../../app/shared/components/apresentador/apresentador.component';
import {
    AscApresentadorArquivosComponent
} from '../../../app/shared/components/apresentador-arquivos/apresentador-arquivos.component';
import {
    AscVisualizadorArquivoComponent
} from '../../../app/shared/components/visualizador-arquivo/visualizador-arquivo.component';
import {
    AscExibirDadosBeneficiarioComponent
} from '../../../app/shared/components/exibir-dados-beneficiario/exibir-dados-beneficiario.component';
import {AscInputCpfCnpjComponent} from './asc-input/asc-input-cpf-cnpj/asc-input-cpf-cnpj.component';
import {AscInputDateComponent} from './asc-input/asc-input-date/asc-input-date.component';
import {AscInputTelefone} from './asc-input/asc-input-telefone/asc-input-telefone.component';
import {AscInputMoney} from './asc-input/asc-input-money/asc-input-money.component';

import {
    AscCampoEstaticoComponent,
    AscInputButtonComponent,
    AscInputEmailComponent,
    AscInputMoneyComponent,
    AscInputTextComponent
} from './asc-input/asc-input-text/asc-input-text.component';
import {AscSelectBeneficiarioComponent} from './asc-input/asc-select/asc-select-beneficiario.component';
import {
    AscSelectConselhoProfissionalComponent
} from './asc-input/asc-select/asc-select-conselho-profissional.component';
import {AscSelectFinalidadeComponent} from './asc-input/asc-select/asc-select-finalidade.component';
import {AscSelectMotivoNegacaoComponent} from './asc-input/asc-select/asc-select-motivo-negacao.component';
import {AscSelectMunicipioComponent} from './asc-input/asc-select/asc-select-municipio.component';
import {AscSelectSituacaoProcessoComponent} from './asc-input/asc-select/asc-select-situacao-processo.component';
import {AscSelectTipoBeneficiarioComponent} from './asc-input/asc-select/asc-select-tipo-beneficiario.component';
import {AscSelectTipoDependenteComponent} from './asc-input/asc-select/asc-select-tipo-dependente.component';
import {AscSelectEstadoCivilComponent} from './asc-input/asc-select/asc-select-estado-civil.component';
import {AscSelectTipoProcessoComponent} from './asc-input/asc-select/asc-select-tipo-processo.component';
import {AscSelectUfComponent} from './asc-input/asc-select/asc-select-uf.component';
import {AscTextAreaComponent} from './asc-input/asc-text-area/asc-text-area.component';
import {AscSelectBaseLayout} from './asc-input/asc-select/asc-select-base-layout.component';
import {PrimeNGModule} from '../primeng.module';
import {AscAutoCompleteBeneficiarioComponent} from './asc-auto-complete/asc-auto-complete-beneficiario.component';
import {AscAutoCompleteProcedimentoComponent} from './asc-auto-complete/asc-auto-complete-procedimento.component';
import {AscOnlyNumberDirective} from './directives/asc-only-number.directive';
import {AscSelectPatologiaComponent} from './asc-input/asc-select/asc-select-patologia.component';
import {AscSelectCaraterSolicitacaoComponent} from './asc-input/asc-select/asc-select-carater-solicitacao.component';
import {AscSelectMotivoCancelamentoComponent} from './asc-input/asc-select/asc-select-motivo-cancelamento.component';
import {InputTextModule} from "primeng/inputtext";
import {InputError} from "./asc-input/base-input.component";
import {AscUserInfoComponent} from "./asc-user-info/asc-user-info.component";
import {AscModalModule} from "./asc-modal/asc-modal.module";
import { AscSelectBeneficiarioExtratoComponent } from './asc-input/asc-select/asc-select-beneficiario-extrato.component';
import { AscSelectBeneficiarioAtivoCanceladoComponent } from './asc-input/asc-select/asc-select-beneficiario-ativo-cancelado';
import { AscSelectBeneficiarioRenovacaoComponent } from './asc-input/asc-select/asc-select-beneficiario-renovacao.component';
import { AscInputErrorComponent } from './asc-input/asc-input-error/asc-input-error.component';
import { AscSelectTiposOcorenciaComponent } from './asc-input/asc-select/asc-select-tipos-ocorrencia.component';
import { AscSelectSituacaoProcessoOcorrenciaComponent } from './asc-input/asc-select/asc-select-situacao-processo-ocorrencia';
import {TableModule} from 'primeng/table';
import { AscListagemAnexosComponent } from './listagem-anexos/listagem-anexos.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { AscSelectFinalidadeAdesaoComponent } from './asc-input/asc-select/asc-select-finalidade-adesao.component';
import { BaseLayoutFormComponent } from './base-layout/base-layout-form/base-layout-form.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BaseLayoutHomeComponent } from './base-layout/base-layout-home/base-layout-home.component';
import { AscListagemComponent } from './asc-listagem/asc-listagem.component';
import { DscSelectComponent } from 'sidsc-components/dsc-select';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        // NgxMyDatePickerModule.forRoot(),
        // AngularMyDatePickerModule.forRoot(),
        DirectivesModule.forRoot(),
        AscMultiSelectModule,
        PrimeNGModule,
        NgxMaskDirective, NgxMaskPipe,
        InputTextModule,
        AscModalModule,
        PopoverModule.forRoot(),
        DscSelectComponent
    ],
    declarations: [
        DatalistComponent,
        AscListagemAnexosComponent,
        AscProfissionalExecutanteComponent,
        AscApresentadorComponent,
        AscApresentadorArquivosComponent,
        AscVisualizadorArquivoComponent,
        AscExibirDadosBeneficiarioComponent,
        AscInputCpfCnpjComponent,
        AscInputDateComponent,
        AscInputTextComponent,
        AscTextAreaComponent,
        AscInputEmailComponent,
        AscInputTelefone,
        AscCampoEstaticoComponent,
        AscSelectBeneficiarioComponent,
        AscSelectBeneficiarioAtivoCanceladoComponent,
        AscSelectBeneficiarioExtratoComponent,
        AscSelectConselhoProfissionalComponent,
        AscSelectFinalidadeComponent,
        AscSelectMotivoNegacaoComponent,
        AscSelectMunicipioComponent,
        AscSelectSituacaoProcessoComponent,
        AscSelectTipoBeneficiarioComponent,
        AscSelectTipoProcessoComponent,
        AscSelectUfComponent,
        AscAutoCompleteBeneficiarioComponent,
        AscSelectPatologiaComponent,
        AscSelectCaraterSolicitacaoComponent,
        AscAutoCompleteProcedimentoComponent,
        AscOnlyNumberDirective,
        AscAutoCompleteProcedimentoComponent,
        AscOnlyNumberDirective,
        AscInputButtonComponent,
        AscSelectBaseLayout,
        AscInputMoneyComponent,
        AscInputMoney,
        InputError,
        AscUserInfoComponent,
        AscSelectTipoDependenteComponent,
        AscSelectEstadoCivilComponent,
        AscSelectMotivoCancelamentoComponent,
        AscSelectBeneficiarioRenovacaoComponent,
        AscInputErrorComponent,
        AscSelectTiposOcorenciaComponent,
        AscSelectSituacaoProcessoOcorrenciaComponent,
        AscSelectFinalidadeAdesaoComponent,
        BaseLayoutFormComponent,
        BaseLayoutHomeComponent,
        AscListagemComponent

    ],
    exports: [
        DatalistComponent,
        AscListagemAnexosComponent,
        AscProfissionalExecutanteComponent,
        AscApresentadorComponent,
        AscApresentadorArquivosComponent,
        AscVisualizadorArquivoComponent,
        AscExibirDadosBeneficiarioComponent,
        AscInputCpfCnpjComponent,
        AscInputTelefone,
        AscInputDateComponent,
        AscInputTextComponent,
        AscTextAreaComponent,
        AscInputEmailComponent,
        AscCampoEstaticoComponent,
        AscSelectBeneficiarioComponent,
        AscSelectBeneficiarioAtivoCanceladoComponent,
        AscSelectBeneficiarioExtratoComponent,
        AscSelectConselhoProfissionalComponent,
        AscSelectFinalidadeComponent,
        AscSelectMotivoNegacaoComponent,
        AscSelectMunicipioComponent,
        AscSelectSituacaoProcessoComponent,
        AscSelectTipoBeneficiarioComponent,
        AscSelectTipoProcessoComponent,
        AscSelectUfComponent,
        AscAutoCompleteBeneficiarioComponent,
        AscAutoCompleteProcedimentoComponent,
        AscOnlyNumberDirective,
        AscAutoCompleteProcedimentoComponent,
        AscSelectPatologiaComponent,
        AscSelectCaraterSolicitacaoComponent,
        AscInputButtonComponent,
        AscSelectBaseLayout,
        AscInputMoneyComponent,
        AscSelectTipoDependenteComponent,
        AscInputMoney,
        InputError,
        AscUserInfoComponent,
        AscSelectEstadoCivilComponent,
        AscSelectMotivoCancelamentoComponent,
        AscSelectBeneficiarioRenovacaoComponent,
        AscInputErrorComponent,
        AscSelectTiposOcorenciaComponent,
        AscSelectSituacaoProcessoOcorrenciaComponent,
        AscSelectFinalidadeAdesaoComponent,
        BaseLayoutFormComponent,
        BaseLayoutHomeComponent,
        AscListagemComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentModule {
    static forRoot(): ModuleWithProviders<any> {
        return {
            ngModule: ComponentModule
        };
    }
}
