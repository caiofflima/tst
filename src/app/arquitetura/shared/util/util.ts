import {DatePipe} from '@angular/common';
import * as constantes from "../../../shared/constantes";
import {isNotUndefinedNullOrEmpty} from "../../../shared/constantes";
import {SituacaoPedido} from "../../../../app/shared/models/comum/situacao-pedido";

export class Util {

    public static getNomeUsuario(situacao: SituacaoPedido, tipoProcesso: number): string | null {
        let ret: string | null = null;
        if (situacao) {
            if (situacao.codigoUsuarioCadastramento) {
                ret = situacao.codigoUsuarioCadastramento;
            } else if (tipoProcesso === 20) {
                ret = 'Autorizador Web';
            } else {
                ret = 'SIASC';
            }
        }

        return ret;
    }

    public static isDefined(dado: any): boolean {
        return (dado) && (dado !== 'undefined') && (dado !== 'null');
    }

    public static isEmpty(dado: any): boolean {
        return (!Util.isDefined(dado)) || (!(dado + "").length);
    }

    public static notIsEmpty(dado: any): boolean {
        return !Util.isEmpty(dado);
    }

    public static dateToString(d: Date): string | null {
        const datePipe = new DatePipe('en-US');

        return datePipe.transform(d, 'yy-MM-dd\'T\'HH:mm:ss');
    }

    public static dateToStringBr(d: Date): string | null {
        const datePipe = new DatePipe('pt-BR');
        return datePipe.transform(d, 'dd/MM/yyyy');
    }

    public static dateTimeToStringBr(d: Date): string | null {
        const datePipe = new DatePipe('pt-BR');
        return datePipe.transform(d, 'dd/MM/yyyy HH:mm:ss');
    }

    public static convertSecsToMins(time: number): number {
        return Math.floor(time / 60);
    }

    public static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Converte a Data para objeto Json.
     * @param date a data a ser convertida.
     */
    public static dateToJson(date: Date) {
        return {
            date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
            }
        }
    }

    static removeDuplicateByKey<T>(key: string, _value = 0) {
        return (values: T[]): (T | undefined)[] => {
            const itemFound = values.find(item => item['id'] === _value);
            let uniqueItems = values
            if(itemFound){
                uniqueItems = values.filter(value => value[key] !== itemFound[key])
                uniqueItems.push(itemFound);
            }
            return Array.from(new Set(uniqueItems.map(value => value[key]).map(mappedKey => uniqueItems.find(value => value[key] === mappedKey))))
        };
    }


    static isQtdDiasDecorridosAteAgoraMaiorQue(dataInformada: Date, dias: number): boolean {
        return isNotUndefinedNullOrEmpty(dias) && this.getQtdDiasDecorridosAteAgora(dataInformada) > dias;
    }

    private static getQtdDiasDecorridosAteAgora(dataInformada: Date) {
        let qtdDias = 0;
        let dataAtual = new Date();
        if (dataInformada) {
            if (dataInformada.getTime() < dataAtual.getTime()) {
                qtdDias = Util.getIntervaloEmDias(dataInformada, dataAtual);
            }
        }
        return qtdDias;
    }

    static isIntervaloMenorQueDias(dtInicio: Date, dtFim: Date, intervaloEmDias: number): boolean {
        const emDias = this.getIntervaloEmDias(dtInicio, dtFim);
        return intervaloEmDias > emDias;
    }

    static isIntervaloMaiorQueDias(dtInicio: Date, dtFim: Date, intervaloEmDias: number): boolean {
        let emDias = this.getIntervaloEmDias(dtInicio, dtFim);
        return intervaloEmDias < emDias;
    }

    static getIntervaloEmDias(dtInicio: Date, dtFim: Date) {
        let emDias = (dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24);
        emDias = emDias < 0 ? emDias * -1 : emDias;
        return emDias;
    }

    static somenteNumeros(text: string): string {
        let numeros = '';
        if (text) {
            numeros = String(text).replace(/\D/g, '');
        }
        return numeros;
    }

    static formatarTelefone11DigitosStr(telefone: string): string {
        let fmt;
        if (telefone && telefone.length == 11) {
            fmt = '(' + telefone.substr(0, 2) + ') ';
            fmt = fmt + telefone.substr(2, 5) + '-';
            fmt = fmt + telefone.substr(7, 4);
        } else {
            fmt = telefone + "";
        }
        return fmt;
    }

    static formatarTelefone10DigitosStr(telefone: string): string {
        let fmt;
        if (telefone && telefone.length == 10) {
            fmt = '(' + telefone.substr(0, 2) + ') ';
            fmt = fmt + telefone.substr(2, 4) + '-';
            fmt = fmt + telefone.substr(6, 4);
        } else {
            fmt = telefone + "";
        }
        return fmt;
    }

    static extrairMimeTypeFromFileName(fileName: string): string {
        let mimeTypes = {
            gif: "image/gif",
            png: "image/png",
            jpg: "image/jpg",
            jpeg: "image/jpeg",
            bmp: "image/bmp",
            doc: "application/msword",
            docx: "application/msword",
            pdf: "application/pdf"
        }
        let extensao = fileName.substr(fileName.lastIndexOf(".") + 1);
        return mimeTypes[extensao];
    }

    static isInteiroPositivo(numero: any): boolean {
        return constantes.regExp.somenteNumeros.test(numero);
    }

    static getDate(value: Date | string) {
        if (value == null) {
            return null;
        } else if (value instanceof Date) {
            return value;
        } else if (value.indexOf('T') !== -1) {
            return new Date(value);
        } else {
            return new Date(value + 'T00:00:00');
        }
    }

    static convertStringToDate(dataString: string): Date | null {
        if (!dataString) {
            return null;
        }
        const [ano, mes, dia] = dataString.split('-');
        return new Date(Number(ano.trim()), Number(mes.trim()) - 1, Number(dia.trim()));
    }
}