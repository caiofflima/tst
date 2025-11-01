import {TipoProcessoService} from '../../services/comum/tipo-processo.service';
import {Observable} from 'rxjs';
import {TipoProcesso} from './tipo-processo';
import {MotivoSolicitacaoService} from '../../services/comum/motivo-solicitacao.service';
import {MotivoSolicitacao} from './motivo-solicitacao';

export interface TipoProcessoAcaoService {
    action: (service: TipoProcessoService) => Observable<TipoProcesso[]>
}

export interface TipoFinalidadeAcaoService {
    action: (service: MotivoSolicitacaoService) => (idTipoProcesso?: number, idBeneficiario?: number) => Observable<MotivoSolicitacao[]>
}
