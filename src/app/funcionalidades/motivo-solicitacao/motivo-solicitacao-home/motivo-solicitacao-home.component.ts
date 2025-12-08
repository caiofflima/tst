import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';

import { BaseComponent } from 'app/shared/components/base.component';
import { FiltroMotivoSolicitacao } from 'app/shared/models/filtro/filtro-motivo-solicitacao';
import { MessageService, MotivoSolicitacaoService } from 'app/shared/services/services';
import { Data } from "../../../shared/providers/data";

@Component({
  selector: 'asc-motivo-solicitacao-home',
  templateUrl: './motivo-solicitacao-home.component.html',
  styleUrls: ['./motivo-solicitacao-home.component.scss']
})
export class MotivoSolicitacaoComponent extends BaseComponent implements OnInit {

  baseRota: string
  titulo: string

  filtro: FiltroMotivoSolicitacao;
  descricao = new FormControl(null);
  
  selectedCategory: any = null;

  constructor(
      override readonly messageService: MessageService,
      private readonly service: MotivoSolicitacaoService,
      private readonly router: Router,
      private readonly location: Location,
      private readonly data:Data
  ) {
      super(messageService);
  }

  ngOnInit() {
    this.baseRota = this.service.getRotaBase()
    this.titulo = this.service.getTitulo()
    this.filtro = new FiltroMotivoSolicitacao();
    this.preencherCamposSelecionados();
  }

  salvarStorage(dadosArmazenados:any){
    this.data.storage = { dadosArmazenados }
  }

  limparStorage(){
    this.data.storage = {};
  }

  private isStorageCarregado(): boolean {
    return ((this.data.storage) && (this.data.storage.dadosArmazenados));
  }

  private preencherCamposSelecionados(): void {

    if (this.isStorageCarregado()) {
        const filtro = this.data.storage.dadosArmazenados;
        setTimeout(() => {
            this.descricao.setValue(filtro.nome);
            this.filtro.ativos = filtro.ativos;
        }, 50);
    }
}

  pesquisar() {
      if (this.filtro.nome && this.filtro.nome.length <= 3) {
          super.showDangerMsg("Campo Descrição deve conter mais de 3 (três) caracteres!")
          return;
      }

      this.limparStorage();
      let dadosArmazenados = this.prepararDados();
      this.salvarStorage(dadosArmazenados);

      this.router.navigate([`${this.baseRota}/listar`], {
          queryParams: { ...dadosArmazenados }
      });
  }

  prepararDados():any{
    return {
        nome: this.descricao.value ?? '',
        ativos: this.filtro.ativos ?? ''
    }
  }

  limparCampos() {
      this.filtro = new FiltroMotivoSolicitacao();
      this.descricao.reset();
  }

  nova() {
      this.router.navigate([`${this.baseRota}/novo`]);
  }


  voltar(): void {
      this.location.back();
  }

}
