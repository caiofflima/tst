import {Pipe, PipeTransform} from '@angular/core';
import * as constantes from '../../../app/shared/constantes';

@Pipe({name: 'cnpjMask'})
export class CnpjPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      return constantes.cnpjUtil.configurarMascara(value.toString());
    }
    return value;
  }
}
