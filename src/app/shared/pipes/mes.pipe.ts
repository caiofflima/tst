import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'mesMask'})
export class MesPipe implements PipeTransform {
  transform(value: string) {
    if (value) {
      value = value.toString();

      if (value.length === 11) {
        return value.substring(0, 2).concat('/')
        .concat(value.substring(3, 2))
        .concat('/')
        .concat(value.substring(6, 4))
      }
    }

    return value;
  }
}
