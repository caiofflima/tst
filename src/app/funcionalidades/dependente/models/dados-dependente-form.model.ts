import {DadoComboDTO} from "../../../shared/models/dto/dado-combo";

export class DadosDependenteFormModel {
    nomeCompleto?: string = null;
    matricula?: string = null;
    cpf?: string = null;
    nomeMae?: string = null;
    nomePai?: string = null;
    dataNascimento: Date = null;
    sexo: DadoComboDTO | string = null;
    estadoCivil?: number = null;
    idEstadoCivil?: number = null;
    email?: string = null;
    telefoneContato?: string = null;
    idTipoBeneficiario?: number = null;
    declaracaoNascidoVivo?: number = null;
    emailDependente?: string = null;

    constructor(init?: Partial<DadosDependenteFormModel>) {
        Object.assign(this, init);
    }
}
