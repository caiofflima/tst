import {AbstractControl, ValidatorFn} from "@angular/forms";
import * as constantes from '../../../app/shared/constantes';

export function validarEmails(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length > 0) {
      let emails = control.value.split(',');
      let flgValido = true;
      for (let em of emails) {
        flgValido = flgValido && constantes.regExp.email.test(em.trim());
      }
      return !flgValido ? {'emailInvalido': {value: control.value}} : null;
    }
    return null;
  };
}

export function validarCPF(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length > 0) {
      let cpf = constantes.somenteNumeros(control.value);
      let flgValido = constantes.cpfUtil.isValido(cpf);
      return !flgValido ? {'cpfInvalido': {value: control.value}} : null;
    }
    return null;
  };
}

export function validarCNPJ(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length > 0) {
      let cnpj = constantes.somenteNumeros(control.value);
      let flgValido = constantes.cnpjUtil.isValido(cnpj);
      return !flgValido ? {'cnpjInvalido': {value: control.value}} : null;
    }
    return null;
  };
}

export function validarCpfOuCnpj(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value.length > 0) {
      let cpfCnpj = constantes.somenteNumeros(control.value);
      let flgValido = constantes.cpfCnpjUtil.isValido(cpfCnpj);
      return !flgValido ? {'cpfCnpjInvalido': {value: control.value}} : null;
    }
    return null;
  };
}


