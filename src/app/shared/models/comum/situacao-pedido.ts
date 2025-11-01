import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class SituacaoPedido extends Entity {
  public idPedido: number;
  public idSituacaoProcesso: number;
  public idTipoOcorrencia: number;
  public dataCadastramento: Date;
  public codigoUsuarioCadastramento: string;
  public descricaoHistorico: string;
  public pedido: any/* Pedido */;
  public situacaoProcesso: any/* SituacaoProcesso */;
  public tipoOcorrencia: any/* TipoOcorrencia */;
  public countMensagens: number;
  public countAnexos: number;
  public idAutorizacao: number;
  public isAnexoOcorrencia: boolean;
  public prazo: number;
  public diaUtil: string;
  public historicoAutomatico: string;
  public mudancaAutomatica: any/* SituacaoProcesso */;
  
}

