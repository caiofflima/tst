import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscSelectProcedimentoComponent} from './asc-select-procedimento/asc-select-procedimento.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AscDropdownComponent} from './asc-dropdown/asc-dropdown.component';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
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
import {AscSelectTipoOcorrenciaComponent} from "./asc-select-tipo-ocorrencia/asc-select-tipo-ocorrencia.component";
import { DscSelectComponent } from 'sidsc-components/dsc-select';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        ProgressBarModule,
        DscSelectComponent
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
        AscSelectTipoOcorrenciaComponent,
        AscDropdownComponent
    ],
})
export class AscSelectModule {
}
