import { Entity } from "../../../../app/arquitetura/shared/models/entity";


export class MotivoCancelamento extends Entity {
  public override id: number;
  public cancelamentobenefweb: string;
  public cancelamentomoduloweb: string;
  public cancelarbenefindicados: string;
  public cobrarsaldocontaparc: string;
  public codigo: number;
  public codigoans: number;
  public codigoexportacao: string;
  public decimoterceiroproporcional: string;
  public descricao: string;
  public enviadmed: string;
  public flagcoibirnovaadesao: string;
  public motivocancbenefsibxml: number;
  public naofaturarbenefdatacancadesao: string;
  public naogerardocumento: string;
  public prazominimocancelamento: number;
  public prazominimoreativacao: number;
  public prorrogacao: number;
  public suportareativacao: string;
  public tipo: string;
  public zGrupo: number;
}
