import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl} from '@angular/forms'

@Component({
  selector: 'asc-message-error',
  templateUrl: './asc-message-error.component.html'
})
export class AscMessageError {

  @Input() control: FormControl | AbstractControl
  @Input() type: string
  @Input() errorMessage: string

  hasError(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched)
  }

  hasInvalidateType() {
    return this.control.errors[this.type];
  }
}
