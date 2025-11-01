import { StatusProcessoEnum } from "app/arquitetura/shared/enums/status-processo.enum";

export function isTipoFinalizado(idSituacaoProcesso: number): boolean {
  return [
    StatusProcessoEnum.PEDIDO_DEFERIDO,
    StatusProcessoEnum.PEDIDO_DEFERIDO_AUTOMATICAMENTE,
    StatusProcessoEnum.PEDIDO_INDEFERIDO,
    StatusProcessoEnum.INDEFERIMENTO_RATIFICADO,
    StatusProcessoEnum.CANCELADO_PELO_TITULAR,
    StatusProcessoEnum.PROCESSO_ENCERRADO
  ].some(t => t == idSituacaoProcesso);
}

export function isSituacaoCancelamentoPermitido(idSituacaoProcesso: number): boolean {
  return [
    StatusProcessoEnum.PROCESSO_CRIADO,
    StatusProcessoEnum.RECEBENDO_DOCUMENTACAO_TITULAR,
    StatusProcessoEnum.SOB_ANALISE_MEDICO,
    StatusProcessoEnum.SOB_ANALISE_DENTISTA,
    StatusProcessoEnum.SOB_ANALISE_ENFERMEIRO,
    StatusProcessoEnum.SOB_ANALISE_PSICOLOGO,
    StatusProcessoEnum.SOB_ANALISE_FONOAUDIOLOGO,
    StatusProcessoEnum.SOB_ANALISE_FISIOTERAPEUTA,
    StatusProcessoEnum.SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA,
    StatusProcessoEnum.SOB_ANALISE_PROFISSIONAL_CAIXA,
    StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR,
    StatusProcessoEnum.REVISAO_REQUERIDA_PELO_TITULAR,
    StatusProcessoEnum.AGUARDANDO_COTACAO_OPME,
    StatusProcessoEnum.AGUARD_CONS_PROFISSIONAL,
    StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_ASSIT,
    StatusProcessoEnum.AGUARD_MANIF_PROFISSIONAL_DESMP,
    StatusProcessoEnum.BENEF_CONV_PERICIA,
    StatusProcessoEnum.AGUARD_PERICIA_PRESENCIAL,
    StatusProcessoEnum.AGUARD_RESULTADO_EXAMES,
    StatusProcessoEnum.AGUARD_PARECER_DESEMPATADOR,
    StatusProcessoEnum.AGUARD_DECISAO_ADM_FILIAL,
    StatusProcessoEnum.AGUARD_DECISAO_ADM_MATRIZ
  ].some(t => t == idSituacaoProcesso);
}