import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router"

@Component({
  selector: 'asc-pesquisar-processos-v2',
  templateUrl: './pesquisar-processos-v2.component.html',
  styleUrls: ['./pesquisar-processos-v2.component.scss']
})
export class PesquisarProcessosV2Component implements OnInit {

  readonly form = new FormGroup({
    processo: new FormControl(null),
    tipoProcesso: new FormControl(null),
    statusProcesso: new FormControl(null),
    codigoProcesso: new FormControl(null),
    uf: new FormControl(null),
    filial: new FormControl(null),
    ufAtendimento: new FormControl(null),
    municipioAtendimento: new FormControl(null),
    tipoBen: new FormControl(null),
    matriculaBen: new FormControl(null),
    codigoBen: new FormControl(null),
    nomeBen: new FormControl(null),
    caraterBen: new FormControl(null),
  });

  constructor(private router: Router) { 
    this.router = router;
  }

  ngOnInit() {
    // no aguardo de funcionalidades
  }

  goTo() {
    this.router.navigateByUrl('/pesquisar-processos-credenciado/v2/lista');
  }

}
