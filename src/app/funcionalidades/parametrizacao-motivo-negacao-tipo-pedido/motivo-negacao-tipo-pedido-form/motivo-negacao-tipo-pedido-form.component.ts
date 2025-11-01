import { tipoProcesso } from './../../../shared/constantes';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { Loading } from 'app/shared/components/loading/loading-modal.component';
import { MotivoNegacaoTipoPedido } from 'app/shared/models/comum/motivo-negacao-tipo-pedido';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { MotivoNegacao } from 'app/shared/models/entidades';
import { FiltroConsultaMotivoNegacao } from 'app/shared/models/filtro/filtro-consulta-motivo-negacao';
import { MotivoNegacaoTipoPedidoService } from 'app/shared/services/comum/motivo-negacao-tipo-pedido.service';
import { ComboService, MessageService, MotivoNegacaoService, SituacaoProcessoService } from 'app/shared/services/services';
import { AscValidators } from 'app/shared/validators/asc-validators';
import { SelectItem } from 'primeng/api';
import { take } from 'rxjs/operators';

@Component({
  selector: 'asc-motivo-negacao-tipo-pedido-form',
  templateUrl: './motivo-negacao-tipo-pedido-form.component.html',
  styleUrls: ['./motivo-negacao-tipo-pedido-form.component.scss']
})
export class MotivoNegacaoTipoPedidoFormComponent extends BaseComponent {
  idMotivoNegacao = this.formBuilder.control(null, [Validators.required]);
  listaIdTipoBeneficiario = this.formBuilder.control(null, [Validators.required]);
  idTipoProcesso = this.formBuilder.control(null, [Validators.required]);
  campoSituacaoProcesso = this.formBuilder.control(null)
  formulario: FormGroup

  listComboTipoBeneficiario: SelectItem[]
  listaTodosComboTipoBeneficiario: SelectItem[]
  listaComboMotivoNegacao: SelectItem[]
  listaComboTipoProcesso: SelectItem[]
  listaComboSituacoesProcesso: SelectItem[]

  atualizar: any
  idMotivoNegacaoParam: number
  idTipoProcessoParam: number
  idSituacaoProcessoParam: number
  listaIdTipoBeneficiarioParam: Array<number>
  icNiveisNegacao: SelectItem[] = [{
            value: "S",
            label: "PEDIDO"
        }, {
            value: "D",
            label: "PROCEDIMENTO"
        }];
  icNiveisNegacaoCombo = new FormControl(null);
  inativo: boolean
  dataInativacao = this.formBuilder.control(null);
  constructor(
    private formBuilder: FormBuilder,
    protected override readonly messageService: MessageService,
    private comboService: ComboService,
    private service: MotivoNegacaoTipoPedidoService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private motivoNegacaoService: MotivoNegacaoService
  ) { 
    super(messageService);
  }

  ngOnInit() {
    this.baseURL = this.service.getBaseURL()
    this.baseTitulo = this.service.getTitulo()
    const dadosDoParametro =  this.activatedRoute.snapshot.params['atualizar'] ? JSON.parse( atob(this.activatedRoute.snapshot.params['atualizar'] ) ) : null
    
    if( dadosDoParametro ){
      this.atualizar = dadosDoParametro.atualizar
      this.idMotivoNegacaoParam = dadosDoParametro.motivoNegacao
      this.idTipoProcessoParam = dadosDoParametro.tipoProcesso
      this.listaIdTipoBeneficiarioParam = dadosDoParametro.listaBeneficiarios
      this.icNiveisNegacaoCombo.setValue(this.icNiveisNegacao.find(i => i.value === dadosDoParametro.nivelNegacao).value )
      this.dataInativacao.setValue( dadosDoParametro.dataInativacao )
      this.idSituacaoProcessoParam = dadosDoParametro.situacaoProcesso
      this.inativo = dadosDoParametro.dataInativacao != null
      
      
      
    }
    
    
    this.formulario = this.formBuilder.group({
      listaIdTipoBeneficiario: this.listaIdTipoBeneficiario,
      idMotivoNegacao: this.idMotivoNegacao,
      idTipoProcesso: this.idTipoProcesso,
      dataInativacao: this.dataInativacao,
      inativo:  [null]
    })

    this.formulario.get('inativo').valueChanges.subscribe(v => {
      const dataInativacaoControl = this.formulario.get('dataInativacao')
      if( v ){
        dataInativacaoControl.setValue(new Date)
        dataInativacaoControl.setValidators(AscValidators.dataIgualAtualMaior)
        dataInativacaoControl.markAsPristine()
        
      }
      else{
        dataInativacaoControl.setValue( null )
        dataInativacaoControl.clearValidators()
        dataInativacaoControl.markAsPristine()
        
      }
      this.formulario.updateValueAndValidity()
      
    })
    
    
    if( this.dataInativacao.value ){
      this.campoInativo.setValue( true )
    }

    if( dadosDoParametro && dadosDoParametro.nivelNegacao )
      this.prepararFiltroParaCarregarMotivoNegacao( dadosDoParametro.nivelNegacao )
    
    this.carregarSituacoesProcesso()
    this.carregarTipoPedido()
    
  }

