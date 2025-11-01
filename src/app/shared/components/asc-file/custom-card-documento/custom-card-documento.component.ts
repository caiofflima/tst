import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ArquivoParam} from '../models/arquivo.param';

@Component({
  selector: 'asc-custom-card-documento',
  templateUrl: './custom-card-documento.component.html',
  styleUrls: [ './custom-card-documento.component.scss' ],
})
export class CustomCardDocumentoComponent {
  @Input()
  documento;

  @Input()
  showSucess = false;

  @Input()
  index: number;

  @Output()
  removerArquivo = new EventEmitter();

  removerDocumento(arquivo: any) {
    this.removerArquivo.emit(arquivo);
  }

  arquivosSelecionados(param: ArquivoParam, tipoDocumento: any) {
    console.log('arquivosSelecionados');
  }
}
