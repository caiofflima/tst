import {Pipe, PipeTransform} from '@angular/core';

export class CampoVazioPadrao implements PipeTransform {
    constructor(protected valorPadrao: string) {
    }

    transform(value: any, qtdRepeticao?: number) {
        let strReturn = this.valorPadrao;
        if (value) {
            strReturn = value;
        } else {
            if(qtdRepeticao)
            for (let i = 1; i < qtdRepeticao; i++) {
                strReturn += this.valorPadrao;
            }
        }
        return strReturn;
    }
}

@Pipe({name: 'campoVazio'})
export class CampoVazioPipe extends CampoVazioPadrao {
    constructor() {
        super('Não informado');
    }

    override transform(value: any) {
        return super.transform(value);
    }
}

@Pipe({name: 'campoVazioHifen'})
export class CampoVazioHifen extends CampoVazioPadrao {
    constructor() {
        super('—');
    }

    override transform(value: any) {
        return value || this.valorPadrao;
    }
}
