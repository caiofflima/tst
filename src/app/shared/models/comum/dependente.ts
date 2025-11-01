import {Entity} from "../../../arquitetura/shared/models/entity";
import { DadoComboDTO } from "../../../shared/models/dto/dado-combo";

export class Dependente extends Entity {
  public idTipoBeneficiario?: string;
  public matricula?: string;
  public nomeCompleto?: string;
  public cpf?: string;
  public nomeMae?: string;
  public nomePai?: string;
  public declaracaoNascidoVivo?: string;
  public sexo?: DadoComboDTO;
  public dataNascimento?: Date;
  public idEstadoCivil?: string;
  public rg?: number;
  public orgaoEmissor?: string;
  public dataExpedicaoRg?: Date;
  public estado?: number;
  public municipio?: number;
  public idTipoDeficiencia?: number;
  public cartaoNacionalSaude?: string;
  public cartaoUnimed?: string;
  public renda?: number;
  public email?: string;
  public telefoneContato?: string;

  constructor(init?: Partial<Dependente>) {
    super();
    Object.assign(this, init);
  }
}
