import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioJuntaMedicaOdontologicaDTO extends Entity {

  public override id: number;
  public idPedido: number;

  public siglaFilial: string;
  public ufAtendimento: string;
  public numeroProcesso: string;
  public dataAbertura: string;
  public dataEncerramento: string;
  public tipoProcesso: string;
  public nomeBeneficiario: string;
  public cartaoBeneficiario: string;
  public matriculaTitular: string;
  public cpfCnpjStr: string;
  public nomeRazaoSocial: string;
  public procedimento: string;
  public opme: string;
  public dataTentativaConsenso: string;
  public dataComunJunta: string;
  public dataResultado: string;
  public resultado: string;

}
