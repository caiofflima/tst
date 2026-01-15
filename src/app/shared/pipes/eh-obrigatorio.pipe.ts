// is-required.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
  name: 'isRequired',
  pure: false // importante para detectar mudanças
})
export class EhObrigatorioPipe implements PipeTransform {
  transform(control: AbstractControl | FormControl | null): boolean {
    if (!control?.validator) {
      return false;
    }

    const validator = control.validator({} as AbstractControl);
    return !!(validator && validator['required']);
  }
}
