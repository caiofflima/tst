declare let jQuery: any;

export class WebUtil {
	public static changeFocusWithDelay(idElement: string) {
		setTimeout(() => { WebUtil.changeFocus(idElement) });
	}

	public static changeFocus(idElement: string) {
		WebUtil.blurCurrent();
		jQuery('#' + idElement).focus();
	}

	public static blurCurrent() {
		let htmlElement: HTMLElement;

		if (document.activeElement &&
				(document.activeElement instanceof HTMLElement)) {
			htmlElement = document.activeElement;
			htmlElement.blur();
		}
	}
}
