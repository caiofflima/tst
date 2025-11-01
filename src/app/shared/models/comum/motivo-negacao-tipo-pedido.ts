import { MotivoNegacao } from "./motivo-negacao"
import { SimNaoEnum } from "./sim-nao"
import { TipoProcesso } from "./tipo-processo"

export class MotivoNegacaoTipoPedido {
    idMotivoNegacao: number
    tituloMotivoNegacao: string
    listaIdMotivoNegacao: Array<number>
    idTipoProcesso: number
    nomeTipoProcesso: string
    listaIdTipoProcesso: Array<number>
    idTipoBeneficiario: number
    listaIdTipoBeneficiario: Array<number>
    motivoNegacao: MotivoNegacao
    tipoProcesso: TipoProcesso
    listaTipoBeneficiario: string
    inativo: boolean
    dataInativacao: string
    nivelDeNegacao: string
}