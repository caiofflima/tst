export class FiltroPatologia {

  public nome: string;
  public codigo: string;
  public evento: string;
  public percReembolso: number;
  public teto: string;
  public pf: string;
  public ativos: string;


  public montarQueryString(): string {
    const queryParams: string[] = [];

    if (this.codigo !== null) {
      queryParams.push(`codigo=${this.codigo}`);
    }
    if (this.nome !== null) {
      queryParams.push(`nome=${this.nome}`);
    }
    if (this.evento !== null) {
      queryParams.push(`evento=${this.evento}`);
    }
    if (this.percReembolso !== null) {
      queryParams.push(`percReembolso=${this.percReembolso}`);
    }
    if (this.teto !== null) {
      queryParams.push(`teto=${this.teto}`);
    }
    if (this.pf !== null) {
      queryParams.push(`pf=${this.pf}`);
    }
    if (this.ativos !== null) {
      queryParams.push(`ativos=${this.ativos}`);
    }

    return queryParams.join('&');
  }

}
