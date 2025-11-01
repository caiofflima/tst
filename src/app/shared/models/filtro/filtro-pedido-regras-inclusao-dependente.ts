
export class FiltroPedidoRegrasInclusaoDependente {

  public cpf: string;
  public idTipoBeneficiario: number;
  public nome: string;
  public dataNascimento: string;

  constructor(cpf: string, idTipoBeneficiario: number, nome: string, dataNascimento: string){
      this.cpf = cpf;
      this.idTipoBeneficiario = idTipoBeneficiario;
      this.nome = nome;
      this.dataNascimento = dataNascimento;
  }

}
