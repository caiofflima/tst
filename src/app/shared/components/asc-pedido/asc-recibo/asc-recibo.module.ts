import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AscReciboComponent } from "./asc-recibo.component";
import { ProgressBarModule } from "primeng/progressbar";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    ProgressBarModule,
    RouterModule
  ],
  declarations: [AscReciboComponent],
  exports: [AscReciboComponent]
})
export class AscReciboModule {
}
