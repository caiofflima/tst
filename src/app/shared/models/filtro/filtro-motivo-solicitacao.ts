export class FiltroMotivoSolicitacao {

  public nome: string = null;
  public codigo: string = null;
  public ativos: string = null;


  public montarQueryString(): string {
    const queryParams: string[] = [];

    if (this.codigo !== null) {
      queryParams.push(`codigo=${this.codigo}`);
    }
    if (this.nome !== null) {
      queryParams.push(`nome=${this.nome}`);
    }
   
    if (this.ativos !== null) {
      queryParams.push(`ativos=${this.ativos}`);
    }

    return queryParams.join('&');
  }

}
