import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ParametrizacaoPrazosHomeComponent} from './parametrizacao-prazos-home/parametrizacao-prazos-home.component';
import {ParametrizacaoPrazosFormComponent} from './parametrizacao-prazos-form/parametrizacao-prazos-form.component';
import {ParametrizacaoPrazosListarComponent} from './parametrizacao-prazos-listar/parametrizacao-prazos-listar.component';
import {ParametrizacaoPrazosRoutingModule} from './parametrizacao-prazos.routing.module';
import {ComponentModule} from "../../shared/components/component.module";
import {PrimeNGModule} from "../../shared/primeng.module";
import {AscMultiSelectModule} from "../../shared/components/multiselect/asc-multiselect.module";
import {AscSelectModule} from "../../shared/components/asc-select/asc-select.module";
import {PipeModule} from "../../shared/pipes/pipe.module";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {TooltipModule} from "primeng/tooltip";
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module'; 

@NgModule({
    imports: [
        AscMultiSelectModule,
        CommonModule,
        ComponentModule,
        FormsModule,
        ParametrizacaoPrazosRoutingModule,
        PrimeNGModule,
        ReactiveFormsModule,
        AscSelectModule,
        PipeModule,
        TooltipModule,
        OverlayPanelModule,
        DscCaixaModule
    ],
    declarations: [
        ParametrizacaoPrazosHomeComponent,
        ParametrizacaoPrazosFormComponent,
        ParametrizacaoPrazosListarComponent
    ]
})
export class ParametrizacaoPrazosModule { }
