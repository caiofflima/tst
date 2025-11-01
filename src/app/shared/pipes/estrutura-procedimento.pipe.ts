import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'estruturaProcedimento', pure: false})
export class EstruturaProcedimentoPipe implements PipeTransform {
  transform(value: string) {
    if (value !== undefined && value !== null)
      return value.toString().replace(/\./g, "");
    return "";
  }
}
