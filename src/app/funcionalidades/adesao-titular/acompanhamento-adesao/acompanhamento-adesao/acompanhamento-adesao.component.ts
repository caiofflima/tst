import { Component, OnInit } from '@angular/core';
import { AcompanhamentoCommon } from "../../../../shared/components/asc-acompanhamento-processo/asc-acompamento-processo-base/acompanhamento-common";
import { ActivatedRoute } from "@angular/router";
import { ProcessoService } from "../../../../shared/services/comum/processo.service";
import { map } from "rxjs/operators";
import { fadeAnimation } from "../../../../shared/animations/faded.animation";
import { MessageService } from "app/shared/components/messages/message.service";
import { PermissoesSituacaoProcesso } from 'app/shared/models/fluxo/permissoes-situacao-processo';
import { ProcedimentoService } from "../../../../shared/services/comum/procedimento.service";
import { GrauProcedimento, Pedido } from "../../../../shared/models/entidades";
import { Observable } from "rxjs";
import { forkJoin } from "rxjs";
import { isNotUndefinedOrNull } from "../../../../shared/constantes";
import { MedicamentoService } from "../../../../shared/services/comum/pedido/medicamento.service";
import { PatologiaService } from "../../../../shared/services/comum/patologia.service";
import { MedicamentoPatologiaPedidoService } from "../../../../shared/services/comum/medicamento-patologia-pedido.service";
import { DocumentoPedidoService, SIASCFluxoService } from 'app/shared/services/services';

@Component({
    selector: 'asc-acompanhamento-adesao',
    templateUrl: './acompanhamento-adesao.component.html',
    styleUrls: ['./acompanhamento-adesao.component.scss'],
    animations: [...fadeAnimation]
})
export class AcompanhamentoAdesaoComponent extends AcompanhamentoCommon implements OnInit {
    corSituacao = true;
    corSituacaoComplementar = true;
    possuiDocumentos = true;
    possuiAnexoDocumentos = true;
    override possuiDocumentosComplementares = true;
    permissoesProcesso: PermissoesSituacaoProcesso;
    apresentarDocumentoComplementar$ = false;
    mostrarBordaVermelha = false;
    possuiDocumentosObrigatoriosinvalidos = true;

    constructor(
        override readonly messageService: MessageService,
        override readonly activatedRoute: ActivatedRoute,
        override readonly processoService: ProcessoService,
        override readonly procedimentoService: ProcedimentoService,
        override readonly medicamentoService: MedicamentoService,
        override readonly patologiaService: PatologiaService,
        override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected override readonly siascFluxoService: SIASCFluxoService,
        protected override documentoPedidoService: DocumentoPedidoService

    ) {
        super(activatedRoute, processoService, procedimentoService, medicamentoService, patologiaService, medicamentoPatologiaPedidoService, messageService, siascFluxoService, documentoPedidoService);
    }

    showDocumentoComplementar(valor: boolean) {
        this.apresentarDocumentoComplementar$ = valor;
    }

    hasAnexosDocumentosObrigatorio(possuiDocumentos: boolean): void {
        this.possuiAnexoDocumentos = possuiDocumentos;
    }

    possuiDocumentosObrigatorios(possuiDocumentos: boolean): void {
        this.possuiDocumentos = possuiDocumentos;
    }

    hasDocumentos(possuiDocumentos: boolean) {
        this.possuiDocumentosComplementares = possuiDocumentos;
    }

    hasDocumentosinvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
        this.possuiDocumentosObrigatoriosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }

    protected override adicionarValoresNoPedido(pedido: Pedido): Observable<Pedido> {
        const idsProcedimentoAndGrau = pedido.pedidosProcedimento.reduce((acc, current) =>
            [...acc, { idProcedimento: current.idProcedimento, idGrau: current.idGrauProcedimento }], [] as any[]);

        const buscarGrauProcedimento = idsProcedimentoAndGrau.map(procAndGrau =>
            this.procedimentoService.consultarGrauProcedimento(procAndGrau.idProcedimento, procAndGrau.idGrau));
        return forkJoin(buscarGrauProcedimento).pipe(
            map((graus: any[]) => {
                pedido.pedidosProcedimento = pedido.pedidosProcedimento.map(pedidoProcedimento => {
                    pedidoProcedimento.grauProcedimento = graus.filter(isNotUndefinedOrNull).find(grau => grau.idProcedimento === pedidoProcedimento.idProcedimento && grau.id === pedidoProcedimento.idGrauProcedimento);
                    return pedidoProcedimento;
                });
                return pedido;
            }),
        );
    }

   override get recebendoDocumentacaoTitular(): boolean {
        let situacoes = ["AGUARD_DOC_COMPLEMENTAR", "RECEBENDO_DOCUMENTACAO_TITULAR"];
        if (this.processo && this.processo.ultimaSituacao && this.processo.ultimaSituacao.situacaoProcesso) {
            return situacoes.includes(this.processo.ultimaSituacao.situacaoProcesso["statusEnum"]);
        }
        return false;
    }

    get apresentarDocumentoComplementar(): boolean {
        return !this.possuiDocumentos || this.apresentarDocumentoComplementar$;
    }
}
