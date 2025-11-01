import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class TipoBeneficiarioDTO extends Entity {
  public idGestaoBeneficiario: number;
  public descricao: string;
  public siglaTipoBeneficiario: string;
  public tipoLegado: number;
  public codigoLegadoDependencia: string;
  public parentesco: number;
  public dataInicioAtivacao: Date;
  public dataFimAtivacao: Date;
  public ativo: boolean;
  public situacaoBeneficiario: boolean;
  public renovavel: boolean;
  public reativavel: boolean;
  public pensao: boolean;
  public judicial: boolean;
  public titular: boolean;
  public pdpi: boolean;
  public restrito: boolean;
  public casalCaixa: boolean;
  public idadeMinima: number;
  public idadeMaxima: number;
  public codigoGestaoAns: number;
  public codigoRelacaoDependencia: string;
}
