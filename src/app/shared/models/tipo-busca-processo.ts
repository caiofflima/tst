import { TipoProcessoService } from '../services/comum/tipo-processo.service';
import { TipoProcessoAcaoService } from './comum/tipo-processo-acao-service';


export class TipoBuscaProcesso {
  private constructor() {
    throw new Error('class TipoBuscaProcesso cannot be instantiate');
  }

  static readonly CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA: TipoProcessoAcaoService = {
    action: (service: TipoProcessoService) => {
      return service.consultarTiposProcessoAutorizacaoPrevia();
    },
  };

  static readonly CONSULTAR_TIPO_PROCESSO_AUTORIZACAO_PREVIA_NOVO_PEDIDO: TipoProcessoAcaoService = {
    action: (service: TipoProcessoService) => {
      return service.consultarTiposProcessoAutorizacaoPreviaNovoPedido();
    },
  };

  static readonly CONSULTAR_TODOS: TipoProcessoAcaoService = {
    action: (service: TipoProcessoService) => {
      console.log('CONSULTAR_TODOS')
      return service.consultarTodos();
    },
  };

  static readonly CONSULTAR_INCRICAO_PROGRAMAS: TipoProcessoAcaoService = {
    action: (service: TipoProcessoService) => {
      return service.consultarTiposProcessoInscricaoProgramas();
    },
  };

  static readonly CONSULTAR_REEMBOLSO: TipoProcessoAcaoService = {
    action: (service: TipoProcessoService) => {
      console.log('CONSULTAR_REEMBOLSO')
      return service.consultarTiposProcessoReembolso();
    },
  };
}
