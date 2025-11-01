import {Entity} from '../../../../app/arquitetura/shared/models/entity';
import {Beneficiario} from './beneficiario';
import {TipoProcesso} from './tipo-processo';
import {MotivoSolicitacao} from './motivo-solicitacao';
import {ConselhoProfissional} from './conselho-profissional';
import {CaraterSolicitacao} from './carater-solicitacao';
import {PedidoProcedimento} from './pedido-procedimento';
import {Anexo} from './anexo';
import {DocumentoPedido} from './documento-pedido';
import {SituacaoPedido} from './situacao-pedido';
import {isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty} from "../../constantes";
import {MedicamentoPatologiaPedido} from "./medicamento-patologia-pedido";

export class Pedido extends Entity {
  idBeneficiario?: number;
  idTipoProcesso?: number;
  idTipoBeneficiario?: number;
  idMotivoSolicitacao?: number;
  pedidosProcedimento?: PedidoProcedimento[] | MedicamentoPatologiaPedido[] | any;
  medicamentosPatologia?: MedicamentoPatologiaPedido[];
  idMunicipioProfissional?: number;
  idConselhoProfissional?: number;
  idCaraterSolicitacao?: number;
  idEstadoConselho?: number;
  numeroConselho?: string;
  cpf?: string;
  cnpj?: string;
  cpfCnpj?: string;
  nomeProfissional?: string;
  email?: string;
  telefoneContato?: number;
  observacao?: string;
  protocoloAns?: string;
  beneficiario?: Beneficiario;
  tipoProcesso?: TipoProcesso;
  finalidade?: MotivoSolicitacao;
  conselhoProfissional?: ConselhoProfissional;
  caraterSolicitacao?: CaraterSolicitacao;
  anexos?: Anexo[];
  documentosPedido?: DocumentoPedido[];
  ultimaSituacao?: SituacaoPedido;
  municipioProfissional?: any;
  dataEmissaoDocumentoFiscal?: Date;
  numeroDocumentoFiscal?: number | string;
  valorDocumentoFiscal?: number;
  nomeMotivoSolicitacao?: string;
  idAutorizacaoPreviaSiags?: number;
  dataOcorrencia?: Date;

  constructor(init?: Partial<Pedido>) {
    super();
    Object.assign(this, init);

  }

  public isNovo(): boolean {
    return isUndefinedNullOrEmpty(this.id) ||
      !this.temProtocoloANSValido();
  }

  pedidoProcedimentoIsNotEmpty() {
    return this.pedidosProcedimento && this.pedidosProcedimento.length;
  }

  private temProtocoloANSValido() {
    let valido = false;
    if (isNotUndefinedNullOrEmpty(this.protocoloAns)) {
      valido = this.protocoloAns!.length == 20;
    }

    return valido;
  }

  verificarEhTitularEPedidoEmAnalise(titular:string, processo:Pedido, situacao:string):boolean {
    let habilitaEdicao = true;

    if(processo !== undefined && processo.id !== null && processo.ultimaSituacao 
      && titular !== undefined && titular !== null) {
            if(titular === 'Sim' 
            && processo.ultimaSituacao.situacaoProcesso.statusEnum === situacao) {
                habilitaEdicao = false;
            }     
    }
    return habilitaEdicao;
  }
}
