import {Component} from '@angular/core';

@Component({
    selector: 'app-texto-ajuda-email',
    templateUrl: './texto-ajuda-email.component.html'
})
export class TextoAjudaEmailComponent {

    display: boolean = false;

    show(): void {
        this.display = true;
    }

    hide(): void {
        this.display = false;
    }
}
