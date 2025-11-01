import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'asc-input-error',
  templateUrl: './asc-input-error.component.html',
  styleUrls: ['./asc-input-error.component.scss']
})
export class AscInputErrorComponent{

  @Input()
  control: AbstractControl;

  @Input()
  requiredMsg: string;

  @Input()
  style: any;

}
