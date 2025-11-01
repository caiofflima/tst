import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'asc-button-primary',
    templateUrl: './asc-button-primary.component.html',
    styleUrls: ['./asc-button-primary.component.scss']
})
export class AscButtonPrimaryComponent {
    @Input() buttonId: string
    @Input() title: string;
    @Input() showProgress = false;
    @Input() disabled = false
    @Input() faIcon: string;
    @Input('style-button') styleButton?: { [key: string]: string }

    @Output() readonly onClick = new EventEmitter<MouseEvent>();

    clickButton($event: MouseEvent) {
        this.onClick.emit($event)
    }
}
