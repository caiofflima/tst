export class UsuarioExternoDTO {

  public id: number;
  public cpf: string;
  public nome: string;
  public email: string;
  public ativo: string;
  public dataNascimento: Date;
  public codigoUsuario: string;
  public empresas: any[];
  public perfisPrestador: any[];
}
