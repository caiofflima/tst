import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'asc-button-third',
  templateUrl: './asc-button-third.component.html',
  styleUrls: ['./asc-button-third.component.scss']
})

export class AscButtonThirdComponent {

  @Input() buttonId: string
  @Input() title: string;
  @Input() showProgress = false;
  @Input() disabled = false

  @Output() readonly onClick = new EventEmitter<MouseEvent>();


  clickButton($event: MouseEvent) {
    this.onClick.emit($event)
  }
}
