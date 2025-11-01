import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'asc-ac-proficional-card',
  templateUrl: './profissional-card.component.html',
  styleUrls: ['./profissional-card.component.scss']
})
export class ProfissionalCardComponent {

  profissional: any = {
    conselho: 'Conselho Regional de Odontologia',
    cpfCnpj: '00.610.980/0001-44',
    conselhoNum: 25876,
    nome: "Hospital Santa Maria",
    conselhoUf: 'DF',
    uf: 'DF',
    municipio: 'Brasília'
  }

}
