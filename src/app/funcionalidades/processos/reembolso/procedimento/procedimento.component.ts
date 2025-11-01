import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'asc-procedimento',
  templateUrl: './procedimento.component.html'
})
export class ProcedimentoComponent {

  readonly formularioProcedimento = new FormGroup({
    procedimento: new FormControl(null, Validators.required),
    grau: new FormControl(null, Validators.required),
    valorUnitarioPago: new FormControl(null, [Validators.required, Validators.min(1)]),
    quantidade: new FormControl(null, [Validators.required, Validators.min(1)]),
    data: new FormControl(null, Validators.required),
    dado1: new FormControl(null, Validators.required),
    dado2: new FormControl(null, Validators.required),
  });

}
