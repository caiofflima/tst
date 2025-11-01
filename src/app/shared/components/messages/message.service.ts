import {EventEmitter, Injectable} from '@angular/core';

import {InternacionalizacaoPipe} from './internacionalizacao.pipe';
import {MessageResource} from './message-resource';
import {MessageResourceProvider} from './message-resource-provider';
import {MessageItem} from './message-item';
import {MessageStorage} from '../../../../app/arquitetura/shared/storage/message-storage';
import {BundleUtil} from "../../../../app/arquitetura/shared/util/bundle-util";

/**
 * Classe 'service' responsável por prover o recurso de mensagens da aplicação.
 */
@Injectable()
export class MessageService {
  private mensagens: any;
  private messageStorage: MessageStorage;
  private i18nPipe: InternacionalizacaoPipe;
  private readonly messageResource: MessageResource;
  private readonly msgEmitter: EventEmitter<MessageItem>;
  private readonly confirmEmitter: EventEmitter<MessageItem>;

  /**
   * Construtor da classe.
   *
   * @param messageResource o recurso de mensagens.
   * @param i18nPipe o pipe para internacionalização.
   */
  constructor(
    messageResource: MessageResourceProvider,
    i18nPipe: InternacionalizacaoPipe
  ) {
    this.messageResource = new messageResource();
    this.i18nPipe = i18nPipe;
    this.msgEmitter = new EventEmitter();
    this.confirmEmitter = new EventEmitter();
    this.messageStorage = new MessageStorage();
    this.mensagens = this.messageStorage.ler();
  }

  /**
   * Retorna a descrição da mensagem conforme os parâmetros informados.
   *
   * @param msg a mensagem.
   * @param params os parâmetros das mensagens.
   */
  private getDescription(msg: string, params: any): string | null {
    let description:string | null = null;

    if (msg !== null && msg !== undefined && msg.trim().length !== 0) {
      description = this.i18nPipe.transform(msg, params);
      description = description === undefined ? msg : description;
    }

    return description;
  }

  /**
   * Adiciona o modal de confirmação segundo o type (confirm_ok, confirm_yes_no), informado.
   */
  private addConfirm(
    msg: string,
    type: string,
    params: any,
    listenerYesOk?,
    listenerNo?,
    strBtnOk?,
    strBtnCancel?,
    title?,
    setFocus?: boolean
  ): void {
    const description = this.getDescription(msg, params);

    if (description !== null) {
      this.confirmEmitter.emit(new MessageItem(this.messageResource, description, type,
        listenerYesOk, listenerNo, strBtnOk, strBtnCancel, title, setFocus));
    }
  }

  /**
   * Adiciona o modal de confirmação OK.
   */
  public addConfirmOk(
    msg: string,
    listenerOk?: () => void,
    params?: any,
    title?: string,
    setFocus?: boolean
  ): void {
    this.addConfirm(msg, MessageItem.CONFIRM_TYPE_OK, params, listenerOk, null, null,
      null, title, setFocus);
  }

  /**
   * Adiciona o modal de confirmação OK.
   *
   * @param title o título da mensagem.
   * @param msg a mensagem.
   * @param listenerOk o callback em caso de confirmação.
   */
  public addSimpleCustomOk(
    title: string,
    msg: string,
    listenerOk?: () => void,
  ): void {
    this.addConfirm(msg, MessageItem.CONFIRM_TYPE_OK, null, listenerOk, null, null,
      null, title, undefined);
  }

  /**
   * Adiciona o modal de confirmação YES/NO.
   */
  public addConfirmYesNo(
    msg: string,
    listenerYes?: () => void,
    listenerNo?: () => void,
    params?: any, strBtnOk?: string,
    strBtnCancel?: string
  ): void {
    this.addConfirm(this.fromResourceBundle(msg), MessageItem.CONFIRM_TYPE_YES_NO, params, listenerYes,
      listenerNo, strBtnOk, strBtnCancel);
  }

  /**
   * Adiciona a mensagem segundo o type (alert-success, alert-info,
   * alert-warning e alert-danger), informado.
   *
   * @param msg a mensagem.
   * @param type o tipo da mensagem.
   * @param args os argumentos de formação da mensagem.
   */
  private addMsg(msg: string, type: string, args?: any): void {
    console.log('antes chamada emitter')
    this.msgEmitter.emit(new MessageItem(this.messageResource, this.fromResourceBundle(msg, args), type));
  }

  /**
   * Adiciona mensagem de Sucesso.
   *
   * @param msg a mensagem.
   * @param args os argumentos de formação da mensagem.
   */
  public addMsgSuccess(msg: string | string[], args?: any): void {
    this.addMsgApplication(msg, MessageItem.ALERT_TYPE_SUCCES, args);
  }

  /**
   * Adiciona mensagem de Informação.
   *
   * @param msg a mensagem.
   * @param args os argumentos de formação da mensagem.
   */
  public addMsgInf(msg: string | string[], args?: any): void {
    this.addMsgApplication(msg, MessageItem.ALERT_TYPE_INFO, args);
  }

  /**
   * Adiciona mensagem de Alerta.
   *
   * @param msg a mensagem.
   * @param args os argumentos de formação da mensagem.
   */
  public addMsgWarning(msg: string | string[], args?: any): void {
    this.addMsgApplication(msg, MessageItem.ALERT_TYPE_WARNING, args);
  }

  /**
   * Adiciona mensagem de Erro.
   *
   * @param msg a mensagem.
   * @param args os argumentos de formação da mensagem.
   */
  public addMsgDanger(msg: string | string[], args?: any): void {
    console.log('antes chamada addmsgapplication', msg, MessageItem.ALERT_TYPE_DANGER, args)
    this.addMsgApplication(msg, MessageItem.ALERT_TYPE_DANGER, args);
  }

  /**
   * @returns EventEmitter
   */
  public getMsgEmitter(): EventEmitter<MessageItem> {
    return this.msgEmitter;
  }

  /**
   * @returns EventEmitter
   */
  public getConfirmEmitter(): EventEmitter<MessageItem> {
    return this.confirmEmitter;
  }

  private addMsgApplication(msg: string | any[], typeMessage, args?: any) {
    if (Array.isArray(msg)) {
      msg.forEach((message, index) => {
        this.addMsg(message, typeMessage, MessageService.getArgs(args, index));
      });
    } else {
      this.addMsg(msg, typeMessage, args);
    }
  }

  private static getArgs(args: any, index: number): any {
    if (args) {
      if (Array.isArray(args)) {
        return args[index];
      } else {
        return args;
      }
    }
    return undefined;
  }

  public fromResourceBundle(key: string, args?: any) {
    return BundleUtil.fromBundle(key, args);
  }

  public showDangerMsg(msg: string, args?: any): void {
    this.addMsgDanger(this.fromResourceBundle(msg, args));
  }

  public showSuccessMsg(msg: string, args?: any): void {
    this.addMsgSuccess(this.fromResourceBundle(msg, args));
  }

  public showWarnMsg(msg: string | string[], args?: any): void {
    if (Array.isArray(msg)) {
      this.addMsgWarning(this.fromResourceBundle(msg.join(', '), args));
    } else {
      this.addMsgWarning(this.fromResourceBundle(msg, args));
    }
  }
}
