
export class FiltroPedidoRegrasInclusao {

  public idTipoProcesso: number ;
  public idBeneficiario: number ;
  public idMotivoSolicitacao: number ;
  public cpf: string ;

  constructor(idTipoProcesso: number,idBeneficiario: number, idMotivoSolicitacao: number, cpf: string){
      this.idTipoProcesso = idTipoProcesso;
      this.idBeneficiario = idBeneficiario;
      this.idMotivoSolicitacao = idMotivoSolicitacao;
      this.cpf = cpf;
    }

}
