import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'flagSimNao'})
export class FlagSimNaoPipe implements PipeTransform {
  transform(value: string) {
    let strReturn = 'SIM';
    if (value === 'N') {
      strReturn = 'NÃO';
    }
    return strReturn;
  }
}
