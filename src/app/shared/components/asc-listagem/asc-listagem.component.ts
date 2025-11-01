import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'asc-listagem',
  templateUrl: './asc-listagem.component.html',
  styleUrls: ['./asc-listagem.component.scss'],
})
export class AscListagemComponent implements OnInit {
  isPopoverOpen = false;
  @Input() titulo: string = 'Tipos de beneficiários'
  @Input() lista: SelectItem[] = []
  @ViewChild(PopoverDirective) popover: PopoverDirective; // Acesso à instância do popover
  
  constructor() { }

  ngOnInit() {
  }

  fecharPopover() {
    if (this.popover) {
      this.popover.hide(); // Chama o método hide() do popover
    }
  }

}
