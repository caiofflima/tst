import {Pipe, PipeTransform} from '@angular/core';
import * as constantes from '../../../app/shared/constantes';

@Pipe({name: 'cpfCnpjMask'})
export class CpfCnpjPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      return constantes.cpfCnpjUtil.configurarMascara(value.toString());
    }
    return value;
  }
}
