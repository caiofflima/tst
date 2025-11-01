export class PatologiaFormModel {
    coPatologia?: number;
    noPatologia?: string;

    constructor(init?: Partial<PatologiaFormModel>) {
        Object.assign(this, init);
    }
}