import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { FiltroMotivoSolicitacao } from 'app/shared/models/filtro/filtro-motivo-solicitacao';
import { MessageService, MotivoSolicitacaoService } from 'app/shared/services/services';

@Component({
  selector: 'asc-motivo-solicitacao-home',
  templateUrl: './motivo-solicitacao-home.component.html',
  styleUrls: ['./motivo-solicitacao-home.component.scss']
})
export class MotivoSolicitacaoComponent extends BaseComponent implements OnInit {

  baseRota: string
  titulo: string

  filtro: FiltroMotivoSolicitacao;

  
  selectedCategory: any = null;

  constructor(
      override readonly messageService: MessageService,
      private readonly service: MotivoSolicitacaoService,
      private readonly router: Router,
      private readonly location: Location
  ) {

      super(messageService);

  }

  ngOnInit() {
      this.baseRota = this.service.getRotaBase()
      this.titulo = this.service.getTitulo()
      this.filtro = new FiltroMotivoSolicitacao();


  }

  pesquisar() {
      if (this.filtro.nome && this.filtro.nome.length <= 3) {
          super.showDangerMsg("Campo Descrição deve conter mais de 3 (três) caracteres!")
          return;
      }
      this.router.navigate([`${this.baseRota}/listar`], {
          queryParams: {
              nome: this.filtro.nome === null ? '' : this.filtro.nome,
              ativos: this.filtro.ativos === null ? '' : this.filtro.ativos
          }
      });
  }

  limparCampos() {
      this.filtro = new FiltroMotivoSolicitacao();
  }

  nova() {
      this.router.navigate([`${this.baseRota}/novo`]);
  }


  voltar(): void {
      this.location.back();
  }

}
