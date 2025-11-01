import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AscStepperComponent} from './asc-stepper/asc-stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {IncrementerBarDirective} from './directives/incrementer-bar.directive';
import {RouterModule} from "@angular/router";
import {NormalizeFirstCharacterUpperPipe} from './pipes/normalize-first-character-upper.pipe';
import {AscModalModule} from "../asc-modal/asc-modal.module";
import { ComponentModule } from '../component.module';

@NgModule({
    imports: [
        CommonModule,
        CdkStepperModule,
        RouterModule,
        AscModalModule,
        ComponentModule,
    ],
  exports: [AscStepperComponent, NormalizeFirstCharacterUpperPipe],
  declarations: [AscStepperComponent, IncrementerBarDirective, NormalizeFirstCharacterUpperPipe],
})
export class AscStepperModule {
}
