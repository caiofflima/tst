import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {isTodosCaracteresIguais, somenteNumeros} from '../constantes';
import * as constantes from 'app/shared/constantes';
import {Util} from "../../arquitetura/shared/util/util";

export class AscValidators {
    static telefone(control: AbstractControl): { [key: string]: boolean } {
        if (control.value) {
            const onlyNumbers = somenteNumeros(control.value);
            if (onlyNumbers.toString().length !== 11) {
                return {telefoneInvalid: true}
            }
        }
        return null;

    }

    static telefoneOuCelular(control: AbstractControl): { [key: string]: boolean } {
        if (control.value) {
            const onlyNumbers = somenteNumeros(control.value);
            if (onlyNumbers.toString().length !== 11 && onlyNumbers.toString().length !== 10) {
                return {telefoneInvalid: true}
            }
        }
        return null;

    }

    static onlyNumbers(control: AbstractControl): { [key: string]: boolean } {
        if (control.value) {
            const regexOnlyNumber = /^\d+$/;
            if (regexOnlyNumber.test(control.value)) {
                return null;
            }
            return {onlyNumber: false};
        }
        return null;
    }

    static invervaloDatasMaiorQue(other: () => AbstractControl, intervaloEmDias: number) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && ((other) && other().value)) {
                const data1 = control.value;
                const data2 = other().value;
                return Util.isIntervaloMenorQueDias(data1, data2, intervaloEmDias) ? {'intervaloMaior': {value: control.value}} : null;
            }
            return null;
        };
    }

    static dataInicioMaior(other: () => AbstractControl) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && ((other) && other().value)) {
                let data1 = control.value;
                let data2 = other().value;
                let flg = data1.getTime() - data2.getTime() <= 0;
                return !flg ? {'dataInicioMaior': {value: control.value}} : null;
            }
            return null;
        };
    }

    static dataAtual(control: AbstractControl) {
        if (control.value) {
            let data: Date = Util.getDate(control.value);
            let dataAtual: Date = new Date();

            data.setHours(0, 0, 0, 0);
            dataAtual.setHours(0, 0, 0, 0);

            if (data < dataAtual) {
                return {dataAtual: true};
            }
        }
        return null;
    }

    static dataMenorIgualAtual(control: AbstractControl) {
        if (control.value) {
            let data: Date = Util.getDate(control.value);
            let dataAtual: Date = new Date();

            data.setHours(0, 0, 0, 0);
            dataAtual.setHours(0, 0, 0, 0);

            if (data > dataAtual) {
                return {dataMenorIgualAtual: true};
            }
        }
        return null;
    }

    static dataIgualAtualMaior(control: AbstractControl) {
        if (control.value) {
            let data: Date = Util.getDate(control.value);
            let dataAtual: Date = new Date();

            data.setHours(0, 0, 0, 0);
            dataAtual.setHours(0, 0, 0, 0);

            if (dataAtual > data) {
                return {dataIgualAtualMaior: true};
            }
        }
        return null;
    }

    static cpf(control: AbstractControl) {
      
        let value: string = control.value;
        if (!value) {
            value = '';
        }
        value = value.replace(/\./g, '').replace(/-/g, '').replace(/_/g, '');
        if (0 < value.length && 11 != value.length) {
            return {cpf: true};
        }
        if (value.length == 11) {
            value = String(value);

          

            return constantes.handleTodosCarecteresNaoSaoIguais(value)

          

        }
        return null

        
    }


    static cnpj(control: AbstractControl) {
        if (control.value == null || control.value.length !== 18)
        return null;

            let cnpj = control.value.replace(/[^\d]+/g, '');

            if (cnpj == '') {
                return {cnpj: true};
            }

            if (cnpj.length != 14) {
                return {cnpj: true};
            }

            if (isTodosCaracteresIguais(cnpj)) {    
                return {cnpj: true};
            }
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            let digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) return {cnpj: true};
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1))
                return {cnpj: true};

        
        return null
    }

    static somenteNumeros(): ValidatorFn {
        return AscValidators.errorRegexInteiroPositivo();
    }

    static somenteAlfaNumericos(): ValidatorFn {
        return AscValidators.errorRegexAlfaNumericos();
    }

    static inteiroPositivo(c: AbstractControl): ValidationErrors | null {
        if (c && c.value) {
            if (!constantes.regExp.somenteNumeros.test(c.value))
                return {'inteiroPositivo': true};
        }
        return null;
    }

    /**
     * Valida se o valor informado é maior que zero.
     * Forma de verificação: errors.menorIgualZero
     */
    static maiorQueZero(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                let numero = constantes.somenteNumeros(control.value);
                let flgValido = 0 < Number(numero);
                return !flgValido ? {'menorIgualZero': {value: control.value}} : null;
            }
            return null;
        };
    }

    /**
     * Valida se o valor informado é um email válido.
     * Forma de verificação: errors.emailInvalido
     */
    static email(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                const emailValido = constantes.regExp.email.test(control.value);
                return !emailValido ? {'email': {value: control.value}} : null;
            }
            return null;
        };
    }

    /**
     * Valida se o valor informado são emails válidos separados por vírgula.
     * Forma de verificação: errors.emailInvalido
     */
    static commaSeparatedEmails(): ValidatorFn {
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

    /**
     * Valida se o valor informado é um CPF ou um CNPJ válido.
     * Forma de verificação: errors.cpfCnpjInvalido
     */
    static cpfOuCnpj(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                let cpfCnpj = constantes.somenteNumeros(control.value);
                let flgValido = constantes.cpfCnpjUtil.isValido(cpfCnpj);
                return !flgValido ? {'cpfCnpjInvalido': {value: control.value}} : null;
            }
            return null;
        };
    }

    /**
     * Valida se o valor informado é um CNPJ válido.
     * Forma de verificação: errors.cnpj
     */
    static cnpjValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                const cnpj = constantes.somenteNumeros(control.value);
                const flgValido = constantes.cnpjUtil.isValido(cnpj);
                return !flgValido ? {'cnpj': {value: control.value}} : null;
            }
            return null;
        };
    }

    static diasDecorridosMaior(numeroDias: number) {
        return (c: AbstractControl): ValidationErrors | null => {
            if (c && c.value) {
                if (Util.isQtdDiasDecorridosAteAgoraMaiorQue(c.value as Date, numeroDias))
                    return {'diasDecorridos': true};
            }
            return null;
        }
    }

    static dataMenor(data: Date) {
        return (c: AbstractControl) => {
            if (c && c.value && data) {
                const dtInicio: Date = c.value as Date;
                if (dtInicio.getTime() < data.getTime()) {
                    return {'dataMenor': true};
                }
            }
            return null;
        }
    }

    static dataAtualMenor(c: AbstractControl) {
        if (c && c.value) {
            let aDate = Util.getDate(c.value);
            let now = new Date();
            if (aDate && now) {
                aDate.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                if (aDate > now)
                    return {'dataAtualMenor': true};
            }
        }
        return null;
    }

    static isNotFutureDate(c: AbstractControl) {
        if (c && c.value) {
            let aDate = Util.getDate(c.value);
            let now = new Date();
            if (aDate && now) {
                aDate.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);
                if (aDate > now)
                    return {'isNotFotFutureDate': true};
            }
        }
        return null;
    }


    private static errorRegexInteiroPositivo() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                let numero = control.value;
                let flgValido = constantes.regExp.somenteNumeros.test(numero);
                return !flgValido ? {errorName: {value: control.value}} : null;
            }
            return null;
        };
    }

    private static errorRegexAlfaNumericos() {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.length > 0) {
                let numero = control.value;
                let flgValido = constantes.regExp.somenteAlfaNumericos.test(numero);
                return !flgValido ? {errorName: {value: control.value}} : null;
            }
            return null;
        };
    }

    static max(valor: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control && control.value) {
                const valueAsString = control.value.toString();
                const valueAfterComma = valueAsString.split(',')
                if (valueAfterComma.length > 1) {
                    const numeros = Util.somenteNumeros(valueAfterComma[0]);
                    const numerAsString = `${numeros}.${valueAfterComma[1]}`;
                    if (Number(numerAsString) < valor) {
                        return {max: 'Valor ultrapassado'};
                    }
                } else {
                    if (Number(valueAfterComma[0]) < valor) {
                        return {max: 'Valor ultrapassado'};
                    }
                }
            }
            return null;
        };
    }

    static min(valor: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control && control.value) {
                const valueAsString = control.value.toString();
                const valueAfterComma = valueAsString.split(',')
                if (valueAfterComma.length > 1) {
                    const numeros = Util.somenteNumeros(valueAfterComma[0]);
                    const numerAsString = `${numeros}.${valueAfterComma[1]}`;
                    if (Number(numerAsString) < valor) {
                        return {min: 'Valor ultrapassado'};
                    }
                } else if (Number(valueAfterComma[0]) < valor) {
                    return {min: 'Valor ultrapassado'};
                }
            }
            return null;
        };
    }

    static minAndEquals(valor: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control && control.value) {
                const valueAsString = control.value.toString();
                const valueAfterComma = valueAsString.split(',')
                if (valueAfterComma.length > 1) {
                    const numeros = Util.somenteNumeros(valueAfterComma[0]);
                    const numerAsString = `${numeros}.${valueAfterComma[1]}`;
                    if (Number(numerAsString) <= valor) {
                        return {min: 'Valor ultrapassado'};
                    }
                } else if (Number(valueAfterComma[0]) <= valor) {
                    return {min: 'Valor ultrapassado'};
                }
            }
            return null;
        };
    }

    static maxLengthAsNumber(number: number) {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control && control.value) {
                const valueAsString = control.value.toString();
                const valueAfterComma = valueAsString.split(',')
                if (valueAfterComma.length > 1) {
                    const numeros = Util.somenteNumeros(valueAfterComma[0]);
                    const numerAsString = `${numeros}.${valueAfterComma.length > 0 ? valueAfterComma[1] : 0}`;
                    if (Number(numerAsString).toString().length > number) {
                        return {maxLength: 'Tamanho máximo ultrapassado'};
                    }
                }
            }
            return null;
        }
    }
}
