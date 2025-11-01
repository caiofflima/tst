import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ascNormalizeFirstCharacterUpper'
})
export class NormalizeFirstCharacterUpperPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (value) {
      const terms = value.split('-')
      if (terms.length >= 2) {
        const secondeTermOfPhrase = terms[1];
        const letter = secondeTermOfPhrase.substring(1, 2).toUpperCase();
        const secondWord = secondeTermOfPhrase.toLowerCase().replace(letter.toLowerCase(), letter)
        const firstWord = `${terms[0].substring(0, 1).toUpperCase()}${terms[0].substring(1).toLowerCase()}`
        return `${firstWord} - ${secondWord}`
      }
      return value;

    }
    return null;
  }

}
