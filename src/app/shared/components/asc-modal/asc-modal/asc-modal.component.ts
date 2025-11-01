import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import {Dialog} from "primeng/dialog";

@Component({
  selector: 'asc-modal',
  templateUrl: './asc-modal.component.html',
  styleUrls: ['./asc-modal.component.scss'],
})
export class AscModalComponent implements OnInit{

  showModal = false;

  @Input()
  width = 930;

  @Input()
  height: any;

  @Input()
  responsive = true;

  @Input()
  draggable = false;

  @Input()
  resizable = false;

  @Output()
  closeModal = new EventEmitter<boolean>();

  @ViewChild("dialog")
  dialog: Dialog;

  @Input()
  set openModal(isToOpen: boolean) {
    if (isToOpen) {
      this.abrir();
    } else {
      this.fechar();
    }
  }

  ngOnInit() {
    this.definirTamanhoModal();
  }

  abrir() {
    this.showModal = true;
    this.dialog._visible = true
  }

  fechar() {
    this.showModal = false;
    if(!this.dialog)
    return
    this.dialog._visible = false
  }

  definirTamanhoModal():any{
    if(this.isJanelaDownload()){
      this.width= 1150;
      this.height=670;
      this.dialog.closable=false;
    }else{
      this.width= 930;
    }
  }


  isJanelaDownload():boolean{
    let url = window.location.href;
    if(url.includes("downloadArquivo")){
      return true;
    }else{
      return false;
    }
  }


  fecharModal$($event: MouseEvent) {
    this.closeModal.emit(false)

    if (this.showModal) {
      this.fechar();
    }
  }
}
