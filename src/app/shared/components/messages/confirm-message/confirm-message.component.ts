import { Component, } from '@angular/core';
import {  trigger, transition, animate, state, style } from '@angular/animations';


import { MessageService } from '../message.service';
import { MessageItem } from '../message-item';
import { WebUtil } from '../../../../../app/arquitetura/shared/util/web-util';

/**
 * Implementação de 'component' responsável por gerar a estrutura 'html' o modal confirm serão gerados.
 */
@Component({
	selector: 'app-confirm-message',
	templateUrl: './confirm-message.component.html',
	styleUrls: ['./confirm-message.component.scss'],
	animations: [
		trigger('slideInOut', [
			state('void', style({
				'-webkit-transform': 'translate3d(0px, -100%, 0px)',
				'-moz-transform': 'translate3d(0px, -100%, 0px)',
				'-o-transform': 'translate3d(0px, -100%, 0px)',
				'-ms-transform': 'translate3d(0px, -100%, 0px)',
				'transform': 'translate3d(0px, -100%, 0px)'
			})),
			transition('* => *', animate('600ms ease-in-out'))
		])
	]
})
export class ConfirmMessageComponent {
	public items: MessageItem[];
	private messageService: MessageService;

	/**
   * Construtor da classe.
   *
   * @param messageService
   */
	constructor(messageService: MessageService) {
		this.items = [];
		this.messageService = messageService;
		this.messageService.getConfirmEmitter().subscribe((item: any) => this.addConfirmItem(item));
	}

	/**
   * Executa o callback para as ações 'YES/OK'.
   *
   * @param messageItem
   */
	public confirmYesOk(messageItem: MessageItem): void {
		messageItem.executeYesOk();
		this.removeConfirm(messageItem);
	}

	/**
   * Executa o callback para a ação 'NO'.
   *
   * @param messageItem
   */
	public confirmNo(messageItem: MessageItem): void {
		messageItem.executeNo();
		this.removeConfirm(messageItem);
	}

	/**
   * Adiciona o modal de confirmação a view.
   *
   * @param messageItem
   */
	private addConfirmItem(messageItem: MessageItem): void {
		const count = this.items.filter(item => item.getMsg() === messageItem.getMsg()).length;

		if (count === 0) {
			this.items.push(messageItem);

			if (messageItem.isSetFocus()) {
				WebUtil.changeFocusWithDelay('btnOk');
			}
		}
	}

	/**
   * Remove o item de confirmação da view.
   *
   * @param messageItem
   */
	private removeConfirm(messageItem: MessageItem): void {
		this.items = this.items.filter(item => item.getMsg() !== messageItem.getMsg());
	}
}
