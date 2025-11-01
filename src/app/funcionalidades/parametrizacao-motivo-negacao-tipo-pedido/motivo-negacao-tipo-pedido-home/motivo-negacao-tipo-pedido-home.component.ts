import { MotivoNegacaoTipoPedidoService } from './../../../shared/services/comum/motivo-negacao-tipo-pedido.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { Loading } from 'app/shared/components/loading/loading-modal.component';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { MotivoNegacao } from 'app/shared/models/entidades';
import { FiltroConsultaMotivoNegacao } from 'app/shared/models/filtro/filtro-consulta-motivo-negacao';
import { ComboService, MessageService, MotivoNegacaoService } from 'app/shared/services/services';
import { SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'asc-motivo-negacao-tipo-pedido-home',
  templateUrl: './motivo-negacao-tipo-pedido-home.component.html',
  styleUrls: ['./motivo-negacao-tipo-pedido-home.component.scss']
})
export class MotivoNegacaoTipoPedidoHomeComponent extends BaseComponent implements OnInit{
  listComboTipoProcesso: DadoComboDTO[];
  listComboTipoBeneficiario: DadoComboDTO[];
  listComboMotivoNegacao: DadoComboDTO[]
  override baseURL: string
  override baseTitulo: string
  somenteAtivos: boolean = false
  icNiveisNegacao: SelectItem[] = [{
          value: "S",
          label: "PEDIDO"
      }, {
          value: "D",
          label: "PROCEDIMENTO"
      }];
  icNiveisNegacaoCombo = new FormControl(null);
  formulario = this.formBuilder.group({
    tiposProcesso: [null],
    tiposBeneficiario: [null],
    motivosDeNegacao: [null]
});
 constructor(
         private readonly router: Router,
         private readonly location: Location,
         override readonly messageService: MessageService,
         private readonly formBuilder: FormBuilder,
         private readonly comboService: ComboService,
         private service: MotivoNegacaoTipoPedidoService,
         private motivoNegacaoService: MotivoNegacaoService
     ) {
         super(messageService);
     }

  ngOnInit() {
    this.baseURL = this.service.getBaseURL()
    this.baseTitulo = this.service.getTitulo()
    this.inicializarCombos();
  }

  public inicializarCombos(): void {
          this.comboService.consultarComboTipoBeneficiario().pipe(
              take<DadoComboDTO[]>(1)
          ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
  
          this.comboService.consultarComboTipoProcesso().pipe(
              take<DadoComboDTO[]>(1)
          ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));
          
  }

  voltar(){
    this.location.back()
  }

  public limparCampos(): void {
    this.formulario.reset();
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.formulario.updateValueAndValidity();
    this.icNiveisNegacaoCombo.reset();
    this.somenteAtivos = false;
  }

  public pesquisar(): void {
    
    const listaIdMotivoNegacao = this.formulario.get('motivosDeNegacao').value ? this.formulario.get('motivosDeNegacao').value.map(v => v.value) : null;
    const listaIcNivelNegacao = this.icNiveisNegacaoCombo.value ? this.icNiveisNegacaoCombo.value : null;
    const listaIdTipoProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.value) : null;
    const listaIdTipoBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.value) : null;
    const listaMotivoNegacao = this.formulario.get('motivosDeNegacao').value ? this.formulario.get('motivosDeNegacao').value.map(v => v.label).join(',') : null;
    const listaNiveisNegacao = this.icNiveisNegacaoCombo.value ? this.icNiveisNegacao.find(nivel => nivel.value === this.icNiveisNegacaoCombo.value ).label  : null;
    const listaTipoProcesso = this.formulario.get('tiposProcesso').value ? this.formulario.get('tiposProcesso').value.map(v => v.label).join(',') : null;
    const listaTipoBeneficiario = this.formulario.get('tiposBeneficiario').value ? this.formulario.get('tiposBeneficiario').value.map(v => v.label).join(',') : null;
    
    const queryParams =  {
      listaIdTipoProcesso,
      listaIdTipoBeneficiario,
      listaIdMotivoNegacao,
      listaMotivoNegacao,
      listaTipoProcesso,
      listaTipoBeneficiario,
      listaIcNivelNegacao,
      listaNiveisNegacao,
      somenteAtivos: this.somenteAtivos
    }
    
    this.router.navigate([`${this.baseURL}/listar`], {
      queryParams
    }).then();
  }

  public novo(): void {
    this.router.navigateByUrl(`${this.baseURL}/novo`);
  }

  buscarPorNivelNegacao(nivelNegacao: string){
    this.formulario.get('motivosDeNegacao').reset();
    Loading.start()
    const filtroMotivoNegacao: FiltroConsultaMotivoNegacao = new FiltroConsultaMotivoNegacao();
    filtroMotivoNegacao.icNivelNegacao = nivelNegacao
    this.motivoNegacaoService
        .consultaMotivoNegacaoPorFiltro( filtroMotivoNegacao )
        .pipe(take<MotivoNegacao[]>(1))
        .subscribe(resp => {
          Loading.stop()
          this.listComboMotivoNegacao = resp.map(r => ({value: r.id, label: r.titulo, descricao: r.descricaoHistorico}))
          
        }, err => this.showDangerMsg(err.error))
  }

}
