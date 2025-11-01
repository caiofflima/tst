export class ProfissionalFormModel {
  idConselhoProfissional?: number;
  numeroConselho?: number;
  idEstadoConselho?: number;
  cpfCnpj?: string;
  nomeProfissional?: string;
  idMunicipioProfissional?: number;

  constructor(init?: Partial<ProfissionalFormModel>) {
    Object.assign(this, init);
  }
}
