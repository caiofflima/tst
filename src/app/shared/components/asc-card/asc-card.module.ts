import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscCardComponentComponent} from "./asc-card-component/asc-card-component.component";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    AscCardComponentComponent
  ],
  declarations: [AscCardComponentComponent]
})
export class AscCardModule { }
