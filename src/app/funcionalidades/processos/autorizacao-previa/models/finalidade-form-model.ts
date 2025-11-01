export class FinalidadeFormModel {
  idTipoProcesso?: number;
  idMotivoSolicitacao?: number;

  constructor(init?: Partial<FinalidadeFormModel>) {
    Object.assign(this, init);
  }

}
