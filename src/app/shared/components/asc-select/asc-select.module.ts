import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {AscSelectProcedimentoComponent} from './asc-select-procedimento/asc-select-procedimento.component';
import {AscDropdownComponent} from './asc-dropdown/asc-dropdown.component';
import {AscGrausProcedimentoComponent} from './asc-graus-procedimento/asc-graus-procedimento.component';
import {
    AscSelectAutorizacaoPreviaComponent
} from "./asc-select-autorizacao-previa/asc-select-autorizacao-previa.component";
import {AscSelectEspecialidadeComponent} from "./asc-select-especialidade/asc-select-especialidade.component";
import {AscSelectMedicamentoComponent} from "./asc-select-medicamentos/asc-select-medicamento.component";
import {AscSelectLaboratorioComponent} from "./asc-select-laboratorio/asc-select-laboratorio.component";
import {
    AscSelectMedicamentoApresentacaoComponent
} from "./asc-select-medicamento-apresentacao/asc-select-medicamento-apresentacao.component";
import {AscSelectLaboratorioFormComponent} from "./asc-select-laboratorio-form/asc-select-laboratorio-form.component";
import {AscSelectMedicamentoFormComponent} from "./asc-select-medicamentos-form/asc-select-medicamento-form.component";
import {
    AscSelectMedicamentoApresentacaoFormComponent
} from "./asc-select-medicamento-apresentacao-form/asc-select-medicamento-apresentacao-form.component";
import {AscSelectTipoOcorrenciaComponent} from "./asc-select-tipo-ocorrencia/asc-select-tipo-ocorrencia.component";
// import removed – AscSelectComponent does not exist in this folder
import {DscCaixaModule} from "../../dsc-caixa/dsc-caixa.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        ProgressBarModule,
        DscCaixaModule
    ],
    declarations: [
        AscSelectProcedimentoComponent,
        AscDropdownComponent,
        AscGrausProcedimentoComponent,
        AscSelectAutorizacaoPreviaComponent,
        AscSelectEspecialidadeComponent,
        AscSelectMedicamentoComponent,
        AscSelectLaboratorioComponent,
        AscSelectMedicamentoApresentacaoComponent,
        AscSelectLaboratorioFormComponent,
        AscSelectMedicamentoFormComponent,
        AscSelectMedicamentoApresentacaoFormComponent,
        AscSelectTipoOcorrenciaComponent
    ],
    exports: [
        AscSelectProcedimentoComponent,
        AscGrausProcedimentoComponent,
        AscSelectAutorizacaoPreviaComponent,
        AscSelectEspecialidadeComponent,
        AscSelectMedicamentoComponent,
        AscSelectLaboratorioComponent,
        AscSelectMedicamentoApresentacaoComponent,
        AscSelectLaboratorioFormComponent,
        AscSelectMedicamentoFormComponent,
        AscSelectMedicamentoApresentacaoFormComponent,
        AscSelectTipoOcorrenciaComponent,
        AscDropdownComponent
    ],
})
export class AscSelectModule {
}
