import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

@Pipe({
  name: 'dateUTC'
})
export class DateUTC implements PipeTransform {
  transform(value: Date, mask: string = 'dd/MM/yyyy HH:mm:ss', timeZone: string ='UTC', locale: string = 'pt-BR'): string {
    if (value instanceof Date) {

      const dataAjustada = utcToZonedTime(value, locale)

      return format(dataAjustada, mask, { locale: ptBR });
    } else {

      return value; 
    }
  }
}