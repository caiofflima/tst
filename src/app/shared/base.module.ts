import { ModuleWithProviders, NgModule } from "@angular/core";
import { AscMultiSelectModule } from "./components/multiselect/asc-multiselect.module";
import { CommonModule } from "@angular/common";
import { ComponentModule } from "./components/component.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrimeNGModule } from "./primeng.module";
import { PipeModule } from "./pipes/pipe.module";
import { AscSelectModule } from "./components/asc-select/asc-select.module";
import {TooltipModule} from 'primeng/tooltip';
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { AscMessageErrorModule } from "./components/message-error/asc-message-error.module";

@NgModule({
    declarations: [],
    imports: [
        AscMultiSelectModule,
        CommonModule,
        ComponentModule,
        FormsModule,
        PrimeNGModule,
        ReactiveFormsModule,
        AscSelectModule,
        PipeModule,
        TooltipModule,
        OverlayPanelModule,
        ProgressSpinnerModule,
        AscMessageErrorModule
    ],
    exports: [
        AscMultiSelectModule,
        CommonModule,
        ComponentModule,
        FormsModule,
        PrimeNGModule,
        ReactiveFormsModule,
        AscSelectModule,
        PipeModule,
        TooltipModule,
        OverlayPanelModule,
        ProgressSpinnerModule,
        AscMessageErrorModule
    ],
  })
export class BaseModule {}