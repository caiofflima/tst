import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";

export class BeneficiarioDependenteFormModel {
    nomeCompleto?: string = null;
    matricula?: any = null;
    cpf?: string = null;
    nomeMae?: string = null;
    nomePai?: string = null;
    dataNascimento: Date = null;
    sexo: DadoComboDTO = null;
    estadoCivil?: number = null;
    email?: string = null;
    telefoneContato?: string = null;
    idTipoBeneficiario?: number = null;
    idBeneficiario?: number = null;
    idMotivoSolicitacao?: number = null;
    emailDependente?: string = null;
    constructor(init?: Partial<BeneficiarioDependenteFormModel>) {
        Object.assign(this, init);
    }
}
