import {Pipe, PipeTransform} from '@angular/core';
import * as constantes from '../../../app/shared/constantes';

@Pipe({name: 'cpfMask'})
export class CpfPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      return constantes.cpfUtil.configurarMascara(value.toString());
    }
    return value;
  }
}
