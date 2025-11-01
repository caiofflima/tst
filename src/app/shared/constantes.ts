import { MessageService } from 'app/shared/components/messages/message.service';
import { AbstractControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StringUtil } from './util/string-util';

export const pipes = {
  date: new DatePipe(navigator.language),
};

export const codigoTipoProcesso = {
  autorizacaoPrevia: {
    fisio: 1,
    medica: 2,
    odonto: 3,
    pad: 4,
  },
  reembolso: {
    um: 0,
    dois: 0,
  },
};

export const regExp = {
  somenteLetrasMaiusculas: new RegExp(/^[A-Z]*$/),

  somenteAlfaNumericos: new RegExp(/^[a-zA-Z0-9]*$/),
  somenteNumeros: new RegExp(/^\d+$/),
  cpf: new RegExp(/[0-9]{3}[.][0-9]{3}[.][0-9]{3}[-][0-9]{2}/),
  cnpjRegexp: new RegExp(
    /[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/][0-9]{4}[-][0-9]{2}/
  ),
  email: new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ),
};

export const control = {
  numeroMaiorQueZero: function (cntrlField: AbstractControl): void {
    if (cntrlField && cntrlField.value) {
      let nro = somenteNumeros(cntrlField.value);
      if (nro.length == 1 && nro == '0') {
        cntrlField.setValue('');
      } else {
        cntrlField.setValue(nro);
      }
    }
  },
  limitarTamanho: function (
    cntrlField: AbstractControl,
    maxSize: number
  ): void {
    if (cntrlField && cntrlField.value) {
      let val = cntrlField.value;
      if (val && val.length > maxSize) {
        val = val.substr(0, maxSize);
      }
      cntrlField.setValue(val);
    }
  },
  formatarTelefone: function (cntrlField: AbstractControl): void {
    if (cntrlField && cntrlField.value) {
      let val = cntrlField.value;
      cntrlField.setValue(formatarTelefone(val));
    }
  },
  somenteNumeros: function (cntrlField: AbstractControl): void {
    if (cntrlField && cntrlField.value) {
      let val = somenteNumeros(cntrlField.value);
      cntrlField.setValue(val);
    }
  },
  somenteAlfaNumericos: function (cntrlField: AbstractControl): void {
    if (cntrlField && cntrlField.value) {
      let val = somenteAlfaNumericos(cntrlField.value);
      cntrlField.setValue(val);
    }
  },
  somenteLetrasMaiusculas: function (cntrlField: AbstractControl): void {
    if (cntrlField && cntrlField.value) {
      let value = somenteLetrasMaiusculas(cntrlField.value);
      cntrlField.setValue(value);
    }
  },
};

export const cpfCnpjUtil = {
  control: {
    configurarMascara: (obj: AbstractControl) => {
      cpfUtil.control.limparFormatacao(obj);
      if (obj) {
        obj.setValue(cpfCnpjUtil.configurarMascara(obj.value));
      }
    },
    limparFormatacao: (obj: AbstractControl): void => {
      if (obj) {
        obj.setValue(cpfUtil.limparFormatacao(obj.value));
      }
    },
  },

  limparFormatacao: (cpfCnpj: string): string => {
    return somenteNumeros(cpfCnpj);
  },

  configurarMascara: (cpfCnpj: string): string => {
    const valor = somenteNumeros(cpfCnpj);
    if (valor) {
      if (valor.length == 11) {
        return cpfUtil.configurarMascara(valor);
      } else if (valor.length == 14) {
        return cnpjUtil.configurarMascara(valor);
      }
      return valor;
    }

    return '';
  },

  isCpfCnpjFrmtdValido: (cpfCnpj: string): boolean => {
    return cpfCnpjUtil.isValido(cpfCnpjUtil.limparFormatacao(cpfCnpj));
  },

  isValido: (cpfCnpj: string): boolean => {
    if (cpfCnpj.length === 11) {
      return cpfUtil.isValido(cpfCnpj);
    } else if (cpfCnpj.length === 14) {
      return cnpjUtil.isValido(cpfCnpj);
    }
    return false;
  },
};

