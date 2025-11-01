export interface ProcedimentoReembolso{
    id: number,
    estruturaNumerica: number,
    descricao: string,
    estrutura: string,
    permitidoDepRestrito: string,
    qtdAuxiliares: number,
    preveInstrumentador: number,
    intervaloAtendimentos: String,
    idadeMinima: number,
    idadeMaxima: number,
    vlrReembolso: number,
    autorizacaoPrevia: string
}