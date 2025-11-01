import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { take } from "rxjs/operators";
import {ActivatedRoute, Router} from '@angular/router';

import {SIASCFluxoService} from 'app/shared/services/comum/siasc-fluxo.service';
import {isNotUndefinedNullOrEmpty} from "app/shared/constantes";
import { BaseComponent } from "app/shared/components/base.component";
import { BundleUtil } from "app/arquitetura/shared/util/bundle-util";
import { Pageable } from "app/shared/components/pageable.model";
import { ProcessoDTO } from "app/shared/models/dto/processo";
import { FiltroConsultaProcesso } from "app/shared/models/filtro/filtro-consulta-processo";
import { somenteNumeros } from "app/shared/constantes";
import { DadoComboDTO } from "app/shared/models/dto/dado-combo";
import {ProcedimentoService, MessageService} from "app/shared/services/services";
import { SituacaoPedidoService } from "app/shared/services/comum/situacao-pedido.service";
import { SessaoService } from 'app/shared/services/services';
import { ProcessoService } from "app/shared/services/comum/processo.service";
import { AtendimentoService } from "app/shared/services/comum/atendimento.service";
import { UsuarioSouCaixaDTO } from "app/shared/models/comum/usuario-soucaixa-dto.model";
import {Loading} from "app/shared/components/loading/loading-modal.component";
import {PermissoesSituacaoProcesso} from 'app/shared/models/fluxo/permissoes-situacao-processo';
import {
  isTipoProcessoAltearDependente,
  istipoProcessoAutorizacaoPrevia,
  isTipoProcessoCancelamentoDependente,
  isTipoProcessoInscricaoDependente,
  isTipoProcessoInscricaoProgramas,
  isTipoProcessoReembolsoById,
  isTipoProcessoRenovacaoDependente
} from "app/shared/components/asc-pedido/models/tipo-processo.enum";

