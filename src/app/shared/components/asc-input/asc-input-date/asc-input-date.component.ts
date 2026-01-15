import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Output,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {BaseInputComponent} from "../base-input.component";
import {MessageService} from "../../../services/services";
import {Calendar} from "primeng/calendar";
import {CalendarLocalePt} from "../../../util/calendar-locale-pt";

@Component({
    selector: 'asc-input-date',
    templateUrl: './asc-input-date.component.html',
    styleUrls: ['./asc-input-date.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AscInputDateComponent extends BaseInputComponent implements OnInit, AfterViewInit {

    @ViewChild("dateCalendar")
    dateCalendar: Calendar;
    @Input()
    dateFormat: string;
    @Input()
    yearNavigator: boolean;
    @Input()
    monthNavigator: boolean;
    @Input()
    override required: boolean;
    @Input()
    override size: 'standard' | 'small' | 'large' = 'large';
    @Output() change = new EventEmitter();
    pt: any;
    @Input()
    className: string;
    @Input()
    placeholder: string;
    @Input()
    readonlyInput: boolean;

    constructor(messageService: MessageService, protected ref: ChangeDetectorRef) {
        super(messageService);
        this.pt = new CalendarLocalePt();
        this.dateFormat = "dd/mm/yy"
        this.yearNavigator = true;
        this.monthNavigator = true;
        this.placeholder = "  /  /  ";
        this.readonlyInput = false;
    }

    ngAfterViewInit(): void {
        this.inputDateMask(this.dateCalendar);
        this.ref.detectChanges();
        //console.log('pt aq',this.pt)

    }

    blurAction(_: FocusEvent): void {console.log("blurAction");
    }

    changeAction(_: any): void {console.log("changeAction");
    }

    focusAction(_: FocusEvent): void {console.log("focusAction");
    }

    keyDownAction(_: KeyboardEvent): void {console.log("keyDownAction");
    }

    keyUpAction(_: KeyboardEvent): void {console.log("keyUpAction");
    }

    onSelect(event) {
        this.change.emit(event);
    }

    personalizarMensagem(){
      let mensagem: string = '';
      if(this.control.invalid && (this.control.dirty || this.control.touched)){
        const errorKey = Object.keys(this.control.errors)[0];
        switch (errorKey) {
          case 'required':
            mensagem = 'Campo obrigatório não informado'
            break;
          case 'dataMenorIgualAtual':
            mensagem = 'O valor de data de nascimento não pode ser superior a data atual'
            break

          default:
            break;
        }
      }
      return mensagem
    }
}
