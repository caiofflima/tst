import {DadoComboDTO} from "app/shared/models/dto/dado-combo";
import {ComboService} from "app/shared/services/comum/combo.service";
import {ProcessoService} from "app/shared/services/comum/processo.service";
import {MessageService} from "app/shared/components/messages/message.service";
import {TipoProcessoService} from "app/shared/services/comum/tipo-processo.service";
import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {
    FiltroRelatorioProcedimentosSolicitadosPorProfissional
} from "app/shared/models/filtro/filtro-relatorio-procedimentos-solicitados-por-profissional";
import {Data} from "app/shared/providers/data";
import * as constantes from "app/shared/constantes";
import {RelatorioComponent} from "../../abstract-relatorio.component";
import {
    RelatorioProcedimentosSolicitadosPorProfissionalDTO
} from "../../../../shared/models/dto/relatorio-procedimentos-solicitados-por-profissional";
import {FiltroRelatorioAnalitico} from "../../../../shared/models/filtro/filtro-relatorio-analitico";
import {RelatorioAnaliticoDTO} from "../../../../shared/models/dto/relatorio-analitico";
import {Observable} from "rxjs";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {Loading} from "../../../../shared/components/loading/loading-modal.component";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";

@Component({
    selector: 'app-procedimentos-solicitados-por-profissional-home',
    templateUrl: 'procedimentos-solicitados-por-profissional-home.component.html',
    styleUrls: ['procedimentos-solicitados-por-profissional-home.component.scss'],
    providers: [ComboService],
    animations: [...fadeAnimation]
})
export class RelatorioProcedimentosSolicitadosPorProfissionalHomeComponent extends RelatorioComponent<RelatorioProcedimentosSolicitadosPorProfissionalDTO,
    FiltroRelatorioProcedimentosSolicitadosPorProfissional> implements OnInit {

    formulario: FormGroup;
    filtro: FiltroRelatorioProcedimentosSolicitadosPorProfissional;

    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    listComboFinalidade: DadoComboDTO[];
    listComboProcedimento: DadoComboDTO[];

    constructor(
        override readonly messageService: MessageService,
        override readonly processoService: ProcessoService,
        readonly tipoProcessoService: TipoProcessoService,
        override readonly router: Router,
        override readonly data: Data,
        override readonly ref: ChangeDetectorRef,
        private readonly location: Location,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService
    ) {
        super(messageService, processoService, router, data, ref);
    }

    override get constantes(): any {
        return constantes;
    }

    get idPedido(): AbstractControl {
        return this.formulario.get('idPedido');
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            'filiaisProcesso': this.formBuilder.control(null),
            'ufAtendimento': this.formBuilder.control(null),
            'tiposProcesso': this.formBuilder.control(null),
            'cpfCnpjProfissional': this.formBuilder.control(null),
            'idProcedimento': this.formBuilder.control(null),
            'dataInicio': this.formBuilder.control(null),
            'dataFim': this.formBuilder.control(null)
        });
    }

    ngOnInit() {
        if (this.data.storage && this.data.storage.filtro) {
            this.filtro = this.data.storage.filtro;
        } else {
            this.filtro = new FiltroRelatorioProcedimentosSolicitadosPorProfissional();
        }

        this.inicializarFormulario();
        this.inicializarCombos();
    }

    get tiposProcesso(): AbstractControl {
        return this.formulario.get('tiposProcesso');
    }

    get dataInicio(): AbstractControl {
        return this.formulario.get('dataInicio');
    }

    get dataFim(): AbstractControl {
        return this.formulario.get('dataFim');
    }

    inicializarCombos() {
        this.comboService.consultarComboFilial().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboFilial = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboUF().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboUF = res, err => this.showDangerMsg(err.error));

        this.tipoProcessoService.consultarTiposProcessoAutorizacaoPrevia()
        .subscribe(
            res => this.listComboTipoProcesso = res.map(res=> new DadoComboDTO(res.nome, res.id, res.nome)
        ), err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFinalidade().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboFinalidade = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboSituacaoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboSituacaoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboProcedimento().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboProcedimento = res, err => this.showDangerMsg(err.error));
    }

    consultarProcesso() {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();

        if (null != this.cpfCnpjProfissional.value && this.cpfCnpjProfissional.value.length > 0
            && !this.isValidoCPFCNPJFormatado(this.cpfCnpjProfissional)) {
            this.showDangerMsg("MA009", "CPF / CNPJ");
            return false;
        }

        let dtInicio = this.dataInicio.value;
        let dtFim = this.dataFim.value;

        let flgValido = this.validarDataInicioMaiorDataFim(dtInicio, dtFim, "MA099")
            && this.validarDiferencaDatasMenorIgual(dtInicio, dtFim, 1825, "MA113");

        if (flgValido) {
            Loading.start();
            this.consultarDadosRelatorio(this.formulario.value).pipe(
                take<RelatorioProcedimentosSolicitadosPorProfissionalDTO[]>(1)
            ).subscribe(res => {
                Loading.stop();
                this.configurarResultadoPesquisa(res);
            }, err => {
                Loading.stop();
                this.showDangerMsg(err.error);
            });
        }

        return null
    }

    get cpfCnpjProfissional(): AbstractControl {
        return this.formulario.get('cpfCnpjProfissional');
    }

    get cpfCnpjUtil(): any {
        return this.constantes.cpfCnpjUtil;
    }

    public checkCPFCNPJ(cmpnt): void {
        this.constantes.control.somenteNumeros(cmpnt);
        this.cpfCnpjUtil.control.limitarTamanho(cmpnt);
    }

    public isValidoCPFCNPJFormatado(cmpnt: AbstractControl): boolean {
        if (null != cmpnt && null != cmpnt.value) {
            return this.cpfCnpjUtil.isCpfCnpjFrmtdValido(cmpnt.value);
        }
        return false;
    }

    protected getNomeRelatorio(): string {
        return "PROCEDIMENTOS_SOLICITADOS_POR_PROFISSIONAL";
    }

    protected getTituloRelatorio(): string {
        return "Procedimentos Solicitados por Profissional";
    }

    protected getUrlRelatorio(): string {
        return "/relatorios/procedimentos-solicitados-por-profissional";
    }


    protected consultarDadosRelatorio(filtro: FiltroRelatorioProcedimentosSolicitadosPorProfissional):
        Observable<RelatorioProcedimentosSolicitadosPorProfissionalDTO[]> {
        return this.processoService.consultarRelatorioProcedimentosSolicitadosPorProfissional(filtro);
    }

    protected consultarDadosRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<RelatorioAnaliticoDTO[]> {
        return this.processoService.consultarRelatorioAnaliticoProcedimentosSolicitadosPorProfissional(filtro);
    }

    protected getFormularioPesquisa(): FormGroup {
        return this.formulario;
    }

    public voltar(): void {
        this.location.back();
    }

    validaFormulario(): boolean {
        return this.formulario.get('dataInicio').value !== null &&
            this.formulario.get('dataFim').value !== null;
    }
}
