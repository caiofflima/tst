import {Directive, HostListener} from '@angular/core';

const allowed = '0123456789';

@Directive({
  selector: '[ascOnlyNumber]',
})
export class AscOnlyNumberDirective {
  readonly chars = allowed.split('');
  readonly allowedChars = new Set(allowed.split('').map(c => c.charCodeAt(0)));
  readonly allowedKeys = new Set([
    "Backspace",
    "Delete",
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",

  ]);

  constructor() {
    console.log(" ");
  }

  @HostListener('keydown', ['$event'])
  onInputCheckIsNumber(event: KeyboardEvent) {
    if (event.keyCode > 31 && !this.allowedChars.has(event.keyCode) && !this.allowedKeys.has(event.code)) {
      event.preventDefault();
    }
  }


  @HostListener('paste', ['$event'])
  onPasteInputCheckIsNumber(event: ClipboardEvent) {
    const clipboardData = event.clipboardData
    const pastedText = clipboardData.getData('text');
    if (pastedText) {
      const strings = pastedText.split('');
      const predicate = (s) => (c: string) => c === s;
      const isNumber = strings.every(value => {
        return Boolean(this.chars.find(predicate(value)));
      });
      if (isNumber) {
        event.preventDefault();
      }
    }
    event.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDropCheckIsNumber(event: DragEvent) {

  }

  @HostListener('paste', ['$event'])
  onPasteCheckIsNumber(event: ClipboardEvent) {

  }

}