  get campoInativo(){
    return this.formulario.get('inativo')
  }

  carregaBeneficiarios(): void {
    this.comboService
        .consultarComboTipoBeneficiario()
        .pipe(
          take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listaTodosComboTipoBeneficiario = res, err => this.showDangerMsg(err.error))   
  }
  
  public carregaBeneficiariosPorTipoProcesso(): void {
    Loading.start()
    if (this.idTipoProcesso.value) {
        this.comboService.consultarComboTipoBeneficiarioPorTipoProcesso([this.idTipoProcesso.value]).pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => {
          Loading.stop()
          this.listComboTipoBeneficiario = res
          if( this.atualizar ){
            this.listComboTipoBeneficiario = res
            this.listaIdTipoBeneficiario.setValue( this.listaIdTipoBeneficiarioParam );
            this.formulario.get('listaIdTipoBeneficiario').markAsDirty()
            this.formulario.get('listaIdTipoBeneficiario').markAsTouched()
            this.formulario.get('listaIdTipoBeneficiario').updateValueAndValidity()
            this.formulario.updateValueAndValidity()
            
          }
        }, err => this.showDangerMsg(err.error));
    }
}

  carregarTipoPedido(){
    this.comboService
        .consultarComboTipoProcesso()
        .pipe(
          take<DadoComboDTO[]>(1)
        ).subscribe(res => {
          this.listaComboTipoProcesso = res
          if( this.atualizar ){
            const tipoProcesso = this.listaComboTipoProcesso.find( tp => tp.value == this.idTipoProcessoParam )
            this.idTipoProcesso.setValue( tipoProcesso.value )
            setTimeout(() => {
              this.carregaBeneficiariosPorTipoProcesso()
            }, 300);
          }
        }, err => this.showDangerMsg(err.error))
  }

  prepararFiltroParaCarregarMotivoNegacao(nivelNegacao: string){
    const campoIdMotivoNegacao = this.formulario.get('idMotivoNegacao')
    if(nivelNegacao === 'D'){
      this.carregarMotivoNegacao()
    }
    else{
      this.listaComboMotivoNegacao = []
      if( this.atualizar ){
        setTimeout(() => {
          this.carregarMotivoNegacao()
        }, 500);
      }
    }

    campoIdMotivoNegacao.reset()
    campoIdMotivoNegacao.markAsUntouched()
    campoIdMotivoNegacao.updateValueAndValidity()
  }

  carregarMotivoNegacao(){
    
    Loading.start()
      const filtroMotivoNegacao: FiltroConsultaMotivoNegacao = new FiltroConsultaMotivoNegacao();
      filtroMotivoNegacao.icNivelNegacao = this.icNiveisNegacaoCombo.value
      if( this.icNiveisNegacaoCombo.value == 'S' )
        filtroMotivoNegacao.idSituacaoPedido = this.campoSituacaoProcesso.value
      else 
        filtroMotivoNegacao.idSituacaoPedido = null

        this.motivoNegacaoService
            .consultaMotivoNegacaoPorFiltro( filtroMotivoNegacao )
            .pipe(take<MotivoNegacao[]>(1))
            .subscribe(resp => {
              Loading.stop()
              this.listaComboMotivoNegacao = resp.map(r => ({value: r.id, label: r.titulo, descricao: r.descricaoHistorico}))
              if( this.idMotivoNegacaoParam ){
                this.idMotivoNegacao.setValue( this.listaComboMotivoNegacao.find( l => l.value === this.idMotivoNegacaoParam ).value )
              }
            }, err => this.showDangerMsg(err.error))
  }

  buscarBeneficiariosCadastrados(){
    Loading.start()
    const dto: MotivoNegacaoTipoPedido = new MotivoNegacaoTipoPedido();
    dto.listaIdMotivoNegacao = [ this.idMotivoNegacao.value ]
    dto.listaIdTipoProcesso = [ this.idTipoProcesso.value ]

    this.service
        .obterListaDeDados( dto )
        .pipe( 
          take(1)
        ).subscribe((resp: MotivoNegacaoTipoPedido[])=>{
          Loading.stop()
          if( resp ){
            this.listComboTipoBeneficiario = this.listaTodosComboTipoBeneficiario.filter(b => {
              if( resp[0].listaIdTipoBeneficiario.findIndex(r => r  == b.value) == -1 ) return b
            })
            
          }else {
            this.listComboTipoBeneficiario = this.listaTodosComboTipoBeneficiario
          }
        })

  }

  voltar(){
    this.location.back()
  }

  public limparCampos(): void {
    this.formulario.reset();
    this.formulario.markAsPristine();
    this.formulario.markAsUntouched();
    this.formulario.updateValueAndValidity();
    this.campoSituacaoProcesso.reset()
    this.icNiveisNegacaoCombo.reset()
  }

  public salvar(): void {
    Loading.start()
    const dados: MotivoNegacaoTipoPedido = this.formulario.value;
    const motivoNegacao = this.listaComboMotivoNegacao.find(l => l.value == dados.idMotivoNegacao)
    const tipoProcesso = this.listaComboTipoProcesso.find(l => l.value == dados.idTipoProcesso)

    if (this.atualizar) {
              this.service.put(dados).pipe(
                  take<MotivoNegacaoTipoPedido>(1)).subscribe(res => {
                    Loading.stop()
                    this.showSuccessMsg(this.bundle("MA022"));
                    this.redirecionar(tipoProcesso, motivoNegacao, dados)
              }, err => this.showDangerMsg(err.error));
      } else { 
          this.service.post(dados).pipe(
              take<MotivoNegacaoTipoPedido>(1))
              .subscribe(res => {
                Loading.stop()
                this.showSuccessMsg(this.bundle("MA038"));
                this.redirecionar(tipoProcesso, motivoNegacao, dados)
          }, err => this.showDangerMsg(err.error));
          
      }
  }

  redirecionar(tipoProcesso: any, motivoNegacao: any, dados: any){
    this.router.navigate([`${this.baseURL}/listar`], {
      queryParams: {
          listaIdTipoProcesso: [tipoProcesso.value],
          listaIdMotivoNegacao: [motivoNegacao.value],
          listaMotivoNegacao: [motivoNegacao.label],
          listaTipoProcesso: [tipoProcesso.label],
          somenteAtivos: !dados.inativo
      }
    }).then();
  }

  public onChangeProcesso(): void {
        this.listaIdTipoBeneficiario.reset();
        this.listComboTipoBeneficiario = [];
  }

  excluir(){
    const dados: MotivoNegacaoTipoPedido = this.formulario.value;
    const prepararObjeto = new MotivoNegacaoTipoPedido()
    prepararObjeto.idMotivoNegacao = dados.idMotivoNegacao
    prepararObjeto.idTipoProcesso = dados.idTipoProcesso
    this.messageService.addConfirmYesNo(this.bundle("MA021"), () => {
      this.service.excluir(prepararObjeto).take(1).subscribe(async () => {
              this.showSuccessMsg(this.bundle("MA039"));
              await this.router.navigate([`${this.baseURL}/listar`]);
          }, err => this.showDangerMsg(err.error)
      );
    });
    
  }

  restaurarCampos(){
    this.carregaBeneficiariosPorTipoProcesso()
  }
  
  formInvalido(){
    if( !this.atualizar ){
      return this.formulario.invalid
    }else{
      return (JSON.stringify( this.listaIdTipoBeneficiario.value ) == JSON.stringify(this.listaIdTipoBeneficiarioParam) ) && this.campoInativo.value === this.inativo 
    }
  }

  carregarSituacoesProcesso(){
    this.motivoNegacaoService
        .consultaSituacoesPedido()
        .subscribe(res=> {
          this.listaComboSituacoesProcesso = res.map(r => ({value: r.id, label: r.nome})).sort((a,b)=> a.label.localeCompare(b.label))
          
          if( this.idSituacaoProcessoParam ){  
            this.campoSituacaoProcesso.setValue( this.listaComboSituacoesProcesso.find(l => l.value === this.idSituacaoProcessoParam).value )
          }
        })
  }

  
}