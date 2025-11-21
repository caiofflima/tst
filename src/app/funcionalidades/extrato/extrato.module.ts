import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ComponentModule} from "app/shared/components/component.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PrimeNGModule} from "../../shared/primeng.module";
import { CommonModule } from '@angular/common';
import {DirectivesModule} from "app/arquitetura/shared/directives/directives.module";
import {AscMessageErrorModule} from "app/shared/components/message-error/asc-message-error.module";
import { ExtratoIRPFComponent } from "./extrato-irpf/extrato-irpf.component";
import { ExtratoIRPFDetalharComponent } from "./extrato-irpf-detalhar/extrato-irpf-detalhar.component";
import { ExtratoRoutingModule } from "./extrato.routing.module";
import {PipeModule} from 'app/shared/pipes/pipe.module';
import { DscCaixaModule } from 'app/shared/dsc-caixa/dsc-caixa.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PrimeNGModule,
        ReactiveFormsModule,
        RouterModule,
        ComponentModule,
        DirectivesModule.forRoot(),
        AscMessageErrorModule,
        ExtratoRoutingModule,
        PipeModule,
        DscCaixaModule
    ],
    declarations: [
        ExtratoIRPFComponent,
        ExtratoIRPFDetalharComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ExtratoModule {
}
