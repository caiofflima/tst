import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'currencyFormat'})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, symbol?: string) {

    let retorno: string = '';

    if (value) {
      retorno = value.toLocaleString('pt-br', {minimumFractionDigits: 2});

      if (symbol) {
        retorno = symbol + ' ' + retorno;
      }
    }

    return retorno;
  }
}
