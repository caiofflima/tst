export class DetalheOcorrenciaModel {
  historicoId?: number;
  situacao?: string;
  dateSituacao?: Date;
  descricaoSituacao?: string

  constructor(init?: Partial<DetalheOcorrenciaModel>) {
    Object.assign(init, this)
  }
}
