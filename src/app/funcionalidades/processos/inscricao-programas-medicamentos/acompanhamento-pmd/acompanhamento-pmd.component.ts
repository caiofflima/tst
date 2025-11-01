import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Pedido} from "../../../../shared/models/comum/pedido";
import {ParamMap} from "@angular/router";
import {ActivatedRoute} from "@angular/router";
import {ProcessoService} from "../../../../shared/services/comum/processo.service";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {MessageService} from 'app/shared/components/messages/message.service';
import {RetornoSIASC} from "../../../../shared/models/dto/retorno-siasc";
import {
    AcompanhamentoCommon
} from "../../../../shared/components/asc-acompanhamento-processo/asc-acompamento-processo-base/acompanhamento-common";
import {ProcedimentoService} from "../../../../shared/services/comum/procedimento.service";
import {MedicamentoService} from "../../../../shared/services/comum/pedido/medicamento.service";
import {PatologiaService} from "../../../../shared/services/comum/patologia.service";
import {
    MedicamentoPatologiaPedidoService
} from "../../../../shared/services/comum/medicamento-patologia-pedido.service";
import { DocumentoPedidoService, SIASCFluxoService } from 'app/shared/services/services';

@Component({
    selector: 'asc-acompanhamento-pmd',
    templateUrl: './acompanhamento-pmd.component.html',
    styleUrls: ['./acompanhamento-pmd.component.scss'],
    animations: [...fadeAnimation]
})
export class AcompanhamentoPmdComponent extends AcompanhamentoCommon implements OnInit {
    override idPedido: number;
    override processo: Pedido;
    possuiDocumentos = true;
    possuiDocumentosComplementaresAnexos = false;
    possuiDocumentosCondicionados = true;
    possuiDocumentosObrigatorios = true;
    possuiDocumentosObrigatoriosinvalidos = true;
    override apresentarSituacao: boolean = true;

    @Output()
    onMudancaSituacaoConcluida$ = new EventEmitter<RetornoSIASC>();

    @Output()
    onUploadConcluido$ = new EventEmitter<RetornoSIASC>();

    private apresentarDocumentoComplementar$ = false;

    constructor(
        override readonly activatedRoute: ActivatedRoute,
        override readonly processoService: ProcessoService,
        override readonly procedimentoService: ProcedimentoService,
        override readonly medicamentoService: MedicamentoService,
        override readonly patologiaService: PatologiaService,
        override readonly messageService: MessageService,
        override readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService,
        protected override readonly siascFluxoService: SIASCFluxoService,
        protected override documentoPedidoService: DocumentoPedidoService
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

    override ngOnInit() {
        super.ngOnInit();
        this.activatedRoute.paramMap.subscribe((param: ParamMap) => {
            this.idPedido = Number(param.get('idPedido'));
            this.carregarProcesso();
        });

        this.subjectAtualizarProcesso.subscribe(() => this.carregarProcesso());
    }

    hasAnexos(possuiAnexos: boolean) {
        this.possuiDocumentosComplementaresAnexos = possuiAnexos
    }

    override goToTop() {
        window.scrollTo(0, 0);
    }

    override atualizarProcesso() {
        this.apresentarDocumentoComplementar$ = !this.possuiDocumentosObrigatorios;
        this.carregarProcesso();
    }

    showDocumentoComplementar(valor: boolean) {
        this.apresentarDocumentoComplementar$ = valor;
    }

    get apresentarDocumentoComplementar(): boolean {
        return !this.possuiDocumentosObrigatorios || this.apresentarDocumentoComplementar$;
    }

    hasDocumentoCondicionados(possuiDocumentosCondicionados: boolean) {
        this.possuiDocumentosCondicionados = possuiDocumentosCondicionados;
    }

    hasDocumentosObrigatorio(possuiDocumentosObrigatorios: boolean) {
        this.possuiDocumentosObrigatorios = possuiDocumentosObrigatorios;
    }

    hasDocumentosinvalido(possuiDocumentosObrigatoriosinvalidos: boolean) {
        this.possuiDocumentosObrigatoriosinvalidos = possuiDocumentosObrigatoriosinvalidos;
    }

    uploadConcluido(): void {
        this.carregarProcesso();
        this.atualizarProcesso()
    }

    override mudancaSituacaoConcluida(): void {
        this.carregarProcesso();
    }

    override onSituacaoInvalida() {
        this.apresentarSituacao = false;
    }

    private carregarProcesso = (): void => {
        console.log('mudanca situacao')
        this.processoService.consultarPorId(this.idPedido).subscribe((pedido: Pedido) => {
            this.processo = pedido;
            this.possuiDocumentosCondicionados = true;
            this.possuiDocumentosObrigatorios = true;
            this.possuiDocumentosObrigatoriosinvalidos = true;
            console.log(pedido)
        });
    }

    protected override registrarBuscaProcesso(): void {
        this.carregarProcesso();
    }
}
