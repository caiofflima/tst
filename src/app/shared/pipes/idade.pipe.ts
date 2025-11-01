import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'idade'})
export class IdadePipe implements PipeTransform {
    transform(value) {
        if (value) {
            value = new Date(value);

            if (!(value instanceof Date) && value.chronology) {
                let day = value.dayOfMonth;
                let month = value.monthValue - 1;
                let year = value.year;
                value = new Date(Date.UTC(year, month, day));
            }
            if (value instanceof Date) {
                let diff = (new Date().getTime() - value.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            }
        }
        return value;
    }
}


