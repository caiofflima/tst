import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseSelectComponent } from '../base-input.component';
import { MessageService, MotivoSolicitacaoService } from '../../../services/services';
import { MotivoSolicitacao } from '../../../models/comum/motivo-solicitacao';
import { TipoFinalidadeAcaoService } from '../../../models/comum/tipo-processo-acao-service';
import { isNotUndefinedNullOrEmpty, isUndefinedNullOrEmpty } from '../../../constantes';
import { catchError, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TipoBuscaMotivoSolicitacao } from '../../../models/tipo-busca-motivo-solicitacao';

@Component({
    selector: 'asc-select-finalidade-adesao',
    templateUrl: 'asc-select.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AscSelectFinalidadeAdesaoComponent extends BaseSelectComponent<MotivoSolicitacao> implements OnInit, OnDestroy {
    
    private ID_TIPO_PROCESSO_ADESAO: number = 15;
  
    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: MotivoSolicitacaoService,
    ) {
        super(messageService, changeDetectorRef, (ms: MotivoSolicitacao) => ms.nome, (ms: MotivoSolicitacao) => ms.id, 'Finalidade');
    }

    protected override carregarListOperator(): Observable<MotivoSolicitacao[]> {
      return this.service.consultaPorIdtipoProcesso(this.ID_TIPO_PROCESSO_ADESAO);
    }

}
