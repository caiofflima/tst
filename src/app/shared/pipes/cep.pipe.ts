import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cepMaskPipe'
})
export class CepMaskPipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      value = value.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
      value = value.replace(/^(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen no CEP
    }
    return value;
  }
}

