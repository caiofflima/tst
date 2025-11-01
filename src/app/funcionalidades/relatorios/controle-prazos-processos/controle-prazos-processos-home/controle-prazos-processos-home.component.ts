import {DadoComboDTO} from "app/shared/models/dto/dado-combo";
import {ComboService} from "app/shared/services/comum/combo.service";
import {ProcessoService} from "app/shared/services/comum/processo.service";
import {MessageService} from "app/shared/components/messages/message.service";
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
    FiltroRelatorioControlePrazosProcessos
} from "app/shared/models/filtro/filtro-relatorio-controle-prazos-processos";
import {Data} from "app/shared/providers/data";
import * as constantes from "app/shared/constantes";
import {RelatorioComponent} from "../../abstract-relatorio.component";
import {RelatorioControlePrazosProcessosDTO} from "../../../../shared/models/dto/relatorio-controle-prazos-processos";
import {FiltroRelatorioAnalitico} from "../../../../shared/models/filtro/filtro-relatorio-analitico";
import {Observable} from "rxjs";
import {RelatorioAnaliticoDTO} from "../../../../shared/models/dto/relatorio-analitico";
import {TextMaskModule} from "angular2-text-mask";
import {take} from "rxjs/operators";
import {Location} from "@angular/common";
import {Loading} from "../../../../shared/components/loading/loading-modal.component";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import { map } from "rxjs";

@Component({
    selector: 'app-controle-prazos-processos-home',
    templateUrl: 'controle-prazos-processos-home.component.html',
    styleUrls: ['controle-prazos-processos-home.component.scss'],
    providers: [ComboService],
    animations: [...fadeAnimation]
})
export class RelatorioControlePrazosProcessosHomeComponent extends RelatorioComponent<RelatorioControlePrazosProcessosDTO,
    FiltroRelatorioControlePrazosProcessos> implements AfterViewInit, OnInit {

    textMask: TextMaskModule
    formulario: FormGroup;
    filtro: FiltroRelatorioControlePrazosProcessos;
    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboMunicipio: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    listComboFinalidade: DadoComboDTO[];

    constructor(
        override readonly messageService: MessageService,
        override readonly processoService: ProcessoService,
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

    get diasTempoProcesso(): AbstractControl {
        return this.formulario.get('diasTempoProcesso');
    }

    private inicializarFormulario() {
        this.formulario = this.formBuilder.group({
            'idPedido': this.formBuilder.control(null),
            'ufAtendimento': this.formBuilder.control(null),
            'tiposProcesso': this.formBuilder.control(null),
            'idMotivoSolicitacao': this.formBuilder.control(null),
            'situacoesProcesso': this.formBuilder.control(null),
            'diasTempoProcesso': this.formBuilder.control(null),
            'filiaisProcesso': this.formBuilder.control(null),
            'dataInicio': this.formBuilder.control(null, Validators.required),
            'dataFim': this.formBuilder.control(null, Validators.required)
        });
    }

    ngOnInit() {
        this.inicializarFormulario();
        this.inicializarCombos();

        if (this.formulario.controls['ufAtendimento'] != null && this.formulario.controls['ufAtendimento'].value != null) {
            this.onChangeUFAtendimento(null);
        }
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
        ).subscribe(res => this.listComboFilial = this.tratarComboFilial(res), err => this.showDangerMsg(err.error));

        this.comboService.consultarComboUF().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboUF = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcessoAutorizacaoPrevia().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFinalidade().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboFinalidade = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboSituacaoProcesso().pipe(
            take<DadoComboDTO[]>(1)
        ).subscribe(res => this.listComboSituacaoProcesso = res, err => this.showDangerMsg(err.error));
    }

    onChangeUFAtendimento(_: any) {
        let ufAtendimento: DadoComboDTO = this.formulario.controls['ufAtendimento'].value;

        if (ufAtendimento && ufAtendimento.value && ufAtendimento.value > 0) {

            this.formulario.controls['municipioAtendimento'].setValue(null);

            this.comboService.consultarDadosComboMunicipioPorUF(ufAtendimento.value).pipe(
                take<DadoComboDTO[]>(1)
            ).subscribe(res => {
                    this.listComboMunicipio = res;

                    if (this.formulario.controls['ufAtendimento'] != null && this.formulario.controls['ufAtendimento'].value != null) {
                        this.listComboMunicipio.forEach(combo => {
                            if (combo.value == this.filtro.municipioAtendimento.value) {
                                this.formulario.controls['municipioAtendimento'].setValue(combo);
                            }
                        });
                    }

                }, err => this.showDangerMsg(err.error)
            );
        }
    }

    consultarProcesso() {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();

        let dtInicio = this.dataInicio.value;
        let dtFim = this.dataFim.value;
        let flgValido = this.validarDataInicioMaiorDataFim(dtInicio, dtFim, "MA099")
            && this.validarDiferencaDatasMenorIgual(dtInicio, dtFim, 730, "MA036");
        let aoMenosUmItemPreenchido = this.isFormularioAoMenosUmItemPreenchido(this.formulario);
        if (flgValido && (this.formulario.valid && aoMenosUmItemPreenchido)) {

            if (!aoMenosUmItemPreenchido) {
                this.showDangerMsg(this.bundle("MA016"));
                return;
            }

            Loading.start();
            this.consultarDadosRelatorio(this.formulario.value).pipe(
                take<any[]>(1)
            ).subscribe(res => {
                Loading.stop();
                this.configurarResultadoPesquisa(res)
            }, err => {
                Loading.stop();
                this.showDangerMsg(err.error);
            });
        } else {
            this.validateAllFormFields(this.formulario);
            if (!aoMenosUmItemPreenchido) {
                this.showDangerMsg("MA114");
            }
        }
    }

  private tratarComboFilial(res: DadoComboDTO[]): DadoComboDTO[] {
        return res.map(filial => ({
            ...filial,
            label: filial.label ? filial.label.toUpperCase() : ''
        }));
    }

    protected getNomeRelatorio(): string {
        return "CONTROLE_PRAZOS_PROCESSOS";
    }

    protected getUrlRelatorio(): string {
        return "/relatorios/controle-prazos-pedidos";
    }

    protected getTituloRelatorio(): string {
        return "Controle de Prazo dos Pedidos";
    }

    protected consultarDadosRelatorio(filtro: FiltroRelatorioControlePrazosProcessos): Observable<any[]> {
        return this.processoService.consultarRelatorioControlePrazosProcessos(filtro);
    }

    protected consultarDadosRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<RelatorioAnaliticoDTO[]> {
       return new Observable<RelatorioAnaliticoDTO[]>(observer => {
            this.processoService.consultarRelatorioAnaliticoControlePrazosProcessos(filtro).subscribe(
                dados => {
                    const relatoriosTransformados = dados.map(relatorio => ({
                        ...relatorio,
                        nomeBeneficiario: relatorio.nomeBeneficiario ? relatorio.nomeBeneficiario.toUpperCase() : '',
                        nomeRazaoSocial: relatorio.nomeRazaoSocial ? relatorio.nomeRazaoSocial.toUpperCase() : ''
                    }));
                    observer.next(relatoriosTransformados);
                    observer.complete();
                },
                error => {
                    observer.error(error); 
                }
            );
        });
    }
      
    protected getFormularioPesquisa(): FormGroup {
        return this.formulario;
    }

    voltar(): void {
        this.location.back();
    }
}
