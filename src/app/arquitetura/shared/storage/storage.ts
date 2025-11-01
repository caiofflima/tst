import {Util} from './../../../../app/arquitetura/shared/util/util';

import {environment} from '../../../../environments/environment';

export class Storage<T> {
    private static nomeSistema: string = '';

    constructor(private tipo: new () => T, private chave: string) {
    }

    public static setNomeSistema(nomeSistema: string) {
        Storage.nomeSistema = nomeSistema;
    }

    public gravar(dado: T) {
        if (!dado) {
            return;
        }

        sessionStorage.setItem(this.getChave(), JSON.stringify(dado));
    }

    public ler(): T | null {
        let dado: string | null;

        dado = sessionStorage.getItem(this.getChave());
        if (!Util.isDefined(dado)) {
            return null;
        }

        let obj: any = JSON.parse(dado as string);

        return <T>obj;
    }

    public limpar() {
        sessionStorage.removeItem(this.getChave());
    }

    private getChave(): string {
        return Storage.nomeSistema + '-' + environment.envName + '-' + this.chave;
    }
}
