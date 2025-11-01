import { PanelMenuModule } from 'primeng/panelmenu';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {PipeModule} from '../../../../app/shared/pipes/pipe.module';
import {CabecalhoPadraoComponent} from './cabecalho-padrao.component';
import {PaginaNaoEncontradaComponent} from './pagina-nao-encontrada.component';
import {RodapePadraoComponent} from './rodape-padrao.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MenubarModule} from 'primeng/menubar';
import {TooltipModule} from "primeng/tooltip";
import {RadioButtonModule} from "primeng/radiobutton";

/**
 * Modulo Acesso
 **/
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MenubarModule,
        PipeModule,
        TooltipModule,
        RadioButtonModule,
        PanelMenuModule
    ],
    declarations: [
        CabecalhoPadraoComponent,
        RodapePadraoComponent,
        PaginaNaoEncontradaComponent,
        RodapePadraoComponent,
    ],
    exports: [
        CabecalhoPadraoComponent,
        RodapePadraoComponent,
        PaginaNaoEncontradaComponent
    ],
    entryComponents: [
        CabecalhoPadraoComponent
    ]
})
export class TemplatesModule {
}
