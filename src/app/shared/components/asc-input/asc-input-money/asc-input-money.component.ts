import {Component, Input} from '@angular/core';
import {BaseInputComponent} from '../base-input.component';
import {MessageService} from '../../../services/services';
import * as  constantes from '../../../../../app/shared/constantes';

@Component({
  selector: 'asc-input-money-type',
  templateUrl: './asc-input-money.component.html',
  styleUrls: ['./asc-input-money.component.scss']
})
export class AscInputMoney extends BaseInputComponent {

  @Input()
  hideDecimals: boolean;

  @Input()
  maxlength: number;

  constructor(messageService: MessageService) {
    super(messageService);
    this.maxlength = this.maxlength || 14;
  }

  keyUpAction(e: KeyboardEvent) {
    this.applyMask();
  }

  keyDownAction(e: KeyboardEvent): void {
    this.applyMask();
  }

  changeAction(e: any): void {
    this.applyMask();
  }

  blurAction(e: FocusEvent): void {
    this.applyMask();
  }

  focusAction(e: FocusEvent) {
    this.applyMaskOnFocus();
  }

  private applyMask() {
    let value = this.control.value;
    value = constantes.somenteNumeros(value);
    let decimalValue = '';
    let decimalSize = 2;
    if (!this.hideDecimals && value.length > decimalSize) {
      decimalValue = value.substring(value.length - decimalSize);
      value = value.substring(0, value.length - decimalSize);
    }
    value = this.applyThousandSeparator(value);
    if (!this.hideDecimals && decimalValue) {
      value = value + ',' + decimalValue;
    }
    this.control.setValue(value);
  }
  private applyMaskOnFocus() {
    let value = this.control.value;
    if(!this.hideDecimals) {
      value = this.setMask2DecimalNumbers(value);
    }
    value = constantes.somenteNumeros(value);
    let decimalValue = '';
    let decimalSize = 2;

    if (!this.hideDecimals && value.length > decimalSize) {
      decimalValue = value.substring(value.length - decimalSize);
      value = value.substring(0, value.length - decimalSize);
    }
    value = this.applyThousandSeparator(value);
    if (!this.hideDecimals && decimalValue) {
      value = value + ',' + decimalValue;
    }
    this.control.setValue(value);
  }

  private setMask2DecimalNumbers(value: string | number): string {
    if(!value || value.toString().length === 0) {
      return '';
    }

    value = value.toString();
    if(value.indexOf(',') >= 0 && value.indexOf('.') >= 0) {
      value = value.replace('.', '').replace(',', '.');
    } else if(value.toString().indexOf(',') >= 0 && value.toString().indexOf('.') < 0) {
      value = value.toString().replace(',', '.');
    }
    
    try {
      let valueFloat = parseFloat(value);
      return valueFloat.toFixed(2);
    } catch(ex) {

    }
    return value;
  }

  private applyThousandSeparator(value) {
    let thousandSize = 3;

    if (value.length <= thousandSize) {
      return value;
    }

    return this.applyThousandSeparator(value.substring(0, value.length - thousandSize)) + '.' + value.substring(value.length - thousandSize);
  }


}
