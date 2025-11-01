import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DetalheOcorrenciaModel} from "../models/detalhe-ocorrencia.model";
import {Pedido} from "../../../models/comum/pedido";
import {fadeAnimation} from "../../../animations/faded.animation";
import {AscComponenteAutorizado} from "../../asc-pedido/asc-componente-autorizado";
import {SituacaoPedido} from "../../../models/comum/situacao-pedido";

@Component({
    selector: 'asc-acompamento-header',
    templateUrl: './asc-acompanhamento-header.component.html',
    styleUrls: ['./asc-acompanhamento-header.component.scss'],
    animations: [...fadeAnimation]
})
export class AscAcompamentoHeaderComponent extends AscComponenteAutorizado {

    @Input()
    processoPedido: Pedido;

    @Input()
    detalheOcorrencia: DetalheOcorrenciaModel = {
        historicoId: 80603190197,
        situacao: 'Histórico não informado',
        descricaoSituacao: 'Por favor anexar documentos relacionados a despesas hospitalares, como\n' +
            '          relação de medicamentos/ procedimentos/itens de tabela hospitalar com preço unitário em até\n' +
            '          2 dias úteis.',
        dateSituacao: new Date()
    }

    @Output()
    atualizarOcorrencia = new EventEmitter<SituacaoPedido>();

    atualizarPedido(situacao: SituacaoPedido): void {
        this.atualizarOcorrencia.emit(situacao);
        // window.location.reload();
    }
}
