import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {BaseComponent} from "../../../../app/shared/components/base.component";
import {
    AutorizacaoPreviaService,
    ComboService,
    MessageService,
    ProcessoService,
    SessaoService
} from "../../../../app/shared/services/services";
import {Beneficiario} from "../../../../app/shared/models/entidades";
import {DadoComboDTO, ProcessoDTO} from "../../../../app/shared/models/dtos";
import {Data} from "../../../../app/shared/providers/data";
import {CalendarLocalePt} from "../../../../app/shared/util/calendar-locale-pt";
import {PrestadorExternoService} from "../../../shared/services/comum/prestador-externo.service";
import {DadosPrestadorExterno, Usuario} from "../../../arquitetura/shared/models/cadastrobasico/usuario";
import {AscValidators} from "../../../shared/validators/asc-validators";
import {CI_MASK, CPF_MASK} from "../../../shared/util/masks";
import {
    ResultadoPesquisaProcessosCredenciadoComponent
} from "../resultado-pesquisa-processos-credenciado/resultado-pesquisa-processos-credenciado.component";
import {Util} from "../../../arquitetura/shared/util/util";
import { take } from "rxjs";

@Component({
    selector: 'app-pesquisar-processos-autorizador-home',
    templateUrl: 'pesquisar-processos-credenciado-home.component.html',
    styleUrls: ['pesquisar-processos-credenciado-home.component.scss']
})
export class PesquisarProcessosCredenciadoHomeComponent extends BaseComponent implements OnInit {

    @ViewChild("resultadoPesquisa")
    resultadoPesquisa: ResultadoPesquisaProcessosCredenciadoComponent;

    pt: any;
    form: FormGroup;
    titular: Beneficiario;
    matricula: string;
    listColaboradores: any[];
    listComboTipoProcesso: DadoComboDTO[];
    listComboSituacaoProcesso: DadoComboDTO[];
    exibirResultadosUsuarioSessao: boolean;
    listProcessosUsuarioSessao: ProcessoDTO[];
    maskCI: Array<string | RegExp> = CI_MASK;
    maskCPF: Array<string | RegExp> = CPF_MASK;

    constructor(
        messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly data: Data,
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly prestadorService: PrestadorExternoService,
        private readonly route: ActivatedRoute,
        private readonly comboService: ComboService,
        private readonly processoService: ProcessoService,
        private readonly sessaoService: SessaoService
    ) {
        super(messageService);
        this.listColaboradores = [];
        this.pt = new CalendarLocalePt();
        this.form = fb.group({
            idPedido: fb.control(null),
            numeroCartao: fb.control(null),
            cpfBeneficiario: fb.control(null),
            nomeBeneficiario: fb.control(null),
            idUsuarioCredenciado: fb.control(null),
            idEmpresaCredenciada: fb.control(null),
            tiposProcesso: fb.control(null),
            situacoesProcesso: fb.control(null),
            dataInicio: fb.control(null),
            dataFim: fb.control(null)
        });
        this.initComportamentoCamposData();
    }

    private initComportamentoCamposData() {
        this.dataInicio.setValidators(AscValidators.dataInicioMaior(() => this.dataFim));
        this.dataFim.setValidators(AscValidators.invervaloDatasMaiorQue(() => this.dataInicio, 90));
        PesquisarProcessosCredenciadoHomeComponent.updateValueAndValidityAndReset(this.dataInicio);
        PesquisarProcessosCredenciadoHomeComponent.updateValueAndValidityAndReset(this.dataFim);
        this.dataInicio.valueChanges.subscribe(next => {
            if (next instanceof Date) {
                this.dataFim.enable();
            } else {
                this.dataFim.disable();
                this.dataFim.setValue(null);
            }
        });
    }


    private usuarioSessao(): Usuario {
        return this.sessaoService.getUsuario();
    }

    private prestadorExterno(): DadosPrestadorExterno {
        return this.usuarioSessao().dadosPrestadorExterno;
    }

    get idPedido(): AbstractControl {
        return this.form.get('idPedido');
    }

    get numeroCartao(): AbstractControl {
        return this.form.get('numeroCartao');
    }

    get nomeBeneficiario(): AbstractControl {
        return this.form.get('nomeBeneficiario');
    }

    get idUsuarioCredenciado(): AbstractControl {
        return this.form.get('idUsuarioCredenciado');
    }

