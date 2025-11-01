import { SessaoService } from 'app/arquitetura/shared/services/seguranca/sessao.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessoService} from "../../../../../shared/services/comum/processo.service";
import {fadeAnimation} from "../../../../../shared/animations/faded.animation";
import {
    AcompanhamentoCommon
} from "../../../../../shared/components/asc-acompanhamento-processo/asc-acompamento-processo-base/acompanhamento-common";
import {MessageService} from "app/shared/components/messages/message.service";
import {PermissoesSituacaoProcesso} from 'app/shared/models/fluxo/permissoes-situacao-processo';
import {ProcedimentoService} from "../../../../../shared/services/comum/procedimento.service";
import {MedicamentoService} from "../../../../../shared/services/comum/pedido/medicamento.service";
import {PatologiaService} from "../../../../../shared/services/comum/patologia.service";
import {
    MedicamentoPatologiaPedidoService
} from "../../../../../shared/services/comum/medicamento-patologia-pedido.service";
import { DocumentoPedidoService, SIASCFluxoService } from 'app/shared/services/services';
import { DocumentoFiscal } from '../../models/documento-fiscal.model';
import { NumberUtil } from 'app/shared/util/number-util';
import { PedidoProcedimento } from 'app/shared/models/entidades';

@Component({
    selector: 'asc-acompanhamento-reembolso',
    templateUrl: './acompanhamento.component.html',
    styleUrls: ['./acompanhamento.component.scss'],
    animations: [...fadeAnimation]
})

export class AcompanhamentoComponent extends AcompanhamentoCommon implements OnInit {

    override possuiDocumentosComplementares = true;
    possuiDocumentosComplementaresAnexos = false;
    possuiDocumentos = true;
    possuiAnexoDocumentos = false;
    permissoesProcesso: PermissoesSituacaoProcesso;
    apresentarDocumentoComplementar$ = false;
    mostrarBordaVermelha = false;
    possuiDocumentosObrigatoriosinvalidos = true;
    possuiDocumentosCondicionadosinvalidos = true;
    ID_REEMBOLSO_MEDICAMENTO = 8;
    ID_REEMBOLSO_VACINA = 10;

    constructor(
        override readonly activatedRoute: ActivatedRoute,
        override readonly processoService: ProcessoService,
        override readonly procedimentoService: ProcedimentoService,
        override readonly medicamentoService: MedicamentoService,
        override readonly patologiaService: PatologiaService,
        override readonly messageService: MessageService,
        override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected override readonly siascFluxoService: SIASCFluxoService,
        protected override documentoPedidoService: DocumentoPedidoService
    ) {
        super(activatedRoute, processoService, procedimentoService, medicamentoService, patologiaService, medicamentoPatologiaPedidoService, messageService, siascFluxoService, documentoPedidoService);
    }

