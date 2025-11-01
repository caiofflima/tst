import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'matricula'})
export class MatriculaPipe implements PipeTransform {
  transform(value: string) {
    return "c" + value;
  }
}
