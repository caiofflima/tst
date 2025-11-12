import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'asc-status-icon-manager',
  templateUrl: './status-icon-manager.component.html',
  styleUrls: ['./status-icon-manager.component.scss']
})
export class StatusIconManagerComponent {

  @Input()
  status: string

  @Input()
  onHover: boolean

  setColor() {
    if(this.onHover) {
      return "#fff";
    }
    switch (this.status) {
      case 'success':
        return "#A1B911"
      case 'info':
        return "#17A2B8";
      case 'error':
        return "#DC3545";
      default:
        return "#fff";
    }
  }

}
