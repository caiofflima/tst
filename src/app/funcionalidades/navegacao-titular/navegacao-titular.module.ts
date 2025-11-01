import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavegacaoTitularHomeComponent} from './navegacao-titular-home/navegacao-titular-home.component';
import {NavegacaoTitularRoutingModule} from "./navegacao-titular.routing.module";
import {DirectivesModule} from "../../arquitetura/shared/directives/directives.module";
import {RouterModule} from "@angular/router";
import {TemplatesModule} from "../../arquitetura/shared/templates/templates.module";
import {ComponentModule} from "../../shared/components/component.module";
import { AscModalTitularContratoComponent } from './navegacao-titular-home/asc-modal-titular-contrato.component';
import { AscSelectModule } from 'app/shared/components/asc-select/asc-select.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        DirectivesModule.forRoot(),
        TemplatesModule,
        NavegacaoTitularRoutingModule,
        ComponentModule,
        AscSelectModule,
    ],
    declarations: [
        NavegacaoTitularHomeComponent,
        AscModalTitularContratoComponent,  
    ]
})
export class NavegacaoTitularModule {
}