export const cnpjUtil = {
  control: {
    configurarMascara: function (obj: AbstractControl) {
      cpfUtil.control.limparFormatacao(obj);
      if (obj) {
        obj.setValue(cnpjUtil.configurarMascara(obj.value));
      }
    },
    limparFormatacao: function (obj: AbstractControl): void {
      if (obj) {
        obj.setValue(cnpjUtil.limparFormatacao(obj.value));
      }
    },
  },
  limparFormatacao: function (cnpj: string): string {
    if (cnpj) {
      return somenteNumeros(cnpj);
    }
    return '';
  },
  configurarMascara: function (cpfCnpj: string): string {
    if (cpfCnpj) {
      if (cpfCnpj.length == 14) {
        let cnpj = cpfCnpj;
        let cnpj1 = cnpj.substring(0, 2);
        let cnpj2 = cnpj.substring(2, 5);
        let cnpj3 = cnpj.substring(5, 8);
        let cnpj4 = cnpj.substring(8, 12);
        let dv = cnpj.substr(12);
        return cnpj1 + '.' + cnpj2 + '.' + cnpj3 + '/' + cnpj4 + '-' + dv;
      }
      return cpfCnpj;
    }
    return '';
  },
  isValido: function (cnpj): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') {
      return false;
    }

    if (cnpj.length != 14) {
      return false;
    }

    if (isTodosCaracteresIguais(cnpj)) {
      return false;
    }
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let resultado;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
    tamanho++;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === Number(digitos.charAt(1));
  },
};

export const cpfUtil = {
  control: {
    configurarMascara: function (obj: AbstractControl) {
      cpfUtil.control.limparFormatacao(obj);
      if (obj) {
        obj.setValue(cpfUtil.configurarMascara(obj.value));
      }
    },
    limparFormatacao: function (obj: AbstractControl): void {
      if (obj) {
        obj.setValue(cpfUtil.limparFormatacao(obj.value));
      }
    },
  },
  limparFormatacao: function (cpfCnpj: string): string {
    if (cpfCnpj) {
      return somenteNumeros(cpfCnpj);
    }
    return '';
  },
  configurarMascara: function (cpf: string): string {
    if (cpf) {
      if (cpf.length == 11) {
        return cpf
          .substring(0, 3)
          .concat('.')
          .concat(cpf.substring(3, 6))
          .concat('.')
          .concat(cpf.substring(6, 9))
          .concat('-')
          .concat(cpf.substring(9, 11));
      }
      return cpf;
    }
    return '';
  },
  isValido: function (cpf: string): boolean {
    let numeros;
    let digitos;
    let soma;
    let i;
    let resultado;
    if (cpf.length != 11) return false;

    if (!isTodosCaracteresIguais(cpf)) {
      numeros = cpf.substring(0, 9);
      digitos = cpf.substring(9);
      soma = 0;
      for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(0)) return false;
      numeros = cpf.substring(0, 10);
      soma = 0;
      for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      return resultado === Number(digitos.charAt(1));
    } else {
      return false;
    }
  },
};

export const tipoProcesso = {
  autorizacaoPrevia: {
    isODT: function (id: number): boolean {
      return id ? codigoTipoProcesso.autorizacaoPrevia.odonto == id : false;
    },
    isMED: function (id: number): boolean {
      return id ? codigoTipoProcesso.autorizacaoPrevia.medica == id : false;
    },
    isFIS: function (id: number): boolean {
      return id ? codigoTipoProcesso.autorizacaoPrevia.fisio == id : false;
    },
    isPAD: function (id: number): boolean {
      return id ? codigoTipoProcesso.autorizacaoPrevia.pad == id : false;
    },
  },
  reembolso: {},
};

export function somenteNumeros(value: string): string {
  return value ? value.replace(/[\D]+/g, '') : '';
}

export function somenteAlfaNumericos(value: string): string {
  return value ? value.replace(/[^a-zA-Z0-9]+/g, '') : '';
}
export function somenteLetrasMaiusculas(value: string): string {
  return value ? value.toUpperCase() : '';
}

export function formatarTelefone(value: string): string {
  if (value) {
    value = somenteNumeros(value);
    if (value.length == 10) {
      return '('
        .concat(value.substring(0, 2))
        .concat(') ')
        .concat(value.substring(2, 6))
        .concat('-')
        .concat(value.substring(6, 10));
    } else if (value.length == 11) {
      return '('
        .concat(value.substring(0, 2))
        .concat(') ')
        .concat(value.substring(2, 7))
        .concat('-')
        .concat(value.substring(7, 11));
    } else if (value.length > 2) {
      return '('
        .concat(value.substring(0, 2))
        .concat(') ')
        .concat(value.substring(2, value.length));
    } else {
      return value;
    }
  }
  return '';
}

export function isTodosCaracteresIguais(str: string): boolean {
  let digitosIguais = true;
  for (let i = 0; i < str.length - 1; i++)
    if (str.charAt(i) != str.charAt(i + 1)) {
      digitosIguais = false;
      break;
    }
  return digitosIguais;
}

