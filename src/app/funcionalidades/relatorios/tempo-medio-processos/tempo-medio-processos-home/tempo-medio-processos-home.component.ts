import {DadoComboDTO} from "app/shared/models/dto/dado-combo";
import {ComboService} from "app/shared/services/comum/combo.service";
import {ProcessoService} from "app/shared/services/comum/processo.service";
import {MessageService} from "app/shared/components/messages/message.service";
import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FiltroRelatorioTempoMedioProcessos} from "app/shared/models/filtro/filtro-relatorio-tempo-medio-processos";
import {Data} from "app/shared/providers/data";
import * as constantes from "app/shared/constantes";
import {RelatorioComponent} from "../../abstract-relatorio.component";
import {RelatorioTempoMedioProcessosDTO} from "../../../../shared/models/dto/relatorio-tempo-medio-processos";
import {Observable, take} from "rxjs";
import {RelatorioAnaliticoDTO} from "../../../../shared/models/dto/relatorio-analitico";
import {FiltroRelatorioAnalitico} from "../../../../shared/models/filtro/filtro-relatorio-analitico";
import {Location} from "@angular/common";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {Loading} from "../../../../shared/components/loading/loading-modal.component";
import { PrimeNgDatatableOnPageEntity } from "app/arquitetura/shared/models/prime-ng-datatable-on-page-entity";

@Component({
    selector: 'app-tempo-medio-processos-home',
    templateUrl: 'tempo-medio-processos-home.component.html',
    styleUrls: ['tempo-medio-processos-home.component.scss'],
    providers: [ComboService],
    animations: [...fadeAnimation]
})
export class RelatorioTempoMedioProcessosHomeComponent extends RelatorioComponent<RelatorioTempoMedioProcessosDTO, FiltroRelatorioTempoMedioProcessos> implements OnInit {

    formulario: FormGroup;
    filtro: FiltroRelatorioTempoMedioProcessos;

    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    listComboFinalidade: DadoComboDTO[];
    override listaProcessos: any[];
    override rowCounter: number = 10;
    override mensagemPaginacao: string;

    primeNgPagination: PrimeNgDatatableOnPageEntity = new PrimeNgDatatableOnPageEntity();

    constructor(
        override readonly messageService: MessageService,
        override readonly processoService: ProcessoService,
        override readonly router: Router,
        override readonly data: Data,
        override readonly ref: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        private readonly comboService: ComboService,
        private readonly location: Location
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
            'idPedido': this.formBuilder.control(null),
            'filiaisProcesso': this.formBuilder.control(null),
            'ufAtendimento': this.formBuilder.control(null),
            'tiposProcesso': this.formBuilder.control(null),
            'situacoesProcesso': this.formBuilder.control(null),
            'dataInicio': this.formBuilder.control(null, Validators.required),
            'dataFim': this.formBuilder.control(null, Validators.required)
        });
    }

    ngOnInit() {
        if (this.data.storage && this.data.storage.filtro) {
            this.filtro = this.data.storage.filtro;
        } else {
            this.filtro = new FiltroRelatorioTempoMedioProcessos();
        }
        this.listaProcessos = [];
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
        this.comboService.consultarComboFilial().pipe(take(1)).subscribe(res => this.listComboFilial = res, err => this.showDangerMsg(err.error));
        this.comboService.consultarComboUF().pipe(take(1)).subscribe(res => this.listComboUF = res, err => this.showDangerMsg(err.error));
        this.comboService.consultarComboTipoProcesso().pipe(take(1)).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));
        this.comboService.consultarComboFinalidade().pipe(take(1)).subscribe(res => this.listComboFinalidade = res, err => this.showDangerMsg(err.error));
        this.comboService.consultarComboSituacaoProcesso().pipe(take(1)).subscribe(res => this.listComboSituacaoProcesso = res, err => this.showDangerMsg(err.error));
    }

    consultarProcesso() {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();

        let dtInicio = this.dataInicio.value;
        let dtFim = this.dataFim.value;
        let flgValido = this.validarDataInicioMaiorDataFim(dtInicio, dtFim, "MA099")
            && this.validarDiferencaDatasMenorIgual(dtInicio, dtFim, 730, "MA036");

        if (flgValido && this.formulario.valid) {
            Loading.start();
            this.consultarDadosRelatorio(this.formulario.value).pipe(take(1)).subscribe(res => {
                Loading.stop();
                this.configurarResultadoPesquisa(res);
            }, err => {
                Loading.stop();
                this.showDangerMsg(err.error);
            });
        }
    }

    protected consultarDadosRelatorio(
        filtro: FiltroRelatorioTempoMedioProcessos,
        rowCounter?: Number,
        offsetCounter?: Number): Observable<RelatorioTempoMedioProcessosDTO[]> {
        return this.processoService.consultarRelatorioTempoMedioProcessos(filtro,rowCounter,offsetCounter);
    }

    protected getNomeRelatorio(): string {
        return "TEMPO_MEDIO_PROCESSOS";
    }

    protected getUrlRelatorio(): string {
        return "/relatorios/tempo-medio-pedidos";
    }

    protected getTituloRelatorio(): string {
        return "Tempo Médio dos Pedidos";
    }

    protected consultarDadosRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<RelatorioAnaliticoDTO[]> {
        return this.processoService.consultarRelatorioAnaliticoTempoMedioProcessos(filtro);
    }

    protected getFormularioPesquisa(): FormGroup {
        return this.formulario;
    }

    protected paginacaoMudou(evento : PrimeNgDatatableOnPageEntity){
        // no aguardo de funcionalidades
    }

    voltar(): void {
        this.location.back();
    }

    validaFormulario(): boolean {
        return this.formulario.get('dataInicio').value !== null &&
            this.formulario.get('dataFim').value !== null;
    }
}
