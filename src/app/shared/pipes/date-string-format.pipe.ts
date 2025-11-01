import { Pipe, PipeTransform } from '@angular/core';
import { utcToZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
@Pipe({
  name: 'dateStringFormat'
})
export class DateStringFormat implements PipeTransform {

      transform(value: string, mask: string = 'dd/MM/yyyy HH:mm:ss', locale: string = 'pt-BR'): string {
         if (!value) {
            return '';
          }
    
          let date = new Date(value);
          date.setDate(date.getDate() + 1)
    
          return format(date, mask, { locale: ptBR });
      
      }
    
  }

