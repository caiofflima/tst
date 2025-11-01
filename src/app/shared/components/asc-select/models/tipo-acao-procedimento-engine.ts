import { ProcedimentoService } from '../../../services/comum/procedimento.service';
import { TipoAcaoService } from './tipo-acao-service';
import { TipoAcaoDoService } from "./tipo-acao-do-service";
import { AscSelectComponentProcedimentosParams } from "./asc-select-component-procedimentos.params";
import { Procedimento } from "../../../models/entidades";

export class TipoAcaoProcedimentoEngine {

  private constructor() {
    throw new Error('class TipoAcaoProcedimentoEngine')
  }

  static readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO: TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>> = {
    service: (service: ProcedimentoService) => ({
      action: ({idTipoProcesso, texto, isIndisponibilidadeRedeCredenciada}) => service.consultarProcedimentosPorTipoProcesso(idTipoProcesso, texto, isIndisponibilidadeRedeCredenciada),
    }),
  };

  static readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO_AND_SEXO_AND_IDADE: TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>> = {
    service: (service: ProcedimentoService) => ({
      action: ({idTipoProcesso, sexo, idade}) => service.consultarProcedimentosPorTipoProcessoAndSexoAndIdade(idTipoProcesso, sexo, idade),
    }),
  };

  static readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO_SEXO_AND_IDADE_AND_TEXTO: TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>> = {
    service: (service: ProcedimentoService) => ({
      action: ({idTipoProcesso, sexo, idade, texto}) => service.consultarProcedimentosPorTipoProcessoAndSexoAndIdadeAndTexto(idTipoProcesso, sexo, idade, texto),
    }),
  };


  static readonly CONSULTAR_PROCEDIMENTOS_POR_PEDIDO: TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>> = {
    service: (service: ProcedimentoService) => ({
      action: ({idTipoProcesso, sexo, idade, texto}) => service.consultarProcedimentosPorTipoProcessoAndSexoAndIdadeAndTexto(idTipoProcesso, sexo, idade, texto),
    }),
  };

  static readonly CONSULTAR_TODOS_PROCEDIMENTO: TipoAcaoService<ProcedimentoService, TipoAcaoDoService<AscSelectComponentProcedimentosParams, Procedimento>> = {
    service: (service: ProcedimentoService) => ({
      action: () => service.get(),
    }),
  };
}