export function getPaginationMessage(e: any, list: any[]): string {
  if (list && list.length > 0) {
    let start = e.first + 1;
    let end = e.first + e.rows > list.length ? list.length : e.first + e.rows;
    return (
      'Mostrando de ' +
      start +
      ' até ' +
      end +
      ' de ' +
      list.length +
      ' registros'
    );
  }
  return '';
}

export function generateSelectItens(
  srcList: any[],
  labelField: string,
  valueField: string
): any[] {
  let selectItens = [];
  console.log(srcList,'srcList constantes')
  if (srcList && srcList.length > 0) {
    for (let itm of srcList) {
      selectItens.push({
        label: itm[labelField],
        value: itm[valueField],
        obj: itm,
      });
    }
  }
  return selectItens;
}

export function genSelectItens<T>(
  srcList: T[],
  valueLabel: (next: T) => string,
  valueField: (next: T) => any,
  toUpperCase: boolean = false
): any[] {
  let selectItens = [];
  if (srcList && srcList.length > 0) {
    for (let itm of srcList) {
      selectItens.push({
        label: toUpperCase ? valueLabel(itm).toUpperCase() : valueLabel(itm),
        value: valueField(itm),
        obj: itm,
      });
    }
  }
  return selectItens;
}

export function downloadFile(file: Blob | File, nome: string): void {
  let a = document.createElement('a');
  a.href = window.URL.createObjectURL(file);
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function isUndefinedOrNull(toCheck: any) {
  return undefined === toCheck || null === toCheck;
}

export function isUndefinedNullOrEmpty(toCheck: any) {
  let flg = isUndefinedOrNull(toCheck);
  if (!flg) flg = toCheck.length === 0;
  return flg;
}

export function isNotUndefinedOrNull(toCheck: any) {
  return !isUndefinedOrNull(toCheck);
}

export function isNotUndefinedNullOrEmpty(toCheck: any) {
  return !isUndefinedNullOrEmpty(toCheck);
}

export function validarArquivosUpload(
  files: File[],
  msgSrvc: MessageService
): boolean {
  let flgValidacao = true;
  let flgSize = false;
  let flgType = false;
  let mensagens = [];
  if (!files) return false;
  if (files.length > 10) {
    mensagens.push(msgSrvc.fromResourceBundle('MA025'));
    flgValidacao = false;
  }
  for (let f of files) {
    if (flgSize && flgType) {
      break;
    }
    if (!flgSize && f.size / 1024 > 4000) {
      mensagens.push(msgSrvc.fromResourceBundle('MA024'));
      flgValidacao = false;
      flgSize = true;
    }

    if (
      !flgType &&
      f.type.indexOf('jpeg') == -1 &&
      f.type.indexOf('jpg') == -1 &&
      f.type.indexOf('png') == -1 &&
      f.type.indexOf('gif') == -1 &&
      f.type.indexOf('pdf') == -1
    ) {
      mensagens.push(msgSrvc.fromResourceBundle('MA023'));
      flgValidacao = false;
      flgType = true;
    }
  }

  if (mensagens.length > 0) {
    for (let m of mensagens) {
      msgSrvc.showDangerMsg(m);
    }
  }
  return flgValidacao;
}

export function configurarArquivosUpload(formData: FormData, files: File[]) {
  for (let i in files) {
    formData.append('arquivo' + i, files[i]);
    formData.append(
      'nomeArquivo' + i,
      btoa(StringUtil.escapeSpecialChar(files[i].name))
    );
  }
}

export function aplicarAcaoQuandoFormularioValido<T>(
  form: FormGroup,
  acao: (valueFromForm: T) => void
) {
  if (form && form.valid) {
    acao(form.getRawValue());
  }
}
export function handleTodosCarecteresNaoSaoIguais(value:any): {
  cpf: boolean;
}{
  let numeros;
  let digitos;
  let soma;
  let i;
  let resultado;
  if (value.length < 11) return {cpf: true};
  if (!isTodosCaracteresIguais(value)) {
      numeros = value.substring(0, 9);
      digitos = value.substring(9);
      soma = 0;

      handlePrimeiroForCpf(i,soma,numeros,resultado,digitos)
      handleSegundoForCpf(i,soma,numeros,resultado,digitos)

      numeros = value.substring(0, 10);
      soma = 0;


  } else {
      return {cpf: true};
  }
  return null
}

function handlePrimeiroForCpf(i,soma,numeros,resultado,digitos){
  for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0))
      return {cpf: true};
      else return null
}
function handleSegundoForCpf(i,soma,numeros,resultado,digitos){
  for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1))
      return {cpf: true};
      else return null
}