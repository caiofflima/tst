import {UF} from "../../../shared/models/uf";
import {Municipio} from "../../../shared/models/comum/municipio";

export class ComplementoDependenteFormModel {
    rg?: number = null;
    idTipoDependente?: number = null;
    idTipoDeficiencia?: number = null;
    orgaoEmissor?: string = null;
    dataExpedicaoRg?: Date = null;
    cartaoNacionalSaude?: number = null;
    cartaoUnimed?: number = null;
    renda?: number = null;
    estado?: UF | number = null;
    municipio?: Municipio = null;
    emailDependente?: string = null;

    constructor(init?: Partial<ComplementoDependenteFormModel>) {
        Object.assign(this, init);
    }
}
