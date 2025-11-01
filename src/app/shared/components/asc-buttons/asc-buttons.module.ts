import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscButtonPrimaryComponent} from "./asc-button-primary/asc-button-primary.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {AscButtonSecondaryComponent} from "./asc-button-secondary/asc-button-secondary.component";
import {AscButtonThirdComponent} from "./asc-button-third/asc-button-third.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    RouterModule
  ],
  declarations: [
    AscButtonPrimaryComponent,
    AscButtonSecondaryComponent,
    AscButtonThirdComponent,
  ],
  exports: [
    AscButtonPrimaryComponent,
    AscButtonSecondaryComponent,
    AscButtonThirdComponent
  ]
})
export class AscButtonsModule {
}
