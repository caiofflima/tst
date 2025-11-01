export class SolicitacaoFormModel {
  idBeneficiario?: number;
  idTipoBeneficiario: number;
  email?: string;
  telefoneContato?: string;

  constructor(init?: Partial<SolicitacaoFormModel>) {
    Object.assign(this, init);
  }
}
