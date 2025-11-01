import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filtrarArquivoPor',
})
export class FiltrarArquivoPorPipe implements PipeTransform {

  transform(items: any[], predicate?: (item: any) => boolean): any {
    if (!items || !predicate) {
      return items;
    }
    return items.filter(item => predicate(item));
  }

}
