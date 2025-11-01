import {OnDestroy} from "@angular/core";
import {MessageService} from "../messages/message.service";
import {BundleUtil} from "../../../arquitetura/shared/util/bundle-util";
import {AscComponenteAutorizado} from "./asc-componente-autorizado";
import { ActivatedRoute } from "@angular/router";

export abstract class AscComponenteAutorizadoMessage extends AscComponenteAutorizado implements OnDestroy {
    mostraOcultaSituacao: boolean = false
    protected constructor(
        protected readonly messageService: MessageService,
        protected readonly activatedRoute?: ActivatedRoute
    ) {
        super();
    }

    public bundle(key: string, args?: any): string {
        return BundleUtil.fromBundle(key, args);
    }

    public showDangerMsg(msg: string, args?: any): void {
        this.messageService.addMsgDanger(this.bundle(msg, args));
    }

    public showSuccessMsg(msg: string, args?: any): void {
        this.messageService.addMsgSuccess(this.bundle(msg, args));
    }

    get tituloAcompanhamento(): boolean {
        let urlAtiva = this.activatedRoute.snapshot["_routerState"].url;
        return urlAtiva.includes("acompanhamento");
    }

    get tituloAnalise(): boolean {
        let urlAtiva = this.activatedRoute.snapshot["_routerState"].url;
        return urlAtiva.includes("analise");
    }

}
