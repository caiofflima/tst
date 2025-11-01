import {Component} from '@angular/core';

import {MessageService} from '../message.service';
import {MessageItem} from '../message-item';
import {fadeAnimation} from "../../../animations/faded.animation";

/**
 * Componente para mensagens de alerta.
 */
@Component({
    selector: 'app-alert-message',
    templateUrl: './alert-message.component.html',
    styleUrls: ['./alert-message.component.scss'],
    animations: [fadeAnimation]
})
export class AlertMessageComponent {
    public items: MessageItem[];
    public tempoEsconderMensagens = 6000;
    private messageService: MessageService;

    constructor(messageService: MessageService) {
        this.items = [];
        this.messageService = messageService;
        this.messageService.getMsgEmitter().subscribe(
            (item: any) => this.addMsgItem(item)
        );
    }

    /**
     * Remove a mensagem da visualização.
     *
     * @param messageItem a mensagem a ser removida.
     */
    public removeMsg(messageItem: MessageItem): void {
        this.items = this.items.filter(item => item.getMsg() !== messageItem.getMsg());
    }

    /**
     * Adiciona a mensagem a visualização.
     *
     * @param messageItem a mensagem a ser exibida.
     */
    private addMsgItem(messageItem: MessageItem): void {
        console.log('chamada addMsgItem alert-message.component',messageItem)
        if (this.items) {
            const count = this.items.filter(item => item.getMsg() === messageItem.getMsg()).length;
            if (count === 0) {
                console.log('chamada addMsgItem alert-message.component 2',messageItem)
                this.items.push(messageItem);
            }
        }

        // Retira as mensagens após 6 segundos
        setTimeout(() => {
            this.items = [];
        }, this.tempoEsconderMensagens);
    }
}
