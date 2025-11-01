import {Entity} from "../../../../app/arquitetura/shared/models/entity";

export class RelatorioControleProcessosAnalistaDTO extends Entity {

  public idPedido: number;
  public idSituacaoPedido: number;
  public idTipoBeneficiario: number;
  public idTipoProcesso: number;
  public idBeneficiario: number;
  public idFilial: number;
  public idMunicipioAtendimento: number;
  public codTipoProcesso: string;
  public nomeColaborador: string;
  public abrevTipoBeneficiario: string;
  public descBeneficiario: string;
  public descSituacaoPedido: string;
  public descTipoBeneficiario: string;
  public descTipoProcesso: string;
  public dataUltimaAlteracao: Date;
  public filial: string;
  public matriculaUltimoUsuario: string;
  public maximoValorUnitarioPago: number;
  public protocoloAns: string;
  public stConclusivo: string;
  public stNegativo: string;
  public statusIcon: string;

}
