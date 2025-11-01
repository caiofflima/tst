import { DadoComboDTO } from './../dto/dado-combo';
import { Entity } from "../../../../app/arquitetura/shared/models/entity";



export class FiltroRelatorioProcedimentosSolicitadosPorProfissional {

  public idPedido: number;
  public tiposProcesso: DadoComboDTO[] = [];
  public situacoesProcesso: DadoComboDTO[] = [];
  public condicaoProcesso: DadoComboDTO = new DadoComboDTO();

  public ufsProcesso: DadoComboDTO[] = [];
  public filiaisProcesso: DadoComboDTO[] = [];
  public ufAtendimento: DadoComboDTO = new DadoComboDTO();
  public municipioAtendimento: DadoComboDTO = new DadoComboDTO();
  public procedimento: DadoComboDTO[] = [];

  public tiposBeneficiario: DadoComboDTO[] = [];
  public matriculaTitular: number;
  public codigoBeneficiario: number;
  public numeroCartao: number;
  public nomeBeneficiario: string = "";
  public caraterSolicitacao: DadoComboDTO = new DadoComboDTO();
  public matriculaUltimoUsuario: string = "";
  public idMotivoSolicitacao: number;
  public dataInicio: Date;
  public dataFim: Date;
  public autorizacaoPreviaGstao: number;


}
