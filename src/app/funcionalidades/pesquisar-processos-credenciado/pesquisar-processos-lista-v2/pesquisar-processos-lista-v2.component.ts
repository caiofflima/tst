import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router"

@Component({
  selector: 'asc-pesquisar-processos-lista-v2',
  templateUrl: './pesquisar-processos-lista-v2.component.html',
  styleUrls: ['./pesquisar-processos-lista-v2.component.scss']
})
export class PesquisarProcessosListaV2Component implements OnInit {

  readonly form = new FormGroup({
    pesquisa: new FormControl(null),
  });

  constructor(private router: Router) { }

  ngOnInit() {
    // no aguardo de funcionalidades
  }

  goBack() {
    this.router.navigateByUrl('/pesquisar-processos-credenciado/v2');
  }
}
