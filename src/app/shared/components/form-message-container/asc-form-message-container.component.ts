import { Component, OnInit, Input, ContentChild, AfterContentInit } from '@angular/core';
import {NgModel, FormControlName} from '@angular/forms'

@Component({
  selector: 'asc-form-message-container',
  templateUrl: './asc-form-message-container.component.html'
})
export class AscFormMessageContainer implements AfterContentInit {

  // @Input() errorMessage: string
  // input: any

  // @ContentChild(NgModel) model: NgModel
  //@ContentChild(FormControlName) control: FormControlName
  @Input() control: FormControlName

  ngAfterContentInit(){
    // this.input = this.model || this.control
    // if(this.input === undefined){
    //   throw new Error('Esse componente precisa ser usado com uma diretiva ngModel ou formControlName')
    // }
  }

  hasError(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched)
  }
}