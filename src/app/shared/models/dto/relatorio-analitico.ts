import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioAnaliticoDTO extends Entity {

  public override id: number;
  public idPedido: number;

  public numeroProcesso: string;
  public dataAbertura: string;
  public dataEncerramento: string;
  public tipoProcesso: string;
  public situacaoProcesso: string;
  public nomeBeneficiario: string;
  public cartaoBeneficiario: string;
  public matriculaTitular: string;
  public cpfCnpjStr: string;
  public nomeRazaoSocial: string;
  public motivoNegacao: string;
  public justificativa: string;
  public opme: string;
  public dataLiberacao: string;
  public tempoSituacao: string;
  public atrasoSituacao: string;
  public tempoProcesso: string;
  public atrasoProcesso: string;


}
