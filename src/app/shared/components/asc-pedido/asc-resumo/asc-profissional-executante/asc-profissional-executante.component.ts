import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DadoComboDTO} from "../../../../models/dto/dado-combo";
import {ProfissionalFormModel} from "../../models/profissional-form.model";
import {FormBuilder} from "@angular/forms";
import {aplicarAcaoQuandoFormularioValido, cpfCnpjUtil, cpfUtil, isNotUndefinedOrNull} from "../../../../constantes";
import {AutorizacaoPreviaService, ConselhoProfissionalService, LocalidadeService} from "../../../../services/services";
import {Pedido} from "../../../../models/comum/pedido";
import {catchError, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {ConselhoProfissional} from "../../../../models/comum/conselho-profissional";
import {CustomOperatorsRxUtil} from "../../../../util/custom-operators-rx-util";
import {Municipio} from "../../../../models/comum/municipio";
import {AscComponenteAutorizado} from "../../asc-componente-autorizado";
import {of} from "rxjs";
import {Estado} from "../../../../models/comum/estado";

@Component({
    selector: 'asc-profissional-executante-pedido',
    templateUrl: './asc-profissional-executante.component.html',
    styleUrls: ['./asc-profissional-executante.component.scss']
})
export class AscProfissionalExecutanteComponent extends AscComponenteAutorizado implements OnInit, OnDestroy {

    @Input()
    conselho: DadoComboDTO;

    @Input()
    profissional: ProfissionalFormModel | any;

    @Input()
    ufConselho: DadoComboDTO;

    @Input()
    enableAllAction = true;

    @Input()
    toTop = false;
    
    @Input()
    titulo = 'Profissional executante';

    @Input()
    municipioProfissional: Municipio;

    @Output()
    readonly profissionalFormAtualizado = new EventEmitter<ProfissionalFormModel>();

    @Output('onEditing')
    readonly onEditing$ = new EventEmitter<boolean>();

    _conselhoSelecionado: DadoComboDTO;

    private _exibirFormularioProfissionalExecutante = false;

    readonly profissionalExecutanteForm = this.formBuilder.group({
        idConselhoProfissional: [null],
        numeroConselho: [null],
        idEstadoConselho: [null],
        cpfCnpj: [null],
        nomeProfissional: [null],
        idEstadoProfissional: [null],
        idMunicipioProfissional: [null]
    });
    private estadoConselho: DadoComboDTO;

    private _processo: Pedido;
    private _pedidoAux = new Pedido();
    private readonly processo$ = new EventEmitter<Pedido>();
    loading = false;

    municipioProfissionalEdicao: Municipio;

    titular: any;
    TIPO_PROCESSO_AUTORIZACAO_PREVIA:number = 3;
    
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly conselhoProfissional: ConselhoProfissionalService,
        private readonly localidadeService: LocalidadeService,
        private readonly processoService: AutorizacaoPreviaService
    ) {
        super();
    }

    set exibirFormularioProfissionalExecutante(b: boolean) {
        this._exibirFormularioProfissionalExecutante = b;
        this.onEditing$.emit(this._exibirFormularioProfissionalExecutante);
    }

    get exibirFormularioProfissionalExecutante(): boolean {
        return this._exibirFormularioProfissionalExecutante;
    }

    @Input() set processo(processo: Pedido) {
        setTimeout(() => {
            this._processo = processo;
            this.processo$.emit(processo);
            if (processo) {
                this.configurarEstadoConselho();
            }
        }, 0);
    }

    private configurarEstadoConselho() {
        let estado = this.processo["estadoConselho"] as Estado;
        if (estado) {
            this.construirUfConselho(estado);
        }
    }

    get processo() {
        return this._processo;
    }

    ngOnInit() {
        this.registrarBuscaConselhoProfissional();
        this.registrarMapeamentoConselhoEProfissionalComBaseNoProcesso();
        this.registrarBuscaDeMunipicipioPorId();
        this.registrarAtualizarProfissionalQuandoForProcessoAns();
    }

    salvarEdicaoProfissionalExecutante() {
        aplicarAcaoQuandoFormularioValido(this.profissionalExecutanteForm, () => {
            const profissionalFormModel = this.profissionalExecutanteForm.value as ProfissionalFormModel;
            this.profissional = {...profissionalFormModel, ufConselho: this.estadoConselho};
            this.exibirFormularioProfissionalExecutante = false;
            this.ufConselho = this.estadoConselho;
            this.conselho = this._conselhoSelecionado;
            this.municipioProfissional = this.municipioProfissionalEdicao;
            this.profissionalFormAtualizado.emit(this.profissional)
        });
    }

    cancelarEdicaoProfissionalExecutante() {
        this.exibirFormularioProfissionalExecutante = false;
    }

    editarProfissionalExecutante() {
        this.exibirFormularioProfissionalExecutante = true;
        // console.log("================== this.profissional");
        // console.log(this.profissional);
        // console.log("================== this.municipioProfissional");
        // console.log(this.municipioProfissional);
        // console.log("================== this.ufConselho");
        // console.log(this.ufConselho);
        
        if (this.profissional) {
            this.profissionalExecutanteForm.setValue({
                idConselhoProfissional: this.profissional.idConselhoProfissional,
                numeroConselho: this.profissional.numeroConselho,
                //idEstadoConselho: this.profissional.idEstadoConselho, //estava colocando o local errado
                idEstadoConselho: this.ufConselho.value,
                cpfCnpj: this.profissional.cpfCnpj || this.processo.cpf || this.processo.cnpj,
                nomeProfissional: this.profissional.nomeProfissional || this.processo.nomeProfissional,
                idEstadoProfissional: this.profissional.idEstadoConselho || this.municipioProfissional &&
                    (this.municipioProfissional.estado ? this.municipioProfissional.estado.id : null),
                idMunicipioProfissional: this.profissional.idMunicipioProfissional || this.processo.idMunicipioProfissional
            });
            this._conselhoSelecionado = this.conselho;
            this.estadoConselho = this.ufConselho;
        }
    }

    verificarEhTitularEPedidoEmAnalise():boolean {
        let situacao = 'SOB_ANALISE_EQUIPE_TEC_ADMINISTRATIVA';

        if(sessionStorage && sessionStorage.getItem('titular')){
            this.titular = sessionStorage.getItem('titular').toString;
        }

        if(this.processo){
            return this._pedidoAux.verificarEhTitularEPedidoEmAnalise(this.titular, this.processo, situacao);
        }
        
        return false;
    }

    estadoConselhoSelecionado(estadoConselho: DadoComboDTO) {
        this.estadoConselho = estadoConselho;

    }

    conselhoSelecionado(conselhoSelecionado: DadoComboDTO) {
        this._conselhoSelecionado = conselhoSelecionado;
    }

    private registrarBuscaConselhoProfissional() {
        this.processo$.pipe(
            CustomOperatorsRxUtil.filterBy((pedido: Pedido) => isNotUndefinedOrNull(pedido.protocoloAns)),
            switchMap((processo: Pedido) => this.conselhoProfissional.consultarConselhosProfissionaisPorId(processo.idConselhoProfissional)),
            takeUntil(this.unsubscribe$),
            tap((processo: ConselhoProfissional) => this.construirConselhoComBaseNoProcesso(processo)),
        ).subscribe();
    }


    private construirConselhoComBaseNoProcesso(conselho: ConselhoProfissional) {
        if (conselho) {
            this.conselho = {value: conselho.id, label: conselho.sigla, descricao: conselho.descricao}
        }
    }

    private registrarMapeamentoConselhoEProfissionalComBaseNoProcesso() {
        this.processo$.pipe(
            CustomOperatorsRxUtil.filterBy((pedido: Pedido) => isNotUndefinedOrNull(pedido.protocoloAns)),
            tap((processo: Pedido) => this.construirProfissionalComBaseNoProcesso(processo)),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    private construirProfissionalComBaseNoProcesso(processo: Pedido) {
        this.profissional = {
            idConselhoProfissional: processo.idConselhoProfissional,
            numeroConselho: Number(processo.numeroConselho),
            cpfCnpj: processo.cpf || processo.cnpj,
            nomeProfissional: processo.nomeProfissional,
            idMunicipioProfissional: processo.idMunicipioProfissional,
            idEstadoConselho: processo.idEstadoConselho
        }

        if (processo.idMunicipioProfissional) {
            this.localidadeService.consultarMunicipioPorId(processo.idMunicipioProfissional).pipe(
                take<Municipio>(1)
            ).subscribe(m => this.municipioProfissional = m);
        }

    }

    private registrarBuscaDeMunipicipioPorId() {
        this.processo$.pipe(
            CustomOperatorsRxUtil.filterBy((pedido: Pedido) => isNotUndefinedOrNull(pedido.protocoloAns)),
            CustomOperatorsRxUtil.filterBy((pedido: Pedido) => isNotUndefinedOrNull(pedido.idMunicipioProfissional)),
            switchMap((processo: Pedido) =>
                this.localidadeService.consultarDadosComboMunicipiosMesmaUFPorIdMunicipio(processo.idMunicipioProfissional)),
            tap((municipios: Municipio[]) => this.construirUfConselhoByMunicipio(municipios[0])),
            catchError(() => {
                return of({});
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    private construirUfConselhoByMunicipio(municipio: Municipio) {
        this.construirUfConselho(municipio.estado);
    }

    private construirUfConselho(estado: Estado) {
        if (estado) {
            this.ufConselho = {
                value: estado.id,
                label: estado.sigla,
                descricao: estado.nome
            }
        }
    }

    private registrarAtualizarProfissionalQuandoForProcessoAns() {
        this.profissionalFormAtualizado.pipe(
            CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
            CustomOperatorsRxUtil.filterBy(() => Boolean(this._processo && this._processo.protocoloAns)),
            tap(() => this.loading = true),
            switchMap((profissionalFormModel: ProfissionalFormModel) => this.enviarProfissionalAtualizadoBackend(profissionalFormModel)),
            tap(() => this.loading = false),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    private enviarProfissionalAtualizadoBackend(profissionalFormModel: ProfissionalFormModel) {
        const cpfCnpjSemFormatacao = cpfCnpjUtil.limparFormatacao(profissionalFormModel.cpfCnpj);
        const isCpf = cpfUtil.isValido(cpfCnpjSemFormatacao);
        this._processo.cnpj = cpfCnpjSemFormatacao;
        if (isCpf) {
            this._processo.cpf = cpfCnpjSemFormatacao;
            this._processo.cnpj = null;
        }
        const processoComProfissionalAtualizado = {
            ...this._processo,
            nomeProfissional: profissionalFormModel.nomeProfissional,
            numeroConselho: profissionalFormModel.numeroConselho.toString(),
            idEstadoConselho: profissionalFormModel.idEstadoConselho,
            idMunicipioProfissional: profissionalFormModel.idMunicipioProfissional,
            idConselhoProfissional: profissionalFormModel.idConselhoProfissional
        } as Pedido;
        return this.processoService.atualizar(processoComProfissionalAtualizado);
    }

    selecionarMunicipio(m: Municipio): void {
        this.municipioProfissionalEdicao = m;
    }

    goToTop() {
        window.scrollTo(0, 0);
    }
}
