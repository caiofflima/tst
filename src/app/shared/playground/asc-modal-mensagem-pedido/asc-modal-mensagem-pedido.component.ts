import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {ModalExibicao} from "../../components/asc-modal/modal-exibicao";
import {MensagemPedidoDTO} from "../../models/dto/mensagem-pedido";
import {InfoExibicao} from "../../components/asc-modal/models/info-exibicao";
import {Observable} from "rxjs";
import {of} from "rxjs";
import {MensagemPedidoService} from "../../services/comum/mensagem-enviada.service";
import {MessageService} from "../../services/services";
import * as constantes from '../../../../app/shared/constantes';
import {AscModalNavegacaoComponent} from "../../components/asc-modal/asc-modal-navegacao/asc-modal-navegacao.component";
import {AscModalComponent} from "../../components/asc-modal/asc-modal/asc-modal.component";
import {ActivatedRoute} from "@angular/router";
import { SituacaoProcesso } from '../../../../app/shared/models/entidades';
import { MatDialogRef } from '@angular/material/dialog';
import { DscDialogService } from 'sidsc-components/dsc-dialog';

@Component({
    selector: 'asc-modal-mensagem-pedido',
    templateUrl: './asc-modal-mensagem-pedido.component.html',
    styleUrls: ['./asc-modal-mensagem-pedido.component.scss']
})
export class AscModalMensagemPedidoComponent extends ModalExibicao<MensagemPedidoDTO> {


    @Input() customStyleProperties: any;
    mensagem: any;
    emailEncaminhar: string = '';

    @Input() mostrarBotoes:boolean=true;

    isTipoOcorrenciaObservacao: boolean = false;

    emailsCopia = null;

    @ViewChild('modalMensagem', { static: true }) private modalMensagem!: TemplateRef<any>;
    @ViewChild('modalMensagemEmail', { static: true }) private modalMensagemEmail!: TemplateRef<any>;

    return: any;

    dialogRef2?: MatDialogRef<any>;
    dialogMsgEmail?: MatDialogRef<any>;

    constructor(
        private readonly service: MensagemPedidoService,
        protected override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private _dialogService: DscDialogService,
    ) {
        super(messageService);
        this.infoExibicao$.subscribe(() => {
          this.dialogRef2 = this._dialogService.confirm({
            data: {
              title: {
                text: 'Mensagens Enviadas',
                showCloseButton: true,
                highlightVariant: true
              },
              template: this.modalMensagem,
            }
          });
        });


    }

    protected configurarExibicao(item: MensagemPedidoDTO): void {
        if (item) {
            this.mensagem = item;
            this.emailsCopia = this.mensagem.copiaPara;
            if (this.mensagem.pedido.email) {
                if (this.emailsCopia != null) {
                    this.emailsCopia += ', ' + this.mensagem.pedido.email;
                } else {
                    this.emailsCopia = this.mensagem.pedido.email;
                }
            }
            if (this.mensagem.situacaoProcesso === null) {
                this.mensagem.situacaoProcesso = new SituacaoProcesso(2, "Observação");
                this.isTipoOcorrenciaObservacao = true;
            }
        }
    }

    protected pesquisarItem(): (infoExibicao: InfoExibicao) => any {
        return (infoExibicao: InfoExibicao) => {
            return of(infoExibicao);
        }
    }


    clickEnviarMensagem(msnRetorno: string, mensagem: MensagemPedidoDTO, modal: MatDialogRef<any> = null): void {
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
        this.reenviar(mensagem, msnRetorno, null, this.dialogRef2);
    }

    fechar(): void {
        this.emailsCopia = null;
    }

    abrirModal(modalMensagem: AscModalNavegacaoComponent, modalEncaminhar: AscModalComponent) {
        this.emailEncaminhar = '';
        modalEncaminhar.abrir();

  }

    private reenviar(mensagem: MensagemPedidoDTO, msnRetorno: string, emailDestinatario?: string, modal: MatDialogRef<any> = null) {

        if (emailDestinatario) {
            mensagem.emailDistintoReenvio = emailDestinatario;
        }
        delete mensagem.email;
        this.service.reenviarMensagemPedido(mensagem).subscribe(
            () => {
                this.messageService.addConfirmOk(msnRetorno);

                if (modal) {
                    modal.close();
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

  closeDialog() {
    if (this.dialogRef2) {
      this.dialogRef2.close();
    }
  }

  closeDialogMsgModal() {
    if (this.dialogMsgEmail) {
      this.dialogMsgEmail.close();
    }
  }

  abrirModalMensagemEmail(){
    this.dialogMsgEmail = this._dialogService.confirm({
      data: {
        title: {
          text: 'Encaminhar Mensagem',
          showCloseButton: true,
          highlightVariant: true
        },
        template: this.modalMensagemEmail,
      },
    });
    this.closeDialog()
  }

}
