import {BaseComponent} from "../../shared/components/base.component";
import {MessageService} from "../../shared/components/messages/message.service";
import {FiltroRelatorioAnalitico} from "../../shared/models/filtro/filtro-relatorio-analitico";
import {Data} from "../../shared/providers/data";
import {ProcessoService} from "../../shared/services/comum/processo.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {RelatorioAnaliticoDTO} from "../../shared/models/dto/relatorio-analitico";
import {FormGroup} from "@angular/forms";
import {AfterViewInit, ChangeDetectorRef, Directive} from "@angular/core";
import {take} from "rxjs/operators";

@Directive()
export abstract class RelatorioComponent<T, F> extends BaseComponent implements AfterViewInit {

    listaProcessos: T[];
    listaTotal: number = 0;
    rowCounter: number = 10;
    mensagemPaginacao: string;
    loadingAnalitico = false;

    constructor(
        protected override readonly messageService: MessageService,
        protected readonly processoService: ProcessoService,
        protected readonly router: Router,
        protected readonly data: Data,
        protected readonly ref: ChangeDetectorRef
    ) {
        super(messageService);
        this.listaProcessos = [];
    }

    protected abstract getFormularioPesquisa(): FormGroup;

    protected abstract getNomeRelatorio(): string;

    protected abstract getTituloRelatorio(): string;

    protected abstract getUrlRelatorio(): string;

    protected abstract consultarDadosRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<RelatorioAnaliticoDTO[]>;

    protected abstract consultarDadosRelatorio(filtro: F): Observable<T[]>;

    protected configurarResultadoPesquisa(resultado: T[]): void {
        this.configurarValorListaProcessos(resultado);
        if (this.listaProcessos && this.listaProcessos.length == 0) {
            this.showWarningMsg("MA003");
        }
    }

    private configurarValorListaProcessos(resultado: T[]) {
        this.listaProcessos = resultado;
        this.atualizarMensagemPaginacao();
    }

    public ngAfterViewInit(): void {
        this.configurarValoresFormulario();
        let frmPesquisa = this.getFormularioPesquisa();
        if (this.isFormularioAoMenosUmItemPreenchido(frmPesquisa)) {
            this.consultarDadosRelatorio(frmPesquisa.value).pipe(
                take<T[]>(1)
            ).subscribe(next => this.configurarResultadoPesquisa(next), e => {
                this.showDangerMsg(e.error);
            });
            this.data.storage = {};
        }
        this.ref.detectChanges();
    }

    protected atualizarMensagemPaginacao() {
        let end: number;
        if (this.listaProcessos) {
            end = this.listaProcessos.length;
            this.mensagemPaginacao = 'Mostrando de 1 até ' + end + ' de ' + this.listaProcessos.length + ' registros';
        }
    }

    protected validarDataInicioMaiorDataFim(dtInicio: Date, dtFim: Date, msg: string): boolean {
        let flg = true;
        if (null != dtInicio && null != dtFim) {
            if (dtInicio.getTime() > dtFim.getTime()) {
                this.showDangerMsg(msg);
                flg = false;
            }
        }
        return flg
    }

    protected validarDiferencaDatasMenorIgual(dtInicio: Date, dtFim: Date, dias: number, msg: string): boolean {
        let flg = true;
        if (null != dtInicio && null != dtFim) {
            let emDias = (dtFim.getTime() - dtInicio.getTime()) / (1000 * 60 * 60 * 24);
            emDias = emDias < 0 ? emDias * -1 : emDias;
            if (emDias > dias) {
                this.showDangerMsg(msg);
                flg = false;
            }
        }
        return flg
    }

    get exibirResultado(): boolean {
        return this.listaProcessos && this.listaProcessos.length > 0;
    }

    private configurarValoresFormulario() {
        try {
            if (this.data.storage && this.data.storage.filtro) {
                if (this.data.storage.voltar == this.getUrlRelatorio()) {
                    this.getFormularioPesquisa().setValue(this.data.storage.filtro);
                    this.getFormularioPesquisa().updateValueAndValidity();
                } else {
                    this.data.storage = {};
                }
            } else {
                this.data.storage = {};
            }
        } catch (e) {
            this.getFormularioPesquisa().reset();
        }
    }

    consultarRelatorioAnalitico() {
        if (this.listaProcessos.length > 0) {
            let filtroRelatorioOrigem: T = this.getFormularioPesquisa().getRawValue();
            let filtroRelAnaliticoDest: FiltroRelatorioAnalitico = new FiltroRelatorioAnalitico();
            let filtroRelAnalitico: FiltroRelatorioAnalitico = Object.assign(filtroRelAnaliticoDest, filtroRelatorioOrigem);
            filtroRelAnalitico.relatorioOrigem = this.getNomeRelatorio();

            this.loadingAnalitico = true;
            this.consultarDadosRelatorioAnalitico(filtroRelAnalitico).pipe(
                take<RelatorioAnaliticoDTO[]>(1)
            ).subscribe(res => {
                this.loadingAnalitico = false;
                const voltar = this.getUrlRelatorio();
                this.data.storage = {
                    pageable: {
                        dados: res,
                        total: res.length
                    },
                    filtro: filtroRelatorioOrigem,
                    filtroAnalitico: FiltroRelatorioAnalitico,
                    tituloRelatorio: this.getTituloRelatorio(),
                    voltar: voltar
                };

                this.router.navigateByUrl('/relatorios/analitico/lista');
            }, err => {
                this.loadingAnalitico = false;
                this.showDangerMsg(err.error);
            });
        }
    }

    public limparCampos(): void {
        this.getFormularioPesquisa().reset();
        this.configurarValorListaProcessos([]);
    }

}
