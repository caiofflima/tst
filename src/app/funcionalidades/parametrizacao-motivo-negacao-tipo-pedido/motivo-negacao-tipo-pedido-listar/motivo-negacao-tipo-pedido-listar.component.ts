import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'app/shared/components/base.component';
import { Loading } from 'app/shared/components/loading/loading-modal.component';
import { MotivoNegacaoTipoPedido } from 'app/shared/models/comum/motivo-negacao-tipo-pedido';
import { SimNaoEnum } from 'app/shared/models/entidades';
import { MotivoNegacaoTipoPedidoService } from 'app/shared/services/comum/motivo-negacao-tipo-pedido.service';
import { MessageService } from 'app/shared/services/services';

@Component({
  selector: 'asc-motivo-negacao-tipo-pedido-listar',
  templateUrl: './motivo-negacao-tipo-pedido-listar.component.html',
  styleUrls: ['./motivo-negacao-tipo-pedido-listar.component.scss']
})
export class MotivoNegacaoTipoPedidoListarComponent extends BaseComponent{
  listaIdTipoProcesso: any[] = []
  listaIdTipoBeneficiario: any[] = [];
  listaIdMotivoNegacao: any[] = []
  listaIcNivelNegacao: string
  override baseURL: string
  override baseTitulo: string
  lista: MotivoNegacaoTipoPedido[] = []
  total: number
  listaMotivoNegacao: string[] = []
  listaTipoProcesso: string[] = []
  listaTipoBeneficiario: string[] = []
  listaNiveisNegacao: string
  somenteAtivos: boolean
  constructor(
    override readonly messageService: MessageService,
    private service: MotivoNegacaoTipoPedidoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.listaIdTipoProcesso = this.activatedRoute.snapshot.queryParams['listaIdTipoProcesso']
    this.listaIcNivelNegacao = this.activatedRoute.snapshot.queryParams['listaIcNivelNegacao']
    this.listaNiveisNegacao = this.activatedRoute.snapshot.queryParams['listaNiveisNegacao']
    this.listaIdTipoBeneficiario = this.activatedRoute.snapshot.queryParams['listaIdTipoBeneficiario']
    this.listaIdMotivoNegacao = this.activatedRoute.snapshot.queryParams['listaIdMotivoNegacao'] || []
    this.listaMotivoNegacao = this.activatedRoute.snapshot.queryParams['listaMotivoNegacao'] || 'Todas'
    this.listaTipoProcesso = this.activatedRoute.snapshot.queryParams['listaTipoProcesso'] || 'Todas'
    this.listaTipoBeneficiario = this.activatedRoute.snapshot.queryParams['listaTipoBeneficiario'] || 'Todas'
    this.somenteAtivos = this.activatedRoute.snapshot.queryParams['somenteAtivos'] == 'true'


    this.baseURL = this.service.getBaseURL()
    this.baseTitulo = this.service.getTitulo()

    this.pesquisarDados()
  }

  pesquisarDados(){
    Loading.start()
    const dto: MotivoNegacaoTipoPedido = new MotivoNegacaoTipoPedido();
    this.analistaIdMotivacao(dto)

    if( this.listaIdTipoBeneficiario )
      dto.listaIdTipoBeneficiario = Array.isArray( this.listaIdTipoBeneficiario ) ? this.listaIdTipoBeneficiario : [ this.listaIdTipoBeneficiario ];

    if( this.listaIdTipoProcesso )
      dto.listaIdTipoProcesso = Array.isArray( this.listaIdTipoProcesso ) ? this.listaIdTipoProcesso : [this.listaIdTipoProcesso];

    dto.inativo = !this.somenteAtivos
    if( this.listaIcNivelNegacao )
      dto.nivelDeNegacao = this.listaIcNivelNegacao

    this.service
        .obterListaDeDados(dto)
        .subscribe((resp: MotivoNegacaoTipoPedido[])=>{
          Loading.stop()
          if( resp ){
            this.total = resp.length || 0
            this.lista = resp.map(r => ({...r, _inativo: r.dataInativacao ? 'SIM' : 'NÃO'}))
          }

        })
  }

  analistaIdMotivacao(dto: MotivoNegacaoTipoPedido){
    if( this.listaIdMotivoNegacao  )
      dto.listaIdMotivoNegacao = Array.isArray( this.listaIdMotivoNegacao ) ? this.listaIdMotivoNegacao : [this.listaIdMotivoNegacao];
  }

  voltar(){
    this.location.back()
  }

  novo(){
    this.router.navigate([`${this.baseURL}/novo`])
  }

  editar(row: any){

    const objetoParametro =  JSON.stringify( {
      atualizar: true,
      motivoNegacao: row.motivoNegacao.id,
      tipoProcesso: row.tipoProcesso.id,
      listaBeneficiarios: row.listaIdTipoBeneficiario,
      nivelNegacao: row.nivelNegacao,
      dataInativacao: row.dataInativacao,
      situacaoProcesso: row.idSituacaoProcesso
    } )

    let base64String = btoa(objetoParametro);

    this.router.navigate([`${this.baseURL}/editar/${base64String}`])

  }

}
