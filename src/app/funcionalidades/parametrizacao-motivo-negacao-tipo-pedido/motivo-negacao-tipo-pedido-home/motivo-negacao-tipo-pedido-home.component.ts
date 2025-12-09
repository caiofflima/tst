import { SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';
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
import { MotivoNegacaoTipoPedidoService } from './../../../shared/services/comum/motivo-negacao-tipo-pedido.service';
import { Data } from "../../../shared/providers/data";

@Component({
  selector: 'asc-motivo-negacao-tipo-pedido-home',
  templateUrl: './motivo-negacao-tipo-pedido-home.component.html',
  styleUrls: ['./motivo-negacao-tipo-pedido-home.component.scss']
})

export class MotivoNegacaoTipoPedidoHomeComponent extends BaseComponent implements OnInit{
  listComboTipoProcesso: DadoComboDTO[];
  listComboTipoBeneficiario: DadoComboDTO[];
  listComboMotivoNegacao: DadoComboDTO[];
  icNiveisNegacaoCombo = new FormControl(null);
  override baseURL: string;
  override baseTitulo: string;
  somenteAtivos: boolean = false;

  formulario = this.formBuilder.group({
    tiposProcesso: [null],
    tiposBeneficiario: [null],
    motivosDeNegacao: [null]
  });

  icNiveisNegacao: SelectItem[] = [{
    value: "S",
    label: "PEDIDO"
  }, {
      value: "D",
      label: "PROCEDIMENTO"
  }];

 constructor(
         private readonly router: Router,
         private readonly location: Location,
         override readonly messageService: MessageService,
         private readonly formBuilder: FormBuilder,
         private readonly comboService: ComboService,
         private readonly service: MotivoNegacaoTipoPedidoService,
         private readonly motivoNegacaoService: MotivoNegacaoService,
         private readonly data:Data ) {
         super(messageService);
 }

  ngOnInit() {
    this.baseURL = this.service.getBaseURL()
    this.baseTitulo = this.service.getTitulo()
    this.inicializarCombos();
    this.carregardadosArmazenadosNegacaoTpPedido();
  }

  private carregardadosArmazenadosNegacaoTpPedido():void{

    if (this.isStorageCarregado()) {
      const filtro = this.data.storage.dadosArmazenadosNegacaoTpPedido;
      setTimeout(() => {

          this.preencherCamposSelecionadosPorCampo(filtro, "listaIdTipoProcesso", "tiposProcesso");

          this.preencherCamposSelecionadosPorCampo(filtro, "listaIdTipoBeneficiario", "tiposBeneficiario");

          if(filtro.listaIcNivelNegacao){

            this.icNiveisNegacaoCombo.setValue( filtro.listaIcNivelNegacao );

            this.buscarPorNivelNegacao(filtro.listaIcNivelNegacao);

            this.preencherCamposSelecionadosPorCampo(filtro, "listaIdMotivoNegacao", "motivosDeNegacao");
          }

          this.somenteAtivos = filtro.somenteAtivos;
      }, 50);
    }
  }

  private preencherCamposSelecionadosPorCampo(filtro:any, nomeCampo:any, nomeCampoFormulario:any):void{
    const lista = filtro[nomeCampo];
    if(!lista){
        return;
    }
    //const valores = lista.map(v => typeof v === 'object' ? v.value : v);
    
    setTimeout(() => {  this.formulario.get(nomeCampoFormulario)?.setValue(lista);}, 200);
 }

  private isStorageCarregado(): boolean {
    return ((this.data.storage) && (this.data.storage.dadosArmazenadosNegacaoTpPedido));
  }

  public inicializarCombos(): void {
          this.comboService.consultarComboTipoBeneficiario().pipe(
              take<DadoComboDTO[]>(1)
          ).subscribe(res => this.listComboTipoBeneficiario = res, err => this.showDangerMsg(err.error));
  
          this.comboService.consultarComboTipoProcesso().pipe(
              take<DadoComboDTO[]>(1)
          ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));
          
  }

  private getListaFormulario(formulario:any, combo: DadoComboDTO[], value:boolean, label:boolean):any{
    let retorno;
    if(formulario && formulario.length>0 && combo){
        const listaSelecionada = new Set(formulario.map(x=>Number(x)));
        retorno = combo.filter( item =>{ 
            return listaSelecionada.has(item?.value)
        });
        if(label){
            retorno = retorno.map(v => v.label); 
        }else if(value){
            retorno = retorno.map(v => v.value);
        }
    }else{
        retorno = null;
    };

    return retorno;
  }

  buscarPorNivelNegacao(nivelNegacao: string){
    this.formulario.get('motivosDeNegacao').reset();
    Loading.start()
    const filtroMotivoNegacao: FiltroConsultaMotivoNegacao = new FiltroConsultaMotivoNegacao();

    filtroMotivoNegacao.icNivelNegacao = nivelNegacao;

    this.motivoNegacaoService
        .consultaMotivoNegacaoPorFiltro( filtroMotivoNegacao )
        .pipe(take<MotivoNegacao[]>(1))
        .subscribe(resp => {
          Loading.stop()
          this.listComboMotivoNegacao = resp.map(r => ({value: r.id, label: r.titulo, descricao: r.descricaoHistorico}))
          
        }, err => this.showDangerMsg(err.error))
  }

  prepararDados():any{ 
    const listaIdMotivoNegacao = this.getListaFormulario(this.formulario.get('motivosDeNegacao').value, this.listComboMotivoNegacao, true, false);
    const listaIcNivelNegacao = this.icNiveisNegacaoCombo.value ?? null;
    const listaIdTipoProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, true, false);
    const listaIdTipoBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, true, false);

    const listaMotivoNegacao = this.getListaFormulario(this.formulario.get('motivosDeNegacao').value, this.listComboMotivoNegacao, false, true);
    const listaNiveisNegacao = this.icNiveisNegacaoCombo.value ? this.icNiveisNegacao.find(nivel => nivel.value === this.icNiveisNegacaoCombo.value).label  : null;
    const listaTipoProcesso = this.getListaFormulario(this.formulario.get('tiposProcesso').value, this.listComboTipoProcesso, false, true);
    const listaTipoBeneficiario = this.getListaFormulario(this.formulario.get('tiposBeneficiario').value, this.listComboTipoBeneficiario, false, true);

    return {
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
  }

  public pesquisar(): void {
    this.limparStorage();
    let dadosArmazedados = this.prepararDados();
    this.salvarStorage(dadosArmazedados);

    this.router.navigate([`${this.baseURL}/listar`], {
      queryParams: {...dadosArmazedados}
    }).then();
  }

  private salvarStorage(dadosArmazenadosNegacaoTpPedido:any){
    this.data.storage = { dadosArmazenadosNegacaoTpPedido } ;
  }

  private limparStorage(){
    this.data.storage = {};
  }

  public novo(): void {
    this.router.navigateByUrl(`${this.baseURL}/novo`);
  }

  voltar(){
    this.location.back()
  }

  public limparCampos(): void {
    this.limparStorage();
    this.formulario.reset();
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.formulario.updateValueAndValidity();
    this.icNiveisNegacaoCombo.reset();
    this.somenteAtivos = false;
  }
}
