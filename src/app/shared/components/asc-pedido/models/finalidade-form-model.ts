export class FinalidadeFormModel {
  idTipoProcesso?: number;
  idMotivoSolicitacao?: number;
  nome?: string;

  constructor(init?: Partial<FinalidadeFormModel>) {
    Object.assign(this, init);
  }

}
