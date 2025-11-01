import {Entity} from "../../../arquitetura/shared/models/entity";

import {Email} from "./email";
import {MotivoNegacao} from "./motivo-negacao";
import {PrazoTratamento} from "./prazo-tratamento";
import {SituacaoPedido} from "./situacao-pedido";

export class SituacaoProcesso extends Entity {
  public override id: number;
  public nome: string;
  public emails: Email[];
  public motivosNegacao: MotivoNegacao[];
  public prazosTratamentoSituacoesProcesso: PrazoTratamento[];
  public prazosTratamentoMudancasAutomaticas: PrazoTratamento[];
  public situacoesPedido: SituacaoPedido[];
  public conclusivo: string;
  public negativo: string;
  public statusEnum: string;
  public coCor: string;
  public nuTipoImagemProcesso: number;
  public nuAcaoRequeridaAgente : number;
  public deProcessoPrazoExpirado: string;
  public deMensagemProcessoSemPrazo: string;
  public mensagemProcesso: string;

  constructor(id: number, nome: string) {
    super();
    this.id = id;
    this.nome = nome;
  }

}
