import {MessageResource} from './message-resource';

export class MessageItem {
    public static ALERT_TYPE_INFO = 'alert-info';
    public static ALERT_TYPE_DANGER = 'alert-danger';
    public static ALERT_TYPE_SUCCES = 'alert-success';
    public static ALERT_TYPE_WARNING = 'alert-warning';

    public static CONFIRM_TYPE_OK = 'confirm_ok';
    public static CONFIRM_TYPE_YES_NO = 'confirm_yes_no';

    msg: string;
    readonly type: string;
    private readonly listenerNo: () => void;
    private readonly listenerYesOk: () => void;

    /**
     * Texto do botão OK
     */
    public strBtnOk = '';

    /**
     * Texto do botão Cancelar
     */
    public strBtnCancel = '';

    /**
     * Titulo da Janela
     */
    public title = '';

    private messageResource: MessageResource;

    private readonly setFocus = true;

    /**
     * Construtor da classe.
     */
    constructor(
        messageResource: MessageResource,
        msg: string,
        type: string,
        listenerYesOk?: any,
        listenerNo?: any,
        strBtnOk?, strBtnCancel?, title?,
        setFocus?: boolean
    ) {
        this.msg = msg;
        this.type = type;
        this.listenerNo = listenerNo;
        this.listenerYesOk = listenerYesOk;
        this.messageResource = messageResource;
        this.strBtnOk = this.messageResource.getDescription('LABEL_CONFIRM_YES');
        this.strBtnCancel = this.messageResource.getDescription('LABEL_CONFIRM_NO');
        this.title = this.messageResource.getDescription('LABEL_CONFIRM_TITLE');

        if (strBtnOk) {
            this.strBtnOk = strBtnOk;
        }

        if (strBtnCancel) {
            this.strBtnCancel = strBtnCancel;
        }

        if (title) {
            this.title = title;
        }

        if (setFocus) {
            this.setFocus = setFocus;
        }
    }

    /**
     * @returns msg
     */
    public getMsg(): string {
        return this.msg;
    }

    /**
     * @returns type
     */
    public getType(): string {
        return this.type;
    }

    /**
     * Executa o callback para as ações 'OK/YES'.
     */
    public executeYesOk(): void {
        if (this.listenerYesOk !== null && this.listenerYesOk !== undefined) {
            this.listenerYesOk();
        }
    }

    /**
     * Executa o callback para a ação 'NO'.
     */
    public executeNo(): void {
        if (this.listenerNo !== null && this.listenerNo !== undefined) {
            this.listenerNo();
        }
    }

    /**
     * Verifica se o item possui o 'type' é igual a 'CONFIRM_TYPE_OK'.
     *
     * @returns boolean
     */
    public isConfirmTypeOk(): boolean {
        return MessageItem.CONFIRM_TYPE_OK === this.type;
    }

    /**
     * Verifica se o item possui o 'type' é igual a 'CONFIRM_TYPE_YES_NO'.
     *
     * @returns boolean
     */
    public isConfirmTypeYesNo(): boolean {
        return MessageItem.CONFIRM_TYPE_YES_NO === this.type;
    }

    /**
     * Retorna se deve setar o foco ao abrir a janela
     *
     * @returns boolean
     */
    public isSetFocus(): boolean {
        return this.setFocus;
    }
}
