import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {BaseInputComponent} from "../base-input.component";
import {MessageService} from "../../../services/services";
import { Validators } from "@angular/forms";

@Component({
    selector: 'asc-text-area',
    templateUrl: './asc-text-area.component.html',
    styleUrls: ['./asc-text-area.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class AscTextAreaComponent extends BaseInputComponent implements OnInit {

    @Input()
    rows: number;

    @Input()
    cols: number;

    @Input()
    placeholder: string;

    constructor(messageService: MessageService) {
        super(messageService);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.setupValidation();
    }

    get txtAreaStyle(): any {
        let tStyle = this.compStyle;
        tStyle["min-height"] = "100%";
        tStyle["min-width"] = "100%";
        return tStyle;
    }

    private setupValidation() {
        if (this.isRequired() && this.control) {
          const currentValidators = this.control.validator ? [this.control.validator] : [];
          if (!currentValidators.includes(Validators.required)) {
            this.control.setValidators([...currentValidators, Validators.required]);
            this.control.updateValueAndValidity();
          }
        }
      }
    
      isRequired(): boolean {
        return this.required !== null && this.required !== false;
      }

}
