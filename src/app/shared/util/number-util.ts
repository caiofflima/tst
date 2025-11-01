import {StringUtil} from "./string-util";

export class NumberUtil {
    constructor() {
        throw new Error('Class cannot be instantiate')
    }

    static getArray(valor: any): number[] {
        if (Array.isArray(valor)) {
            return valor;
        } else if (valor) {
            return [Number(valor)];
        }

        return null;
    }


    static isDecimal(value: any): boolean {
        if (Number.isNaN(value)) throw new Error(`The params should be a number ${value}`);
        return value % 1 === 0;
    }

    static isNotDecimal(value: any): boolean {
        return !this.isDecimal(value)
    }

    static removeMaskCurrencyBrazil(value: any): number {
        if (value) {
            let valorString = StringUtil.replaceAll(value.toString(), '.', '')
            valorString = StringUtil.replaceAll(valorString, ',', '.');
            return Number(valorString);
        }
        return null;
    }

    static convertStringToNumber(value: string | number): number {
        if (typeof (value) == 'number') {
            return value;
        }

        if (value === null || value === undefined || value.toString().length === 0) {
            return null;
        }
        if (value.toString().indexOf(',') >= 0 && value.toString().indexOf('.') >= 0) {
            value = value.replace(/\./g, '').replace(/,/g, '.');
        } else if (value.indexOf(',') >= 0 && value.toString().indexOf('.') < 0) {
            value = value.replace(/,/g, '.');
        }

        try {
            return Number(value);
        } catch (ex) {
            return null;
        }
    }
}
