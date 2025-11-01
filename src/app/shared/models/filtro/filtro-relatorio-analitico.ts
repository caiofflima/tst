import { DadoComboDTO } from './../dto/dado-combo';
import { Entity } from "../../../../app/arquitetura/shared/models/entity";



export class FiltroRelatorioAnalitico {

  public idPedido: number;
  public idsPedido: number[] = [];
  public relatorioOrigem: string = "";

  public tiposProcesso: DadoComboDTO[] = [];
  public situacoesProcesso: DadoComboDTO[] = [];
  public condicaoProcesso: DadoComboDTO = new DadoComboDTO();

  public ufsProcesso: DadoComboDTO[] = [];
  public filiaisProcesso: DadoComboDTO[] = [];
  public ufAtendimento: DadoComboDTO = new DadoComboDTO();
  public municipioAtendimento: DadoComboDTO = new DadoComboDTO();
  public tiposBeneficiario: DadoComboDTO[] = [];
  public matriculaTitular: number;
  public codigoBeneficiario: number;
  public numeroCartao: number;
  public nomeBeneficiario: string = "";
  public caraterSolicitacao: DadoComboDTO = new DadoComboDTO();
  public matriculaUltimoUsuario: string = "";



}
