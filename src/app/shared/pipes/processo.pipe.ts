import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'processo'})
export class ProcessoPipe implements PipeTransform {
  transform(value: string) {
    let temp = "" + value;

    if (temp.length < 8) {
      for (let index = temp.length; index < 7; index++) {
        temp = "0" + temp;
      }
    }

    return temp;
  }
}
