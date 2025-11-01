import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {CredenciadosComponent} from './credenciados/credenciados.component';
import {CredenciadosRoutingModule} from "./credenciados.routing.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CredenciadosRoutingModule,
    ],
    declarations: [
        CredenciadosComponent
    ]
})
export class CredenciadosModule {
}
