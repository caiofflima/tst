export class BeneficiarioForm {
  idBeneficiario?: number;
  idTipoBeneficiario: number;
  email?: string;
  telefoneContato?: string;
  nome?: string

  constructor(init?: Partial<BeneficiarioForm>) {
    Object.assign(this, init);
  }
}
