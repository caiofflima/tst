export class ContatoEnderecoFormModel {

    logradouro: string = null;
    bairro: string = null;
    cep: string = null;
    cidade: string = null;
    uf: string = null;
    municipio: any;
    estado: any;
    numero: number;
    complemento: string;
    telefone: string;
    email: string;

    constructor(init?: Partial<ContatoEnderecoFormModel>) {
        Object.assign(this, init);
    }

}