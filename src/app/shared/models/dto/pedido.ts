import { Anexo } from "../comum/anexo";
import { Beneficiario } from "../comum/beneficiario";
import { CaraterSolicitacao } from "../comum/carater-solicitacao";
import { ConselhoProfissional } from "../comum/conselho-profissional";
import { DocumentoPedido } from "../comum/documento-pedido";
import { Municipio } from "../comum/municipio";
import { PedidoProcedimento } from "../comum/pedido-procedimento";
import { SituacaoPedido } from "../comum/situacao-pedido";
import { TipoProcesso } from "../comum/tipo-processo";
import { TipoProcessoMotivoSolicitacao } from "../comum/tipo-processo-motivo-solicitacao";


export interface PedidoDTO {

    id: number;
    idBeneficiario: number;
    idTipoProcesso: number;
    idTipoBeneficiario: number;
    idMotivoSolicitacao: number;
    idConselhoProfissional: number;
    idCaraterSolicitacao: number;
    telefoneContato: number;
    numeroConselho: string;
    cpf: string;
    cnpj: string;
    nomeProfissional: string;
    email: string;
    observacao: string;
    idTransacaoGED: string;
    protocoloAns: string;
    idEstadoConselho: number;
    idMunicipioProfissional: number;
    idFilialBeneficiario: number;
    idEstadoBeneficiario: number;
    idPrestadorExterno: number;
    idEmpresaPrestador: number;

    ultimaSituacao: SituacaoPedido;
    tipoProcesso: TipoProcesso;
    tipoProcessoMotivoSolicitacao: TipoProcessoMotivoSolicitacao;
    conselhoProfissional: ConselhoProfissional;
    caraterSolicitacao: CaraterSolicitacao;
    beneficiario: Beneficiario;
    municipioProfissional: Municipio;

    pedidosProcedimento: PedidoProcedimento[];
    anexos: Anexo[];
    documentosPedido: DocumentoPedido[];
    situacoesPedido: SituacaoPedido[];
}
