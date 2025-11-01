import {Pipe, PipeTransform} from '@angular/core';
import {Util} from "../../arquitetura/shared/util/util";

@Pipe({name: 'telefone'})
export class TelefonePipe implements PipeTransform {
  transform(value: string | number) {
    let tValue: string = value ? value.toString() : '';

    if (tValue) {
      if (tValue.length == 11) {
        tValue = Util.formatarTelefone11DigitosStr(tValue);
      } else if (tValue.length == 10) {
        tValue = Util.formatarTelefone10DigitosStr(tValue);
      }
    }
    return tValue;
  }
}
