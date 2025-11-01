import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'asc-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.scss']
})
export class ProfissionalComponent {

  readonly formularioProfissional = new FormGroup({
    conselho: new FormControl(null),
    numero: new FormControl(null),
    uf: new FormControl(null),
  });
  matricula: any;

  beneficarioSelecionado($event: any) {
    //Todo: remover este método se não utilizado
    console.log('beneficiário selecionado');
  }
}
