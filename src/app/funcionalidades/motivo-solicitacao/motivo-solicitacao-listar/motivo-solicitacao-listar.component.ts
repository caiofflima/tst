import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { MotivoSolicitacao } from 'app/shared/models/entidades';
import { FiltroMotivoSolicitacao } from 'app/shared/models/filtro/filtro-motivo-solicitacao';
import { MessageService, MotivoSolicitacaoService } from 'app/shared/services/services';
import { take } from 'rxjs/operators';

@Component({
  selector: 'asc-motivo-solicitacao-listar',
  templateUrl: './motivo-solicitacao-listar.component.html',
  styleUrls: ['./motivo-solicitacao-listar.component.scss']
})
export class MotivoSolicitacaoListarComponent extends BaseComponent implements OnInit {
    @ViewChild('caixaTableMotivoSolicitacaoListar')caixaTableMotivoSolicitacaoListar:any

  rotaBase: string
  titulo: string
  lista: any[];
  filtro: FiltroMotivoSolicitacao;

  constructor(
      override readonly messageService: MessageService,
      private readonly service: MotivoSolicitacaoService,
      private readonly route: ActivatedRoute,
      private readonly router: Router,
      private readonly location: Location
  ) {
      super(messageService);
  }

  ngOnInit() {
    this.rotaBase = this.service.getRotaBase()
    this.titulo = this.service.getTitulo()
    this.pesquisar();
  }

  pesquisar() {
      this.service.consultarPorFiltro(this.montaFiltro()).pipe(
          take<MotivoSolicitacao[]>(1)
      ).subscribe((res:any) => {
          this.lista = res.map(x => {
              const ret: any = {...x};
              ret.inativo = x.inativo == "SIM" ? "Sim" : "Não";
              ret.prestadorExclusivo = x.prestadorExclusivo == "SIM" ? "Sim" : "Não";
              return ret;
          });
      }, error => this.showDangerMsg(error.error));
  }

  private montaFiltro(): FiltroMotivoSolicitacao {
      this.filtro = new FiltroMotivoSolicitacao();
      this.filtro.nome = this.route.snapshot.queryParams['nome'] || '';
      this.filtro.ativos = this.route.snapshot.queryParams['ativos'] || '';
      this.filtro.codigo = this.route.snapshot.queryParams['codigo'] || '';

      return this.filtro;
  }

  editar(entitidade: MotivoSolicitacao) {
      this.router.navigateByUrl(`${this.rotaBase}/editar/` + entitidade.id);
  }

  nova() {
      this.router.navigate([`${this.rotaBase}/novo`]);
  }

  voltar(): void {
      this.location.back();
  }

  applyGlobalFilter(evento:Event){
    const input = evento.target as HTMLInputElement
    const value = input.value
    this.caixaTableMotivoSolicitacaoListar.filterGlobal(value,'contains')
}

}
