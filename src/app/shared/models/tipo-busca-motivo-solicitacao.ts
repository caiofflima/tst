import {TipoFinalidadeAcaoService} from './comum/tipo-processo-acao-service';
import {MotivoSolicitacaoService} from '../services/comum/motivo-solicitacao.service';

export class TipoBuscaMotivoSolicitacao {

    static readonly CARREGAR_LISTA_TODAS: TipoFinalidadeAcaoService = {
        action(service: MotivoSolicitacaoService) {
            return () => service.get();
        },
    };

    static readonly CARREGAR_LISTA_POR_TIPO_PROCESSO: TipoFinalidadeAcaoService = {
        action(service: MotivoSolicitacaoService) {
            return (idTipoProcesso?: number, idBeneficiario?: number) =>
                service.consultarPorTipoProcesso(idTipoProcesso, idBeneficiario);
        },
    };

    static readonly CARREGAR_LISTA_POR_ID_TIPO_PROCESSO: TipoFinalidadeAcaoService = {
        action(service: MotivoSolicitacaoService) {
            return (idTipoProcesso?: number) => service.consultaPorIdtipoProcesso(idTipoProcesso);
        }
    }

}
