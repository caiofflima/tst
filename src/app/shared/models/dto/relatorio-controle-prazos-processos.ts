import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioControlePrazosProcessosDTO extends Entity {

  public override id: number;
  public idPedido: number;

  public competencia: string;
  public siglaFilial: string;
  public ufAtendimento: string;
  public tipoProcesso: string;
  public finalidade: string;
  public situacaoProcesso: string;
  public diasTempoProcesso: string;
  public maximoTempoSituacao: string;
  public maximoAtrasoSituacao: string;
  public maximoTempoProcesso: string;
  public maximoAtrasoProcesso: string;
  public quantidade: string;

}
