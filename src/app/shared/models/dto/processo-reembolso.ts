export interface ProcessoReembolsoDTO {
  idPedido: number;
  descTipoProcesso: string;
  matricula: string;
  UF: string;
  dataAbertura: Date;
  descSituacaoPedido: string;
  dataInicio: Date;
  dataFim: Date;
}