    get idEmpresaCredenciada(): AbstractControl {
        return this.form.get('idEmpresaCredenciada');
    }

    get tiposProcesso(): AbstractControl {
        return this.form.get('tiposProcesso');
    }

    get situacoesProcesso(): AbstractControl {
        return this.form.get('situacoesProcesso');
    }

    get dataInicio(): AbstractControl {
        return this.form.get('dataInicio');
    }

    get dataFim(): AbstractControl {
        return this.form.get('dataFim');
    }

    ngOnInit() {
        this.data.reset();
        this.dataFim.disable();
        this.exibirResultadosUsuarioSessao = false;
        this.route.params.subscribe((next: any) => {
            let exibir = next['minhasSolicitacoes'];
            if (exibir) {
                this.exibirResultadosUsuarioSessao = exibir;
            }
        });
        let idCredenciado = this.sessaoService.getUsuario().idCredenciadoSelecionado;
        this.comboService.consultarComboTipoProcessoCredenciado().pipe(take(1)).subscribe(next => this.listComboTipoProcesso = next);
        this.comboService.consultarComboSituacaoProcesso().pipe(take(1)).subscribe(next => this.listComboSituacaoProcesso = next);
        this.prestadorService.consultarPorIdCredenciado(idCredenciado).pipe(take(1)).subscribe((next:any[]) => {
            for (let c of next) {
                this.listColaboradores.push({label: c.nome, value: c.id});
            }
            if (this.exibirResultadosUsuarioSessao) {
                this.idUsuarioCredenciado.setValue(this.prestadorExterno().id);
            }
        });

        if (this.exibirResultadosUsuarioSessao) {
            let idEmpresa = this.usuarioSessao().idCredenciadoSelecionado;
            let idOperador = this.prestadorExterno().id;
            this.processoService.consultarProcessosNaoConclusivosPorOperadorCredenciado(idOperador, idEmpresa, 10).pipe(take(1)).subscribe((next:ProcessoDTO[]) => this.listProcessosUsuarioSessao = next);
        }
    }

    public pesquisarProcessos(): void {
        this.dataInicio.updateValueAndValidity();
        this.dataFim.updateValueAndValidity();
        if (this.form.valid && this.isFormularioAoMenosUmItemPreenchido(this.form)) {
            this.idEmpresaCredenciada.setValue(this.usuarioSessao().idCredenciadoSelecionado);
            if (this.dataInicio.value instanceof Date  && !(this.dataFim.value instanceof Date)) {
                let dtInicio = this.dataInicio.value;
                let dtFim = Util.getDate(dtInicio);
                dtFim.setDate(dtInicio.getDate() + 90);
                this.dataFim.setValue(dtFim);
            }
            let colaborador = this.listColaboradores.filter(i => i.value === this.idUsuarioCredenciado.value);
            if (colaborador) {
                this.data.storage['colaborador'] = colaborador[0];
            }
            this.data.storage['filtro'] = this.form.getRawValue();

            let url = '/pesquisar-processos-credenciado/lista-resultado';
            url += '/' + btoa(this.urlOrigemPesquisar);
            this.router.navigateByUrl(url);
        } else {
            this.validateAllFormFields(this.form);
            this.switchShowDangerMsg()
           
        }
    }

    switchShowDangerMsg(){
        if (this.dataInicio.errors && this.dataInicio.errors['dataInicioMaior']) {
            this.showDangerMsg("MA115")
        } else if (this.dataFim.errors && this.dataFim.errors['intervaloMaior']) {
            this.showDangerMsg("MA110", 90);
        } else if (this.nomeBeneficiario.errors && this.nomeBeneficiario.errors['minlength']) {
            this.showDangerMsg("MA120", "Nome do Beneficiário");
        } else {
            this.showDangerMsg("MA114");
        }
    }

    get urlOrigemPesquisar(): string {
        if (this.exibirResultadosUsuarioSessao) {
            return '/pesquisar-processos-credenciado/home/true';
        } else {
            return '/pesquisar-processos-credenciado/home';
        }
    }

    get tituloTela(): string {
        if (this.exibirResultadosUsuarioSessao) {
            return 'Minhas Solicitações';
        } else {
            return 'Consultar Solicitações';
        }
    }

    get cpfUtil(): any {
        return this.constantes.cpfUtil;
    }

    private static updateValueAndValidityAndReset(cntrl: AbstractControl) {
        cntrl.updateValueAndValidity();
        cntrl.reset();
    }

}
