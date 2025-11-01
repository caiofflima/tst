import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../../../services/services';
import { BaseSelectComponent } from '../base-input.component';
import { Observable } from 'rxjs';
import { TipoProcessoAcaoService } from '../../../models/comum/tipo-processo-acao-service';
import { map } from 'rxjs/operators';
import { SituacaoProcesso } from 'app/shared/models/comum/situacao-processo';
import { SituacaoProcessoService } from 'app/shared/services/comum/situacao-processo.service';

@Component({
    selector: 'asc-select-situacao-processo-ocorrencia',
    templateUrl: 'asc-select.component.html'
})
export class AscSelectSituacaoProcessoOcorrenciaComponent extends BaseSelectComponent<SituacaoProcesso> implements OnInit {

    private situacoesPedidos: SituacaoProcesso[] = [];

    constructor(
        override readonly messageService: MessageService,
        override readonly changeDetectorRef: ChangeDetectorRef,
        private readonly service: SituacaoProcessoService,
    ) {
        super(messageService, changeDetectorRef, tp => tp.nome, tp => tp.id, 'Situacao Processo/Ocorrencia');
    }

    protected override carregarListOperator(): Observable<SituacaoProcesso[]> {
        return new Observable<SituacaoProcesso[]>(observer => {
            this.service.consultarTodos().subscribe(
                dados => {
                    dados.push(new SituacaoProcesso(1000, "OBSERVAÇÃO"));
                    observer.next(dados);
                    observer.complete();
                },
                error => {
                    this.messageService.addMsgDanger('Não foi encontrando nenhum processo');
                }
            );
        });
    }

}
