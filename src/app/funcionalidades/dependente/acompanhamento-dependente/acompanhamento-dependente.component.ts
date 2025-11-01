import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProcessoService} from "../../../shared/services/comum/processo.service";
import {fadeAnimation} from "../../../shared/animations/faded.animation";
import {
    AcompanhamentoCommon
} from "../../../shared/components/asc-acompanhamento-processo/asc-acompamento-processo-base/acompanhamento-common";
import {MessageService} from "app/shared/components/messages/message.service";
import {PermissoesSituacaoProcesso} from 'app/shared/models/fluxo/permissoes-situacao-processo';
import {PatologiaService} from "../../../shared/services/comum/patologia.service";
import {ProcedimentoService} from "../../../shared/services/comum/procedimento.service";
import {MedicamentoService} from "../../../shared/services/comum/pedido/medicamento.service";
import {MedicamentoPatologiaPedidoService} from "../../../shared/services/comum/medicamento-patologia-pedido.service";
import { DocumentoPedidoService,  SIASCFluxoService } from 'app/shared/services/services';
import { DocumentoPedidoDTO } from 'app/shared/models/dto/documento-pedido';

@Component({
    selector: 'asc-acompanhamento-dependente',
    templateUrl: './acompanhamento-dependente.component.html',
    styleUrls: ['./acompanhamento-dependente.component.scss'],
    animations: [...fadeAnimation]
})
export class AcompanhamentoDependenteComponent extends AcompanhamentoCommon implements OnInit {

    override possuiDocumentosComplementares = true;
    possuiDocumentosComplementaresAnexos = true;
    possuiDocumentos = true;
    permissoesProcesso: PermissoesSituacaoProcesso;
    apresentarDocumentoComplementar$ = false;
    possuiDocumentosObrigatoriosinvalidos = true;
    possuiDocumentosCondicionaisInvalidos = true;

    constructor(
        override readonly messageService: MessageService,
        override readonly activatedRoute: ActivatedRoute,
        override readonly processoService: ProcessoService,
        override readonly procedimentoService: ProcedimentoService,
        override readonly medicamentoService: MedicamentoService,
        override readonly patologiaService: PatologiaService,
        override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        override readonly siascFluxoService: SIASCFluxoService,
        protected override readonly documentoPedidoService: DocumentoPedidoService
    ) {
        super(activatedRoute, processoService, procedimentoService, medicamentoService, patologiaService, medicamentoPatologiaPedidoService, messageService, siascFluxoService, documentoPedidoService);
    }

    override get recebendoDocumentacaoTitular(): boolean {
        const situacoes = ["AGUARD_DOC_COMPLEMENTAR", "RECEBENDO_DOCUMENTACAO_TITULAR"];
        if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.situacaoProcesso) {
            return situacoes.includes(this.processo.ultimaSituacao.situacaoProcesso["statusEnum"]);
        }

        return false;
    }

    showDocumentoComplementar(valor: boolean) {
        this.apresentarDocumentoComplementar$ = valor;
    }

    get apresentarDocumentoComplementar(): boolean {
        return !this.possuiDocumentos || this.apresentarDocumentoComplementar$;
    }

    hasDocumentos(possuiDocumentos: boolean) {
        this.possuiDocumentosComplementares = possuiDocumentos
    }

    hasAnexos(possuiAnexos: boolean) {
        this.possuiDocumentosComplementaresAnexos = possuiAnexos
    }

    hasDocumentosObrigatorio(possuiDocumentos: boolean): void {
        this.possuiDocumentos = possuiDocumentos;
    }

    hasDocumentosinvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
        this.possuiDocumentosObrigatoriosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }
    hasDocumentosCondicionadosInvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
        this.possuiDocumentosCondicionaisInvalidos = possuiDocumentosObrigatoriosinvalidos;
    }

}
