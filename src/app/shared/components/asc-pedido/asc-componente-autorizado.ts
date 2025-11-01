import {PermissoesSituacaoProcesso} from "../../models/fluxo/permissoes-situacao-processo";
import {Directive, Input, OnDestroy} from "@angular/core";
import {Subject} from "rxjs";

@Directive()
export abstract class AscComponenteAutorizado implements OnDestroy {

    @Input()
    permissoes: PermissoesSituacaoProcesso
    protected unsubscribe$ = new Subject<void>();


    updatePermissoes(permissoes: PermissoesSituacaoProcesso): void {
        this.permissoes = permissoes;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
