import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioProcedimentosSolicitadosPorProfissionalDTO extends Entity {

  public override id: number;
  public idPedido: number;

  public competencia: string;
  public siglaFilial: string;
  public ufAtendimento: string;
  public cpfCnpjStr: string;
  public nomeRazaoSocial: string;
  public procedimento: string;
  public quantidadeProcessos: string;
  public quantidadeProcedimentos: string;

}