    override get recebendoDocumentacaoTitular(): boolean {
        let situacoes = ["AGUARD_DOC_COMPLEMENTAR", "RECEBENDO_DOCUMENTACAO_TITULAR"];
        if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.situacaoProcesso) {
            return situacoes.includes(this.processo.ultimaSituacao.situacaoProcesso["statusEnum"]);
        }
        return false;
    }

    public mostrarProfissionalExecutante():boolean{
      if(this.processo !== null && this.processo !== undefined){
        if(this.processo.idTipoProcesso !== this.ID_REEMBOLSO_MEDICAMENTO && this.processo.idTipoProcesso !== this.ID_REEMBOLSO_VACINA){
          return true;
        }
      }
      return false;
    }

    carregarProcesso(): void {
      console.log("Recarregando o processo...");
  
      this.processoService.consultarPorId(this.processo.id).subscribe((processoAtualizado) => {
        this.processo = processoAtualizado;
  
        console.log("Processo atualizado:", this.processo);
      }, (error) => {
        console.error("Erro ao recarregar o processo:", error);
        this.messageService.addMsgDanger("Erro ao recarregar o processo.");
      });
    }

    pedidoProcedimentosAtualizados(pedidosProcedimento: PedidoProcedimento) {
        this.processo.pedidosProcedimento = pedidosProcedimento;
    }

    showDocumentoComplementar(valor: boolean) {
        this.apresentarDocumentoComplementar$ = valor;
    }

    get apresentarDocumentoComplementar(): boolean {
        return !this.possuiDocumentos || this.apresentarDocumentoComplementar$;
    }

    hasDocumentos(possuiDocumentos: boolean) {
        this.possuiDocumentosComplementares = possuiDocumentos
    }
    hasDocumentosinvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
      this.possuiDocumentosObrigatoriosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }
    hasDocumentosCondicionadosInvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
      this.possuiDocumentosCondicionadosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }

    hasDocumentosCondicionadosinvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
      this.possuiDocumentosCondicionadosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }

    hasAnexos(possuiAnexos: boolean) {
        this.possuiDocumentosComplementaresAnexos = possuiAnexos
    }

    hasDocumentosObrigatorio(possuiDocumentos: boolean): void {
        this.possuiDocumentos = possuiDocumentos;
    }

    hasAnexosDocumentosObrigatorio(possuiDocumentos: boolean): void {
        this.possuiAnexoDocumentos = possuiDocumentos;
    }

    getSituacoesPorPerfil(perfil:number):any{
      let situacoes = [];
  
      if(perfil === 2060){
        situacoes.push(47);
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
        situacoes.push(i);
      }
      return situacoes;
  }
  public mostrarCardSituacao(): boolean {
    // console.log("Iniciando verificação para mostrar o card de situação.");
    // console.log("Estado atual - processo:", this.processo);
    // console.log("Estado atual - permissoes:", this.permissoes);
    // console.log("Estado atual - apresentarSituacao:", this.apresentarSituacao);
  
    if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.idSituacaoProcesso) {
      //console.log("Processo encontrado com idSituacaoProcesso:", this.processo.ultimaSituacao.idSituacaoProcesso);
  
      if (this.processo.ultimaSituacao.idSituacaoProcesso > 46 && this.processo.ultimaSituacao.idSituacaoProcesso < 52) {
        //console.log("idSituacaoProcesso está entre 47 e 51.");
        const resultado = this.mostrarSituacaoPorAlcada();
        //console.log("Resultado de mostrarSituacaoPorAlcada:", resultado);
        return resultado;
      }
    }
  
    if (this.permissoes && this.permissoes.analisar && this.apresentarSituacao) {
      //console.log("Permissões de análise encontradas e apresentação de situação ativada.");
      return true;
    }
  
    //console.log("Nenhuma condição satisfeita para mostrar o card de situação.");
    return false;
  }
  
  public mostrarSituacaoPorAlcada(): boolean {
    // console.log("Verificando situação por alçada.");
    // console.log("Estado atual - permissoes:", this.permissoes);
    // console.log("Estado atual - apresentarSituacao:", this.apresentarSituacao);
  
    if (this.permissoes && this.permissoes.analisar && this.apresentarSituacao && this.isAlcadaPermitida()) {
      //console.log("Permissões de análise e alçada permitida.");
      return true;
    }
  
    //console.log("Condição para mostrar situação por alçada não satisfeita.");
    return false;
  }
  
  isAlcadaPermitida(): boolean {
    //console.log("Verificando se a alçada é permitida.");
    //console.log("Estado atual - SessaoService.usuarioSouCaixaDTO:", SessaoService.usuarioSouCaixaDTO);
  
    if (SessaoService.usuarioSouCaixaDTO && SessaoService.usuarioSouCaixaDTO.nuFuncao) {
      const nuFuncao = SessaoService.usuarioSouCaixaDTO.nuFuncao;
      //console.log("Número de função do usuário:", nuFuncao);
  
      const situacoes = this.getSituacoesPorPerfil(nuFuncao);
      //console.log("Situações permitidas para o perfil:", situacoes);
      //console.log("Estado atual - processo.ultimaSituacao:", this.processo.ultimaSituacao);
  
      if (situacoes.length > 0 && this.processo.ultimaSituacao && this.processo.ultimaSituacao.idSituacaoProcesso) {
        //console.log("idSituacaoProcesso atual:", this.processo.ultimaSituacao.idSituacaoProcesso);
  
        if (situacoes.includes(this.processo.ultimaSituacao.idSituacaoProcesso)) {
          //console.log("Alçada permitida para a situação atual.");
          return true;
        }
      }
    }
  
    //console.log("Alçada não permitida.");
    return false;
  }
  

}
