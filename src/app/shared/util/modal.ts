let jQuery: any;

export default class ModalUtil {

    static dateInputAsString(data: { day: number, month: number, year: number }): string {
        return data ? data.year + '-' + data.month + '-' + data.day : '';
    }

    static idModal(idBase: string, idModal: string, values: string[]): string {
        let id = 'modal_' + idBase + '_' + idModal + '_';
        values.forEach(value => {
            id += value + '_';
        });
        return id.substring(0, id.length - 1);
    }

    static idHashtag(id: string): string {
        return id ? `#${id}` : '';
    }

    static showBsModal(idModal: string, showCallback?: () => void, showCallbacke?: (e) => void): void {
        this.funcaoModal(idModal, 'show.bs.modal', showCallback, showCallbacke);
    }

    static shownModal(idModal: string, showCallback?: () => void, showCallbacke?: (e) => void): void {
        this.funcaoModal(idModal, 'shown.bs.modal', showCallback, showCallbacke);
    }

    static hiddenModal(idModal: string, callback?: () => void, callbacke?: (e) => void): void {
        this.funcaoModal(idModal, 'hidden.bs.modal', callback, callbacke);
    }

    static funcaoModal(idModal: string, functionName: string, callback?: () => void, callbacke?: (e) => void): void {
        jQuery(this.idHashtag(idModal)).on(functionName, (e) => {
            if (e.target.id === e.currentTarget.id) {
                if (callback) {
                    callback();
                }
                if (callbacke) {
                    callbacke(e);
                }
            }
        });
    }

    static showModal(id: string): void {
        jQuery(this.idHashtag(id)).modal('show');
    }

    static hideModal(id: string): void {
        jQuery(this.idHashtag(id)).modal('hide');
    }

}
