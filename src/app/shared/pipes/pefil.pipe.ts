import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'perfilMask'})
export class PerfilPipe implements PipeTransform {
  transform(value: string, ...args: any[]) {
    if (value) {
      let labelReturn = '';

      if (args != undefined && args[0] != undefined) {
        args[0].forEach(perfil => {
          if (perfil.value == value) {
            labelReturn = perfil.value + ' - ' + perfil.label;
          }
        });
      }
      return labelReturn;
    }
    return value;
  }
}
