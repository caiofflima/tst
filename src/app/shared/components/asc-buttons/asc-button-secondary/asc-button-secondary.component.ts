import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'asc-button-secondary',
    templateUrl: './asc-button-secondary.component.html',
    styleUrls: ['./asc-button-secondary.component.scss']
})
export class AscButtonSecondaryComponent {
    @Input() buttonId: string
    @Input() routerLink: string;
    @Input() title: string;
    @Input() disabled = false;
    @Input() showProgress = false;

    @Output() readonly onClick = new EventEmitter<MouseEvent>();

    clickButton(mouseEvent: MouseEvent) {
        this.onClick.emit(mouseEvent)
    }
}