@Component({
  selector: "app-list-procedimentos",
  templateUrl: "./liberacao-alcada-listar.component.html",
  styleUrls: ["./liberacao-alcada-listar.component.scss"],
})
export class LiberacaoAlcadaListarComponent
  extends BaseComponent
  implements OnInit
{

  loading: boolean = true;
  rowCounter: number = 10;
  listaProcessos: ProcessoDTO[];
  totalProcessos: number;
  usuarioSouCaixaDTO: UsuarioSouCaixaDTO;
  matricula: any;
  nome: any;
  situacaoPermitida: number= null;
  permissoesProcesso: PermissoesSituacaoProcesso;
  mostrarTabela: boolean = false;

  TESTE_PERFIL = 2060;

  arrayTiposProcesso : DadoComboDTO[] = [
    {
      label: "REEMBOLSO - CONSULTA",
      value: 7,
      descricao: "REEMBOLSO - CONSULTA",
    },
    {
      label: "REEMBOLSO - MEDICAMENTO",
      value: 8,
      descricao: "REEMBOLSO - MEDICAMENTO",
    },
    {
      label: "REEMBOLSO - ODONTOLÓGICO",
      value: 9,
      descricao: "REEMBOLSO - ODONTOLÓGICO",
    },
    {
      label: "REEMBOLSO - OUTROS",
      value: 6,
      descricao: "REEMBOLSO - OUTROS",
    },
    {
      label: "REEMBOLSO - VACINA",
      value: 10,
      descricao: "REEMBOLSO - VACINA",
    },
  ];

  funcoes: any[] = [
  {NU_FUNCAO: 2060,	NO_FUNCAO: "SUPERVISOR CENTR FILIAL", ATUACAO_SIASC: "SUPERVISOR DE CENTRALIZADORA", SITUACAO:47},	
  {NU_FUNCAO: 2468,	NO_FUNCAO: "COORD CENTRAL FILIAL 6H", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},	
  {NU_FUNCAO: 2061,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},		
  {NU_FUNCAO: 2062,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},		
  {NU_FUNCAO: 2063,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},	
  {NU_FUNCAO: 2064,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},
  {NU_FUNCAO: 2065,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},
  {NU_FUNCAO: 2079,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},
  {NU_FUNCAO: 2080,	NO_FUNCAO: "COORDENADOR CENTR FILIAL", ATUACAO_SIASC: "COORDENADOR CENTRALIZADORA", SITUACAO:48},
  {NU_FUNCAO: 2141,	NO_FUNCAO: "GERENTE DE FILIAL", ATUACAO_SIASC: "GERENTE CENTRALIZADORA", SITUACAO:49},	
  {NU_FUNCAO: 2038,	NO_FUNCAO: "GERENTE NACIONAL", ATUACAO_SIASC: "GERENTE NACIONAL", SITUACAO:50},	
  {NU_FUNCAO: 2048,	NO_FUNCAO: "SUPERINTENDENTE NACIONAL", ATUACAO_SIASC: "SUPERINTENDENTE NACIONAL", SITUACAO:51}
  ];

  titulo: string = 'Liberar Alçada de Reembolso'
  constructor(
    private readonly procedimentoService: ProcedimentoService,
    private readonly location: Location,
    override readonly messageService: MessageService,
    private readonly processoService: ProcessoService,
    private situacaoPedidoService: SituacaoPedidoService,
    private readonly atendimentoService: AtendimentoService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly siascFluxoService: SIASCFluxoService
  ) {
    super(messageService);
  }

  ngOnInit() {
    Loading.start();
    this.carregarAtendimento();
  }

  private isAmbiente(ambiente:string, auxiliar:string):boolean{
    let url = document.location.href;

    return ( (url.toLowerCase().indexOf(ambiente.toLowerCase()) >=0)
            ||  (url.toLowerCase().indexOf(auxiliar.toLowerCase()) >=0) );
  }

  public selectAllState = false;
  public idSelecionados: number[] = [];
  public atualItems = [];

  @ViewChild("datatable") dataTable: any;

  mudarSelecao(id: number) {
    const index = this.idSelecionados.indexOf(id);

    if (index === -1) {
      this.idSelecionados.push(id);
    } else {
      this.idSelecionados.splice(index, 1);
    }
    this.selectAllState = this.listaProcessos.every((item) =>
      this.idSelecionados.includes(item.idPedido)
    );

    this.checkItemsPage();
    //console.log("this.idSelecionados");
    //console.log(this.idSelecionados);
  }

  public checkItemsPage() {
    this.selectAllState = this.atualItems.every((item) =>
      this.idSelecionados.includes(item)
    );
  }

  public updateAtualItems() {
    this.atualItems = this.getAtualItems();
    this.checkItemsPage();
    //console.log(this.dataTable.filteredValue);
  }

  public onPageChange(event: any) {
    // this.atualItems = this.getAtualItems();
    // this.checkItemsPage();
    //console.log('total', this.atualItems);
    //console.log('selecionados', this.idSelecionados);
  }

  public getAtualItems() {
    const first = this.dataTable.first;
    const last = first + this.dataTable.rows;
    if (this.dataTable.filteredValue) {
      return this.dataTable.filteredValue
        .map((item) => {
          return item.idPedido;
        })
        
    } else {
      return this.listaProcessos
        .map((item) => {
          return item.idPedido;
        })
        
    }
  }

  public selectAll() {
    this.atualItems = this.getAtualItems();
    //console.log(this.atualItems);

    if (this.selectAllState) {
      this.atualItems.forEach((item) => {
        this.idSelecionados.push(item);
      });
      this.idSelecionados = this.removeDuplicate(this.idSelecionados);
    } else {
      this.idSelecionados = [];
    }
    //console.log("this.idSelecionados");
    //console.log(this.idSelecionados);
  }

  inicializar() {
    this.selectAllState = false;
    this.idSelecionados = [];
    this.atualItems = [];
    this.idSelecionados = [];
  }

  public removeDuplicate(array: any) {
    return array.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }

  voltar(): void {
    this.location.back();
  }

  public override bundle(key: string, args?: any): string {
    return BundleUtil.fromBundle(key, args);
  }

  formatarTextoConfirmacaoAlcada(numeroDeItens: number): string{
    let texto = 'Tem certeza que deseja liberar o pedido selecionado?';
    if(numeroDeItens > 1){
      texto = 'Tem certeza que deseja liberar os '+this.idSelecionados.length+' pedidos selecionados?';
    }
    return texto;
  }

  habilitarBotao(): boolean {
    return this.idSelecionados !== null && this.idSelecionados.length > 0;
  }

  formatarMatricula(matriculaFormatar: string): string{
    if(matriculaFormatar === null || matriculaFormatar === undefined){
      return matriculaFormatar;
    }
    let matriculaAux = somenteNumeros(matriculaFormatar);
    
    if(matriculaAux.length > 6){
      matriculaAux = matriculaAux.slice(0,-1);
    }
    return matriculaAux;
  }

  stopLoading(){
    this.loading = false;
  }

  //CARREGAR ATENDIMENTO
  carregarAtendimento() {
    this.matricula = this.formatarMatricula(SessaoService.usuario.matricula);
    this.nome = SessaoService.usuario.nome;
    this.persquisarPorFuncao();
  }
  //->FIM
  
  criarSituacao(rotulo: string, valor: number, desc: string):any{
    let situacao = {
      label: rotulo,
      value: valor,
      descricao: desc,
    }
    return situacao;
  }

  getSituacoesPorPerfil(perfil:number):any{
    let situacoes = [];

    if(perfil === 2060){
      situacoes.push(this.criarSituacao("", 47, ""));
    } else if([2468, 2061, 2062, 2063, 2064, 2065, 2079, 2080].includes(perfil)){
      situacoes.push(...this.gerarSituacoesPorIntervalo(47, 48));
    } else if(2141 === perfil){
      situacoes.push(...this.gerarSituacoesPorIntervalo(47, 49));
    } else if(2038 === perfil){
      situacoes.push(...this.gerarSituacoesPorIntervalo(47, 50));
    } else if(2048 === perfil){
      situacoes.push(...this.gerarSituacoesPorIntervalo(47, 51));
    }

    return situacoes;
  }

  gerarSituacoesPorIntervalo(ini:number, fim:number):any{
    let situacoes = [];
    for(let i = ini; i <= fim; i++){
      situacoes.push(this.criarSituacao("", i, ""));
    }
    return situacoes;
  }

  gerarFiltro(): any{
    let filtro = new FiltroConsultaProcesso();
    filtro.tiposProcesso = this.arrayTiposProcesso;
    filtro.dataAberturaFim = null;
    filtro.dataAberturaInicio = null;
    filtro.situacoesProcesso = this.getSituacoesPorPerfil(this.usuarioSouCaixaDTO.nuFuncao); 
    //filtro.situacoesProcesso = this.getSituacoesPorPerfil(this.TESTE_PERFIL);

    return filtro;
  }

  pesquisar() {
    let filtro = this.gerarFiltro();

    this.loading = true;

    if(filtro.situacoesProcesso != null && filtro.situacoesProcesso != undefined && filtro.situacoesProcesso.length > 0){
      this.mostrarTabela=true;

      this.processoService
      .consultarComBeneficiario(filtro)
      .pipe(take<Pageable<ProcessoDTO>>(1))
      .subscribe(
        async (pageable) => {
          //console.log('dados', pageable.dados);
          //console.log('total', pageable.total);
          this.listaProcessos = pageable.dados;
          this.totalProcessos = pageable.total;
          //console.log(this.dataTable.filteredValue);
          this.stopLoading();
          //console.log(this.listaProcessos);
        },
        (err) => {
          this.stopLoading();
          this.showDangerMsg(err.error);
        }
      );
    }else{
      this.stopLoading();
    }
  }

  persquisarPorFuncao() {

      if(this.matricula !== null && this.matricula !== undefined){
        this.processoService.getUsuarioSouCaixa(this.matricula).subscribe(res => {
          if (res) {
            this.usuarioSouCaixaDTO = res;
            //console.log(res);
            this.pesquisar();
          }else{
            this.stopLoading();
            //console.log("Nenhum usuário encontrado. [ " + this.matricula+" ]");
          }
          
        }, (err) => {
          console.log(err.error);
          console.log(err.message);
          this.messageService.addMsgDanger("Serviço temporariamente indisponível. Tente mais tarde.");
        }, () => {
          //this.stopLoading("");
        });
      }
  }

  liberarAlcada() {
    //console.log(this.idSelecionados);

    if (this.idSelecionados !== null && this.idSelecionados.length > 0) {
      if( window.confirm(this.formatarTextoConfirmacaoAlcada(this.idSelecionados.length)) ){
        this.situacaoPedidoService.liberacaoAlcada(this.idSelecionados).subscribe(
          (res) => {
            this.messageService.showSuccessMsg('Alteração Realizada com Sucesso.');
            this.inicializar();
            this.pesquisar();
          },
          (error) => {
            this.stopLoading();
            console.log(error.error);
            this.messageService.showDangerMsg(error.error);
          }
        );
      }else{
        //console.log("Recusou confirmar.");
      }
    }else{
      console.log("Nenhum registro selecionado.");
    }
  }

  editar(row: ProcessoDTO) {
      const urlAtiva = this.activatedRoute.snapshot['_routerState'].url;
      const toAcompanhar = "meus-dados/pedidos";
      this.siascFluxoService.consultarPermissoesFluxoPorPedido(row.idPedido).subscribe(async res => {
          this.permissoesProcesso = res;
          if (this.permissoesProcesso.acessar) {
              let url;
              if (urlAtiva.includes(toAcompanhar)) {
                  url = this.definirRotasAcompanhamento(row.idPedido, row.idTipoProcesso);
              } else {
                  url = this.definirRotasAnalise(row.idPedido, row.idTipoProcesso);
              }
              await this.router.navigateByUrl(url);
          } else {
              this.showDangerMsg('MA001');
          }
      }, error => this.showDangerMsg(error.error));
  }

  private definirRotasAcompanhamento(idPedido: number, idTipoProcesso: number): string {
    return this.definirRotas(idPedido, idTipoProcesso, "acompanhamento");
}

private definirRotasAnalise(idPedido: number, idTipoProcesso: number): string {
    return this.definirRotas(idPedido, idTipoProcesso, "analise");
}

private definirRotas(idPedido: number, idTipoProcesso: number, analiseOrAcompanhamento: string): string {
    const dictionaryRoutesAcompanhamento = [{
        predicate: istipoProcessoAutorizacaoPrevia,
        route: `/pedidos/autorizacao-previa/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoReembolsoById,
        route: `/pedidos/reembolso/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoInscricaoProgramas,
        route: `/pedidos/inscricao/programas-medicamentos/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoInscricaoDependente,
        route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoRenovacaoDependente,
        route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoCancelamentoDependente,
        route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
    }, {
        predicate: isTipoProcessoAltearDependente,
        route: `/dependente/${idPedido}/${analiseOrAcompanhamento}`
    }];

    const routerAcompanhamento = dictionaryRoutesAcompanhamento.find(
        register => register.predicate(idTipoProcesso)
    );

    if (isNotUndefinedNullOrEmpty(routerAcompanhamento)) {
        return routerAcompanhamento.route;
    }

    return '/pedidos/autorizacao-previa';
  }
}
