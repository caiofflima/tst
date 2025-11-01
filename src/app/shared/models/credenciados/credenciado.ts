import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class Credenciado extends Entity {
  public nome: string;
  public uf: string;
  public municipio: string;
  public bairro: string;
  public nomeEspecialidade: string;
  public codEspecialidade: string;
  public nomeCredenciado: string;
  public cpfCnpj: string;
  public tipoCredenciado: string;
  public conselhoProfissional: string;
  public latitude: number;
  public longitude: number;
  public logadouro: string;
  public complemento: string;
  public numero: string;
  public cep: string;
  public telefone1: string;
  public telefone2: string;
  public telefone3: string;
  public email: string;
  public site: string;
  public qualificacoes: Array<string> = new Array<string>();
}
