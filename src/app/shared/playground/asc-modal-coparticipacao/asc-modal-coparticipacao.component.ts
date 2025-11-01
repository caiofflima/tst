import {Component, Input, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ModalExibicao} from "../../components/asc-modal/modal-exibicao";
import {Observable} from "rxjs";
import {of} from "rxjs";

import {InfoExibicao} from "../../components/asc-modal/models/info-exibicao";
import {MensagemPedidoService} from "../../services/comum/mensagem-enviada.service";
import {MessageService} from "../../services/services";
import * as constantes from '../../../../app/shared/constantes';
import {AscModalNavegacaoComponent} from "../../components/asc-modal/asc-modal-navegacao/asc-modal-navegacao.component";
import {AscModalComponent} from "../../components/asc-modal/asc-modal/asc-modal.component";

import {MensagemPedidoDTO} from "../../models/dto/mensagem-pedido";
@Component({
    selector: 'asc-modal-coparticipacao',
    templateUrl: './asc-modal-coparticipacao.component.html',
    styleUrls: ['./asc-modal-coparticipacao.component.scss']
})
export class AscModalCoparticipacaoComponent extends ModalExibicao<any> {

    @ViewChild("modalMensagem")
    modalMensagem: AscModalNavegacaoComponent;

    @Input()
    customStyleProperties: any;
    mensagem: MensagemPedidoDTO;
    emailEncaminhar: string = '';

    @Input()
    coparticipacao: any;

    @Input()
    mostrarBotoes:boolean=true;

    constructor(
        private readonly service: MensagemPedidoService,
        protected override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute
    ) {
        super(messageService);
    }

    override ngOnInit() {
        console.log("[INI] AscModalMensagemPedidoComponent ---- ");
        console.log(this.coparticipacao);
        console.log("[FIM] AscModalMensagemPedidoComponent ---- ");
    }

    protected configurarExibicao(item: MensagemPedidoDTO): void {
        if (item) {
            this.mensagem = item;
        }
    }

    protected pesquisarItem(): (infoExibicao: InfoExibicao) => any{
        return (infoExibicao: InfoExibicao) => {
            return of(infoExibicao);
        }
    }


    clickEnviarMensagem(msnRetorno: string, mensagem: MensagemPedidoDTO, modal: AscModalComponent = null): void {
        let email: string = this.emailEncaminhar.trim();

        if (email == '') {
            this.messageService.showDangerMsg('Favor informar o e-mail!');
        } else if (email.toLowerCase() === mensagem.emailDestinatario.trim().toLowerCase()) {
            this.messageService.showDangerMsg('O e-mail informado deve ser distinto daquele presente no campo "PARA" da mensagem original!');
        } else if (constantes.regExp.email.test(email)) {
            this.reenviar(mensagem, msnRetorno, email, modal);
        } else {
            this.messageService.showDangerMsg('O e-mail não é valido!');
        }
    }

    clickReenviarMensagem(msnRetorno: string, mensagem: MensagemPedidoDTO): void {
        this.reenviar(mensagem, msnRetorno);
    }

    fechar(): void { 
        console.log(" ");
    }

    abrirModal(modalMensagem: AscModalNavegacaoComponent, modalEncaminhar: AscModalComponent) {
        this.emailEncaminhar = '';
        modalEncaminhar.abrir();
    }

    private reenviar(mensagem: MensagemPedidoDTO, msnRetorno: string, emailDestinatario?: string, modal: AscModalComponent = null) {

        if (emailDestinatario) {
            mensagem.emailDistintoReenvio = emailDestinatario;
        }

        this.service.reenviarMensagemPedido(mensagem).subscribe(
            () => {
                this.messageService.addConfirmOk(msnRetorno);
                this.modalMensagem.fecharModal();
                if (modal) {
                    modal.fechar();
                }

            },
            error => {
                this.messageService.showDangerMsg(error)
            }
        );
    }

    get tituloAcompanhamento(): boolean {
        let urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
        return urlAtiva.includes("acompanhamento");
    }
}
