export enum TipoProcessoEnum {
    AUTORIZACAO_PREVIA_FISIOTERAPICA = 1,
    AUTORIZACAO_PREVIA_MEDICA = 2,
    AUTORIZACAO_PREVIA_ODONTOLOGICA = 3,
    AUTORIZACAO_PREVIA_PAD = 4,
    AUTORIZACAO_PREVIA_SIAGS = 20,
    INSCRICAO_PROGRAMAS = 5,
    REEMBOLSO_ASSISTENCIAL = 6,
    REEMBOLSO_CONSULTA = 7,
    REEMBOLSO_MEDICAMENTO = 8,
    REEMBOLSO_ODONTOLOGICO = 9,
    REEMBOLSO_VACINA = 10,
    INSCRICAO_BENEFICIARIO = 11,
    CANCELAMENTO_BENEFICIARIO = 12,
    ATUALIZACAO_BENEFICIARIO = 13,
    RENOVACAO_BENEFICIARIO = 14,
    ADESAO = 15,
    CANCELAMENTO_ADESAO = 16,
    INSCRICAO_JUDICIAL = 18,
    EMISSAO_CARTAO = 19,
    INSCRICAO_PENSAO = 17,
    NO_VALUE = -1,
}

export function isTipoProcessoAdesao(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.ADESAO,
    ]);
}

export function isTipoProcessoInscricaoDependente(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.INSCRICAO_BENEFICIARIO
    ])
}

export function isTipoProcessoCancelamentoDependente(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.CANCELAMENTO_BENEFICIARIO
    ])
}

export function isTipoProcessoAltearDependente(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.ATUALIZACAO_BENEFICIARIO
    ])
}

export function isTipoProcessoRenovacaoDependente(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.RENOVACAO_BENEFICIARIO
    ])
}

export function isTipoProcessoReembolsoById(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO,
        TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL,
        TipoProcessoEnum.REEMBOLSO_CONSULTA,
        TipoProcessoEnum.REEMBOLSO_MEDICAMENTO,
        TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO,
        TipoProcessoEnum.REEMBOLSO_VACINA,
    ])
}


export function istipoProcessoAutorizacaoPrevia(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.AUTORIZACAO_PREVIA_FISIOTERAPICA,
        TipoProcessoEnum.AUTORIZACAO_PREVIA_MEDICA,
        TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA,
        TipoProcessoEnum.AUTORIZACAO_PREVIA_PAD,
        TipoProcessoEnum.AUTORIZACAO_PREVIA_SIAGS
    ])
}

export function isTipoProcessoInscricaoProgramas(idTipoProcesso: number): boolean {
    return commonComparator(idTipoProcesso, [
        TipoProcessoEnum.INSCRICAO_PROGRAMAS,
    ])
}

const comparyByIdTipoProcesso = idTipoProcesso => idTipoProcessoEnum => idTipoProcessoEnum === idTipoProcesso

function commonComparator(idTipoProcesso: number, idsTipoProcessos: number[] = []) {
    return idsTipoProcessos.some(comparyByIdTipoProcesso(idTipoProcesso));
}
