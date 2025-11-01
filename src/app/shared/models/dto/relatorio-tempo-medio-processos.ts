import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioTempoMedioProcessosDTO extends Entity {

  public override id: number;
  public idPedido: number;

  public competencia: string;
  public siglaFilial: string;
  public ufAtendimento: string;
  public tipoProcesso: string;
  public tempoMedio: string;
  public quantidadeTotal: string;
  public quantidadeAtraso: string;

}
