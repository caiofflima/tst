// Máscaras convertidas para ngx-mask (formato string)
export let CI_MASK = '0000000000-00';
export let CPF_MASK = '000.000.000-00';
export let CNPJ_MASK = '00.000.000/0000-00';
export let SIICO_MASK = '0000-0';
export let DATA_MASK = '00/00/0000';
export let DDMMYY_MASK = '00/00/00';
export let DATAHORA_MASK = '00/00/0000 00:00:00';
export let TELEFONE_MASK = '(00) 0000-0000';
export let CELULAR_MASK = '(00) 00000-0000';
export let NIS_MASK = '00000000000';
export let NUMERO_MASK = '0000';
export let CEP_MASK = '00000-000';
export let PROCEDIMENTO_MASK = '0000000-0';
export let COD_USUARIO_MASK = 'AA000000';
export let MATRICULA_MASK = '000000';
export let MATRICULA_MASK_DIGITO = '000000-0';

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
