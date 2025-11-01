export let CI_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export let CPF_MASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export let CNPJ_MASK = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
export let SIICO_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/];
export let DATA_MASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
export let DDMMYY_MASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/];
export let DATAHORA_MASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/];
export let TELEFONE_MASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,];
export let CELULAR_MASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,];
export let NIS_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export let NUMERO_MASK = [/\d/, /\d/, /\d/, /\d/];
export let CEP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
export let PROCEDIMENTO_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
export let COD_USUARIO_MASK = [/[A-Za-z]/, /[A-Za-z]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export let MATRICULA_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export let MATRICULA_MASK_DIGITO = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];

export const registeredMasks = {
    ciMask: CI_MASK,
    cpfMask: CPF_MASK,
    cnpjMask: CNPJ_MASK,
    siicoMask: SIICO_MASK,
    dataMask: DATA_MASK,
    ddMMyyMask: DDMMYY_MASK,
    dataHoraMask: DATAHORA_MASK,
    telefoneMask: TELEFONE_MASK,
    celularMask: CELULAR_MASK,
    nisMask: NIS_MASK,
    numeroMask: NUMERO_MASK,
    cepMask: CEP_MASK,
    procedimentoMask: PROCEDIMENTO_MASK,
    codigoUsuarioMask: COD_USUARIO_MASK,
    matriculaMask: MATRICULA_MASK,
    matriculaMaskDisk: MATRICULA_MASK_DIGITO
};

export type Mask = "ciMask" | "cpfMask" | "cnpjMask" | "siicoMask" | "dataMask" | "ddMMyyMask" | "dataHoraMask"
    | "telefoneMask" | "celularMask" | "nisMask" | "numeroMask" | "cepMask" | "procedimentoMask" | "codigoUsuarioMask"
    | "matriculaMask" | "matriculaMaskDisk";
