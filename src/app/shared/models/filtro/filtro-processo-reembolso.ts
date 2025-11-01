import { DadoComboDTO } from './../dto/dado-combo';

export class FiltroProcessoReembolso {
  public processo: string;
  public ufsProcesso: DadoComboDTO[] = [];
  public empresasAuditoria: DadoComboDTO[] = [];
  public dataInicio: string;
  public dataFim: string;
  public tipoProcesso: DadoComboDTO[] = [];

  public descUfsProcesso:  string;
  public descEmpresasAuditoria: string;
  public idsUfsProcesso:  number;
  public idsEmpresasAuditoria: number;
  public descTipoProcesso: string;
  public idsTipoProcesso:  number;

  public montarQueryString(): string {
    const queryParams: string[] = [];

    if (this.processo !== null) {
      queryParams.push(`processo=${this.processo}`);
    }

    if (this.dataInicio !== null) {
      queryParams.push(`dataInicio=${this.dataInicio}`);
    }

    if (this.dataFim !== null) {
      queryParams.push(`dataFim=${this.dataFim}`);
    }

    if (this.ufsProcesso !== null) {
      queryParams.push(`ufsProcesso=${this.ufsProcesso}`);
    }

    if (this.empresasAuditoria !== null) {
      queryParams.push(`empresasAuditoria=${this.empresasAuditoria}`);
    }

    return queryParams.join('&');
  }

}
