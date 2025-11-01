import { Location } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'base-layout-form',
  templateUrl: './base-layout-form.component.html',
  styleUrls: ['./base-layout-form.component.scss']
})
export class BaseLayoutFormComponent implements OnInit {
  @Input() id: any
  @Input() baseTitulo: string
  @Input() disabled: boolean
  @Output() salvar = new EventEmitter()
  @Output() limparCampos = new EventEmitter()
  @Output() restaurarCampos = new EventEmitter()
  @Output() excluir = new EventEmitter()
  @ContentChild('breadcrumb') breadcrumbContent: any;
  @Input() tipo: string = 'form'
  constructor(private location: Location) { }

  ngOnInit() {
    // no aguardo de funcionalidades
  }

  voltar(){
    this.location.back()
  }

  acaoSalvar(){
    this.salvar.emit()
  }

  acaoLimparCampos(){
    this.limparCampos.emit()
  }

  acaoRestaurarCampos(){
    this.restaurarCampos.emit()
  }

  acaoExcluir(){
    console.log('acaoexcluir');
    
    this.excluir.emit()
  }

}
