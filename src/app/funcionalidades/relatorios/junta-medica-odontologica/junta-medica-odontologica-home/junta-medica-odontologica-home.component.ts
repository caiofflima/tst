import {DadoComboDTO} from "app/shared/models/dto/dado-combo";
import {ComboService} from "app/shared/services/comum/combo.service";
import {ProcessoService} from "app/shared/services/comum/processo.service";
import {MessageService} from "app/shared/components/messages/message.service";
import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {
    FiltroRelatorioJuntaMedicaOdontologica
} from "app/shared/models/filtro/filtro-relatorio-junta-medica-odontologica";
import {Data} from "app/shared/providers/data";
import * as constantes from "app/shared/constantes";
import {RelatorioComponent} from "../../abstract-relatorio.component";
import {RelatorioJuntaMedicaOdontologicaDTO} from "../../../../shared/models/dto/relatorio-junta-medica-odontologica";
import {FiltroRelatorioAnalitico} from "../../../../shared/models/filtro/filtro-relatorio-analitico";
import {Observable} from "rxjs";
import {RelatorioAnaliticoDTO} from "../../../../shared/models/dto/relatorio-analitico";
import {Location} from "@angular/common";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {Loading} from "../../../../shared/components/loading/loading-modal.component";

@Component({
    selector: 'app-junta-medica-odontologica-home',
    templateUrl: 'junta-medica-odontologica-home.component.html',
    styleUrls: ['junta-medica-odontologica-home.component.scss'],
    providers: [ComboService]
})
export class RelatorioJuntaMedicaOdontologicaHomeComponent extends RelatorioComponent<RelatorioJuntaMedicaOdontologicaDTO, FiltroRelatorioJuntaMedicaOdontologica> implements OnInit {

    formulario = new FormGroup({
        idPedido: new FormControl(null),
        ufAtendimento: new FormControl(null),
        dataInicio: new FormControl(null),
        dataFim: new FormControl(null),
        filiaisProcesso: new FormControl(null),
    });

    filtro: FiltroRelatorioJuntaMedicaOdontologica;

    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    listComboTipoBeneficiario: DadoComboDTO[];
    listComboUF: DadoComboDTO[];
    listComboFilial: DadoComboDTO[];
    listComboFinalidade: DadoComboDTO[];

    constructor(
        override readonly messageService: MessageService,
        override readonly processoService: ProcessoService,
        override readonly router: Router,
        override readonly data: Data,
        override readonly ref: ChangeDetectorRef,
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

    ngOnInit() {
        if (this.data.storage && this.data.storage.filtro) {
            this.filtro = this.data.storage.filtro;
        } else {
            this.filtro = new FiltroRelatorioJuntaMedicaOdontologica();
        }

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
        this.comboService.consultarComboFilial().subscribe(res => this.listComboFilial = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboUF().subscribe(res => this.listComboUF = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboTipoProcesso().subscribe(res => this.listComboTipoProcesso = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboFinalidade().subscribe(res => this.listComboFinalidade = res, err => this.showDangerMsg(err.error));

        this.comboService.consultarComboSituacaoProcesso().subscribe(res => this.listComboSituacaoProcesso = res, err => this.showDangerMsg(err.error));
    }

    consultarProcesso() {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();

        let dtFim = this.dataFim.value;
        let dtInicio = this.dataInicio.value;
        let flgValido = this.validarDataInicioMaiorDataFim(dtInicio, dtFim, "MA099")
            && this.validarDiferencaDatasMenorIgual(dtInicio, dtFim, 1825, "MA113");

        let aoMenosUmItemPreenchido = this.isFormularioAoMenosUmItemPreenchido(this.formulario);
        if (flgValido && this.formulario.valid && aoMenosUmItemPreenchido) {

            Loading.start();
            this.consultarDadosRelatorio(this.formulario.value).subscribe(res => {
                Loading.stop();
                this.configurarResultadoPesquisa(res);
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

    public downloadRelatorioJMO(): void {
        if (this.listaProcessos && this.listaProcessos.length > 0) {
            this.exportarXLSRelatorioJuntaMedicaOdontologica(this.listaProcessos);
        }
    }

    private exportarXLSRelatorioJuntaMedicaOdontologica(resultado: RelatorioJuntaMedicaOdontologicaDTO[]): void {
        this.processoService.exportarXLSRelatorioJuntaMedicaOdontologica(resultado).subscribe((fileByteArray: any) => {
            let blob = new Blob([fileByteArray], {type: 'application/vnd.ms-excel'});
            let a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'relatorio-junta-medica-odontologica.xls';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, () => this.showDangerMsg('MA00Q'));
    }

    protected getNomeRelatorio(): string {
        return "JUNTA_MEDICA_ODONTOLOGICA";
    }

    protected getUrlRelatorio(): string {
        return "/relatorios/junta-medica-odontologica";
    }

    protected getTituloRelatorio(): string {
        return "Junta Médica/Odontológica";
    }

    protected consultarDadosRelatorio(filtro: any): Observable<RelatorioJuntaMedicaOdontologicaDTO[]> {
        return this.processoService.consultarRelatorioJuntaMedicaOdontologica(filtro);
    }

    protected consultarDadosRelatorioAnalitico(filtro: FiltroRelatorioAnalitico): Observable<RelatorioAnaliticoDTO[]> {
        return this.processoService.consultarRelatorioAnaliticoJuntaMedicaOdontologica(filtro);
    }

    protected getFormularioPesquisa(): FormGroup {
        return this.formulario;
    }

    voltar(): void {
        this.location.back();
    }

    validaFormulario(): boolean {
        return this.formulario.get('dataInicio').value !== null &&
            this.formulario.get('dataFim').value !== null;
    }
}
