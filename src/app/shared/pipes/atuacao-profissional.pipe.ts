import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'atuacaoProfissionalMask'})
export class AtuacaoProfissionalPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if (value) {
      let labelReturn = '';
      if (args && args[0]) {
        args[0].forEach(atuacaoProfissional => {
          if (atuacaoProfissional.value == value) {
            labelReturn = atuacaoProfissional.label;
          }
        });
      }
      return labelReturn;
    }
    return value;
  }
}
