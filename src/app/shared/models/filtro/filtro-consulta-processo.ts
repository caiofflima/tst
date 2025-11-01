import { DadoComboDTO } from './../dto/dado-combo';


export class FiltroConsultaProcesso {

  public idPedido: number = null;
  public tiposProcesso: DadoComboDTO[] = [];
  public situacoesProcesso: DadoComboDTO[] = [];
  public condicaoProcesso: DadoComboDTO = new DadoComboDTO();

  public ufsProcesso: DadoComboDTO[] = [];
  public filiaisProcesso: DadoComboDTO[] = [];
  public ufAtendimento: DadoComboDTO = new DadoComboDTO();
  public municipioAtendimento: DadoComboDTO = new DadoComboDTO();

  public tiposBeneficiario: DadoComboDTO[] = [];
  public matriculaTitular: number = null;
  public codigoBeneficiario: number = null;
  public numeroCartao: number = null;
  public nomeBeneficiario: string = "";
  public caraterSolicitacao: DadoComboDTO = new DadoComboDTO();
  public matriculaUltimoUsuario: string = "";

  private dataAtual?: Date = new Date();
  public dataAberturaInicio?: Date = new Date(new Date().setDate(this.dataAtual.getDate() - 30));
  public dataAberturaFim?: Date = this.dataAtual;

  public autorizacaoPreviaGstao: number = null;
  public autorizacaoReembolso?: number = null;

  public motivosSolicitacao?: DadoComboDTO[] = [];
  public tiposPedido?: DadoComboDTO[] = [];
}
