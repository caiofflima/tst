import { MotivoSolicitacaoEnum } from './../../models/motivo-solicitacao.enum';
import {Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from "@angular/core";
import {PedidoProcedimento} from "../../../../models/comum/pedido-procedimento";
import {BehaviorSubject, Subject, Observable} from "rxjs";
import {
    AscSelectComponentProcedimentosParams
} from "../../../asc-select/models/asc-select-component-procedimentos.params";
import {AbstractControl, FormGroupDirective, ValidatorFn, Validators} from "@angular/forms";
import {FormUtil} from "../../../../util/form-util";
import {TipoAcaoProcedimentoEngine} from "../../../asc-select/models/tipo-acao-procedimento-engine";
import {AscSelectAutorizacaoPreviaParams} from "../../../asc-select/models/asc-select-autorizacao-previa-params";
import {AscSelectEspecialidadeParam} from "../../../asc-select/models/asc-select-especialidade.param";
import {Procedimento} from "../../../../models/comum/procedimento";
import {distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {isNotUndefinedNullOrEmpty, isNotUndefinedOrNull, isUndefinedNullOrEmpty} from "../../../../constantes";
import {Beneficiario, Pedido} from "../../../../models/entidades";
import {
    PedidoProcedimentoFormModel,
    pedidoProcedimentoFormModelIsNotEmpty
} from "../../models/pedido-procedimento-form.model";
import {BundleUtil} from "../../../../../arquitetura/shared/util/bundle-util";
import {Especialidade} from "../../../../models/credenciados/especialidade";
import {PermissoesSituacaoProcesso} from "../../../../models/fluxo/permissoes-situacao-processo";
import {SituacaoPedidoProcedimento} from "../../../../models/dto/situacao-pedido-procedimento";
import {of} from "rxjs";
import {NumberUtil} from "../../../../util/number-util";
import {isTipoProcessoReembolsoById, TipoProcessoEnum} from "../../models/tipo-processo.enum";
import {Util} from "../../../../../arquitetura/shared/util/util";
import {AutorizacaoPreviaService, MessageService, ProcedimentoPedidoService, SituacaoPedidoProcedimentoService} from "../../../../services/services";
import {ProcedimentoService} from "app/shared/services/comum/procedimento.service";
import { HttpUtil } from 'app/shared/util/http-util';
import { SelectItem } from 'primeng/api';

const RESTRINGE = 'R';

@Directive()
export abstract class AscFormularioProcedimentoBase implements OnInit, OnDestroy, OnChanges {

    @Input()
    loading = false;

    form: any

    /**
     * mapa de idProcedimentos por quantidade possível.
     * Toma como base os procedimentos encontrados para a autorização prévia selecionada.
     * No mapa:
     * map.get(idPedido).get(idProcedimento): qtdAutorizada
     */
    private readonly mappedProcedimentos = new Map<number, Map<number, number>>();

    @Input() pedido: Pedido;
    @Input() limparForm = false;
    @Input() enableAllAction = true;
    @Input() isToShowButtons = true;
    @Input() isEditing = false;
    @Input() idBeneficario: number;
    @Input() idTipoProcesso: number;
    @Input() idMotivoSolicitacao: number;
    @Output() readonly adicionar$ = new EventEmitter<any>();
    @Output() readonly formValid = new EventEmitter<boolean>();
    @Output() readonly cancel$ = new EventEmitter<PedidoProcedimento>();
    @Output() readonly isEditing$ = new EventEmitter<boolean>();
    @Input() permissoes: PermissoesSituacaoProcesso;
    protected readonly beneficiario$ = new BehaviorSubject<Beneficiario>(null);
    protected readonly autorizacaoPreviaValidacaoObrigatorio = new Subject<boolean>();
    private _beneficiario: Beneficiario;

    dataAtendimentoForm: any;
    idAutorizacaoPreviaSiagsForm: any;
    resultDataAtendimento: number;

    readonly CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO = TipoAcaoProcedimentoEngine.CONSULTAR_PROCEDIMENTO_POR_TIPO_PROCESSO;

    @Input()
    parametroSelectProcedimento: AscSelectComponentProcedimentosParams;
    autorizacaoPreviaParams: AscSelectAutorizacaoPreviaParams = {};
    especialidadeParams: AscSelectEspecialidadeParam = null;
    autorizacaoPreviaObrigatorio = false;
    procedimento: Procedimento;
    private readonly procedimento$ = new BehaviorSubject<Procedimento>(null);
    isToShowForm = true;

    protected readonly unsubscribe$ = new Subject<void>();
    autorizacaoPrevia: Pedido;
    autorizacaoPreviaNaoWeb: Pedido;
    protected readonly autorizacaoPrevia$ = new BehaviorSubject<Pedido>(null);
    protected especialidade: Especialidade;
    protected readonly dependenciasCampos = new Map<string, AbstractControl[]>();
    valorDocumentoFiscal: number
    id: number
    erroValorDocumentoFiscal = false
    escolherCampoAutorizacaoPrevia = 0
    autorizacoesPrevia: SelectItem[]
    protected constructor(
        protected messageService: MessageService,
        protected readonly situacaoPedidoProcedimentoService?: SituacaoPedidoProcedimentoService,
        protected readonly procedimentoService?: ProcedimentoService,
        protected readonly autorizacaoPreviaService?: AutorizacaoPreviaService,
        protected readonly procedimentoPedidoService?: ProcedimentoPedidoService,
    ) {
        this.ouvirMudancaDocumentoFiscal()
    }

    ngOnChanges(changes: any): void {
        for (const propName in changes) {
            if (changes.hasOwnProperty(propName)) {
                let change : any = changes[propName];
                switch (propName) {
                    case 'idTipoProcesso':
                    case 'idMotivoSolicitacao':
                        this.reloadAutorizacaoPreviaConfig(change)
                        break;
                }
            }
        }
    }

    private reloadAutorizacaoPreviaConfig(change : any){
        if(this.getForm() && this.getForm().contains('idAutorizacaoPrevia')
            && change.previousValue != change.currentValue){
            this.preResetIdAutorizacaoPreviaControl();
            if(this.deveBloquearAutorizacaoPrevia()){
                this._tornarAutorizacaoPreviaObrigatoria();
                this.registrarValidacaoFormulario();
            }
            this.posResetIdAutorizacaoPreviaControl();
        }
    }

    @Input() set isToCleanForm(isToCleanForm: boolean) {
        if (isToCleanForm) {
            this.getForm().reset();
            FormUtil.markAsUntouchEachControl(this.getForm());
        }
    }

    @Input()
    set pedidoProcedimento(pedidoProcedimento: PedidoProcedimentoFormModel) {

        if(pedidoProcedimento && pedidoProcedimento.id) {
            this.id = pedidoProcedimento.id
        }

        if (pedidoProcedimento) {
            this.isEditing = pedidoProcedimento.index !== null && pedidoProcedimento.index !== undefined;
            this.atualizarFormulario(pedidoProcedimento);
        } else {
            this.isEditing = false;
        }

        if (pedidoProcedimento && this.isProcessoLazy(this.idTipoProcesso)) {
            if (pedidoProcedimento.procedimento) {
                this.parametroSelectProcedimento.texto = pedidoProcedimento.procedimento.descricaoProcedimento;
            } else if (pedidoProcedimento.pedidoProcedimento && pedidoProcedimento.pedidoProcedimento.procedimento) {
                this.parametroSelectProcedimento.texto = pedidoProcedimento.pedidoProcedimento.procedimento.descricaoProcedimento;
            }

            this.parametroSelectProcedimento = {...this.parametroSelectProcedimento};
        }
    }

    isProcessoLazy(tipo: number): boolean {
        return tipo == TipoProcessoEnum.REEMBOLSO_CONSULTA
            || tipo == TipoProcessoEnum.REEMBOLSO_ASSISTENCIAL
            || tipo == TipoProcessoEnum.REEMBOLSO_ODONTOLOGICO;
    }

    get beneficiario(): Beneficiario {
        return this._beneficiario;
    }

    @Input() set beneficiario(beneficiario: Beneficiario) {
        this._beneficiario = beneficiario;
        this.beneficiario$.next(beneficiario)
    }

    protected atualizarFormulario(pedidoProcedimento: PedidoProcedimentoFormModel) {
        if (pedidoProcedimentoFormModelIsNotEmpty(pedidoProcedimento) && pedidoProcedimento.dataAtendimento) {
            this.procedimento = pedidoProcedimento.procedimento;
            pedidoProcedimento.dataAtendimento = Util.getDate(pedidoProcedimento.dataAtendimento);
            if (pedidoProcedimento.valorUnitarioPago) {
                pedidoProcedimento.valorUnitarioPago = NumberUtil.convertStringToNumber(pedidoProcedimento.valorUnitarioPago);
            }

            const form = this.getForm();
            Object.keys(pedidoProcedimento).forEach(key => {
                let field = form.get(key);
                if (field) {
                    field.setValue(pedidoProcedimento[key]);
                    field.markAsTouched();
                    field.markAsDirty();
                    field.updateValueAndValidity();
                }
            });

            if (typeof (pedidoProcedimento.valorUnitarioPago) === 'number') {
                form.get("valorUnitarioPago").setValue(pedidoProcedimento.valorUnitarioPago.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }));
            }
        }
    }

    salvarFormularioExterno(): void {
        this.adicionarProcedimento(this.getForm(), null);
    }

    adicionarProcedimento(formDirective?: FormGroupDirective | any, event?: MouseEvent) {
        this.dataAtendimentoForm = formDirective.value.dataAtendimento;
        this.idAutorizacaoPreviaSiagsForm = formDirective.value.idAutorizacaoPreviaSiags;

        const resultado = this.carregarAutorizacoesComDataAtentimentoValida();
        this.handleResultadoDiferenteDeNull(resultado)

        if(formDirective.value.idProcedimento !== undefined && formDirective.value.idProcedimento !== null){
            this.handleFormPossuiIdProcedimento(formDirective,event)
        }else{
            //Inclusao do Procedimento
            this.handleInclusaoProcedimento(formDirective,event)
        }

    }

    handleInclusaoProcedimento(formDirective:any,event:any){
        const idAutorizacaoPrevia = this.idAutorizacaoPreviaControl;
            if (idAutorizacaoPrevia) {
                idAutorizacaoPrevia.markAsTouched()
                idAutorizacaoPrevia.markAsDirty()
                if (idAutorizacaoPrevia.errors && idAutorizacaoPrevia.errors["required"]) {
                    this.messageService.addMsgDanger(BundleUtil.fromBundle('MA131'));
                    return;
                }
            }

            let procedimentoAsForm = this.construirFormulario();

            // console.log('Adicionar procedimento');
            // console.log(procedimentoAsForm);

            if (procedimentoAsForm.valorUnitarioPago) {
                procedimentoAsForm.valorUnitarioPago = NumberUtil.convertStringToNumber(procedimentoAsForm.valorUnitarioPago);
            }

            this.loading = true;
            this.adicionar$.emit({...procedimentoAsForm, idTipoProcesso: this.idTipoProcesso});

            if (this.limparForm) {
                this.resetAllForm(formDirective, event);
                this.loading = false;
                this.isEditing = false;
                this.isToShowForm = true;
                this.isEditing = false;
            }
    }

    handleFormPossuiIdProcedimento(formDirective:any,event:any){
        this.procedimentoService.consultarProcedimentoPorId(formDirective.value.idProcedimento).subscribe(procedimento => {

            if(this.beneficiario == null || this.beneficiario == undefined)
            return

                const idade = this.calculaIdade(this.beneficiario.matricula.dataNascimento);
                if((this.beneficiario.matricula.sexo !== procedimento.sexo) && procedimento.sexo !=="A"){
                    this.messageService.addMsgDanger("Procedimento incompatível com o sexo do(a) beneficiário(a).");
                }else if(idade < procedimento.idadeMinima || idade > procedimento.idadeMaxima){
                    this.messageService.addMsgDanger("Procedimento incompatível com a idade do(a) beneficiário(a).");
                }else{
                    this.handleInclusaoProcedimento(formDirective,event)

                }


        }, error => {
            this.messageService.addMsgDanger(error.message);
        })

    }

    handleResultadoDiferenteDeNull(resultado:any){
        if(resultado !== null && resultado !== undefined) {
            resultado.subscribe(
                value => {
                    this.resultDataAtendimento = value;
                    if(this.resultDataAtendimento !== null && this.resultDataAtendimento !== undefined) {
                        this.messageService.addMsgDanger("Data de atendimento posterior à validade da autorização prévia selecionada.");
                    }
                });
        }
    }

    calculaIdade(strDataNascimento:string):number{
        const dataAtual:Date = new Date();
        const dataArray = strDataNascimento.split("-");

        const ano = parseInt(dataArray[0]);
        const mes = parseInt(dataArray[1])-1;
        const dia = parseInt(dataArray[2]);

        const dataNascimento:Date = new Date(ano, mes, dia);
        const diferencaEmMiliSegundos = dataAtual.getTime() - dataNascimento.getTime();
        const idadeEmAnos = diferencaEmMiliSegundos/(1000*60*60*24*365);

        return idadeEmAnos;
    }

    autorizacoesPreviasSelecionados(pedidos: Pedido[]) {
        this.escolherCampoAutorizacaoPrevia = 0
        const idAutorizacaoPrevia = this.idAutorizacaoPreviaControl;
        console.log('autorizacoesPreviasSelecionados',idAutorizacaoPrevia);

        const qtdQuantidadeControl = this.getForm().get('qtdSolicitada');
        if (qtdQuantidadeControl && isUndefinedNullOrEmpty(pedidos)) {
            qtdQuantidadeControl.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.minLength(1,),
                Validators.max(999),
                Validators.maxLength(3)
            ]);
        }
        if (idAutorizacaoPrevia) {
            if (isUndefinedNullOrEmpty(pedidos) && idAutorizacaoPrevia.errors && idAutorizacaoPrevia.errors["required"]) {
                //this.messageService.addMsgDanger(BundleUtil.fromBundle('MA131'));
            }

            if( isUndefinedNullOrEmpty(pedidos) ){
                this.escolherCampoAutorizacaoPrevia = 1
                this.buscarAutorizacaoPreviaNaoWeb()
            }
        }
    }

    private buscarAutorizacaoPreviaNaoWeb(){
        try{
            this.autorizacaoPreviaService
                .consultarPorIdBeneficiarioAndIdProcedimento(this.autorizacaoPreviaParams.idBeneficiario, this.autorizacaoPreviaParams.idProcedimento, true)
                .subscribe( (retorno: Pedido[]) => {
                    this.autorizacoesPrevia = retorno.map(r => ({
                                                                    value: r.idAutorizacaoPreviaSiags,
                                                                    label: `${r.idAutorizacaoPreviaSiags} | WEB - ${r.nomeMotivoSolicitacao}`
                                                                })
                                                            )
                } )
        }
        catch(e){}
    }

    get idAutorizacaoPreviaControl(): AbstractControl {
        return this.getForm().get('idAutorizacaoPrevia');
    }

    get idProcedimentoControl(): AbstractControl {
        return this.getForm().get('idProcedimento');
    }

    protected configurarControlIdAutorizacaoPrevia(procedimento: Procedimento) {
        this.preResetIdAutorizacaoPreviaControl();

        if (procedimento && (RESTRINGE === procedimento.providenciaNaFalta || procedimento.prazoIntervalar)) {
            if (RESTRINGE === this.procedimento.providenciaNaFalta) {
                this._tornarAutorizacaoPreviaObrigatoria();
            }

            this.autorizacaoPreviaParams.executaConsulta = true;
        }

        if(
            this.deveBloquearAutorizacaoPrevia()
        ){
            this._tornarAutorizacaoPreviaObrigatoria();
        }

        this.posResetIdAutorizacaoPreviaControl();
    }

    private preResetIdAutorizacaoPreviaControl(){
        this.idAutorizacaoPreviaControl.clearValidators();
        this.autorizacaoPreviaParams.executaConsulta = false;
        this.idAutorizacaoPreviaControl.disable();
        this.idAutorizacaoPreviaControl.clearValidators();
        this.autorizacaoPreviaObrigatorio = false;
    }

    private posResetIdAutorizacaoPreviaControl(){
        if(!this.autorizacaoPreviaObrigatorio){
            this.autorizacaoPreviaValidacaoObrigatorio.next(false);
        }

        this.idAutorizacaoPreviaControl.markAsTouched();
        this.idAutorizacaoPreviaControl.markAsDirty();
        this.idAutorizacaoPreviaControl.enable();
        this.idAutorizacaoPreviaControl.updateValueAndValidity();
    }

    private _tornarAutorizacaoPreviaObrigatoria(){
        this.idAutorizacaoPreviaControl.setValidators([Validators.required]);
        this.autorizacaoPreviaObrigatorio = true;
        this.autorizacaoPreviaValidacaoObrigatorio.next(true);
    }

    autorizacaoPreviaSelecionado(pedido: Pedido): void {
        this.autorizacaoPrevia$.next(pedido);
    }

    especialidadeSelecionado(especialidade: Especialidade) {
        this.especialidade = especialidade;
        const idAutorizacaoPrevia = this.idAutorizacaoPreviaControl;
        if (idAutorizacaoPrevia) {
            idAutorizacaoPrevia.setValue(null);
            FormUtil.markAsTouchedAndDirty(idAutorizacaoPrevia);
        }
    }

    protected deveBloquearAutorizacaoPrevia() : boolean{
       return (
            !this.autorizacaoPreviaObrigatorio
        )
        &&
        (
           isTipoProcessoReembolsoById(this.idTipoProcesso)
        )
        &&
        (
            this.idMotivoSolicitacao && this.idMotivoSolicitacao
                === MotivoSolicitacaoEnum.REEMBOLSO_INTEGRAL_PREVIAMENTE_AUTORIZADO
        );
    }

    @Input()
    set autorizacaoPreviaParam(autorizacaoPreviaParam: AscSelectAutorizacaoPreviaParams) {
        this.autorizacaoPreviaParams = autorizacaoPreviaParam
    }

    protected resetarForm(): void {
        FormUtil.limparTodosFormControls(this.getForm().controls, this.getForm())
        this.getForm().reset();
        this.loading = false;
        this.isEditing = false;
        this.isEditing$.emit(this.isEditing);
    }

    clickButtonCancelarProcedimento(formDirective?: FormGroupDirective | any, $event?: MouseEvent) {
        const procedimentoAsForm = this.getForm().getRawValue() as PedidoProcedimento;
        this.isEditing = false;
        this.isEditing$.emit(this.isEditing);
        this.cancel$.emit({...procedimentoAsForm})
        this.resetAllForm(formDirective, $event);
    }

    ngOnInit(): void {
        this.loading = true;
        this.registrarParametrosDosProcedimentos();
        this.registrarParametrosParaBuscaDePatologias();
        this.registrarValidadorQuantidadeComBaseNaAutorizacaoPrevia();
        this.registrarDependenciasPreenchimento();
        this.registrarConfiguracaoDosValidadoresDeAutorizacaoPrevia();
        this.registrarValidacaoFormulario();
    }

    protected registrarValidacaoFormulario(): void {
        this.getForm().valueChanges.subscribe(() => this.formValid.emit(!this.getForm().invalid));
        this.loading = false;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    protected registrarParametrosDosProcedimentos(): void {
        const idProcedimentoFormControl = this.getForm().get('idProcedimento');
        if (idProcedimentoFormControl) {
            idProcedimentoFormControl.valueChanges.pipe(
                distinctUntilChanged(),
                tap((idProcedimento: number) => this.parametrosComProcedimento(idProcedimento)),
                takeUntil(this.unsubscribe$)
            ).subscribe();
        }
    }

    private resetAllForm(formDirective: FormGroupDirective | any, $event: MouseEvent) {
        if (formDirective) {
            if (formDirective instanceof FormGroupDirective) {
                formDirective.resetForm();
            } else {
                formDirective.reset();
            }
        }

        this.resetarForm();
        if ($event) $event.preventDefault();
    }

    protected registrarParametrosParaBuscaDePatologias() {
        const idPatologiaControl = this.getForm().get('idPatologia')
        if (idPatologiaControl) {
            idPatologiaControl.valueChanges.pipe(
                distinctUntilChanged(),
                filter(isNotUndefinedNullOrEmpty),
                tap((idPatologia: number) => this.parametroComPatologia(idPatologia)),
                takeUntil(this.unsubscribe$)
            ).subscribe();
        }
    }

    protected parametrosComProcedimento(_idProcedimento: number) {
        // Usado apenas por classes filhas
    }

    protected parametroComPatologia(_idPatologia: number) {
        // Usado apenas por classes filhas
    }

    protected abstract getForm(): any;

    protected abstract construirFormulario(): PedidoProcedimento;

    procedimentoSelecionado(procedimento?: Procedimento): void {
        if (procedimento) {
            this.autorizacaoPreviaParams.idBeneficiario = this.idBeneficario;
            this.autorizacaoPreviaParams.idProcedimento = procedimento.id;
            this.escolherCampoAutorizacaoPrevia = 0
            try {
                this.autorizacaoPreviaService.setModificaAutorizacaoPrevia(this.autorizacaoPreviaParams)
            } catch (error) {}

        }

        this.procedimento = procedimento;
        //this.procedimento$.next(procedimento);

    }

    private registrarConfiguracaoDosValidadoresDeAutorizacaoPrevia() {
        this.procedimento$.pipe(
            filter(isNotUndefinedOrNull),
            tap((procedimento: Procedimento) => this.configurarControlIdAutorizacaoPrevia(procedimento)),
            tap((procedimento: Procedimento) => this.registrarValidacaoFormulario()),
            takeUntil(this.unsubscribe$)
        ).subscribe();

    }

    private registrarValidadorQuantidadeComBaseNaAutorizacaoPrevia(): void {
        this.autorizacaoPrevia$.pipe(
            filter(isNotUndefinedNullOrEmpty),
            tap((autorizacaoPrevia: Pedido) => this.autorizacaoPrevia = autorizacaoPrevia),
            switchMap((ap: Pedido) => {
                    let res;
                    if (this.mappedProcedimentos.get(ap.id)) {
                        res = of(this.mappedProcedimentos.get(ap.id).get(this.idProcedimentoControl.value));
                    } else {
                        res = this.situacaoPedidoProcedimentoService.consultarPedidosProcedimentosAnalisadosPorIdPedido(ap.id).pipe(
                            tap((spps: SituacaoPedidoProcedimento[]) => this.configurarValidacoesQtdProcedimentos(ap.id, spps)),
                            map(() => this.mappedProcedimentos.get(ap.id).get(this.idProcedimentoControl.value))
                        );
                    }
                    return res;
                }
            ),
            map((totalQtdSolicitada: number) => [
                Validators.required,
                Validators.minLength(1),
                Validators.min(1),
                Validators.maxLength(3),
                ...(totalQtdSolicitada !== undefined ? [Validators.max(totalQtdSolicitada)] : []),
            ]),
            takeUntil(this.unsubscribe$),
            tap((validadores: ValidatorFn[]) => this.getForm().get('qtdSolicitada').setValidators(validadores)),
            tap((validadores: ValidatorFn[]) =>  this.registrarValidacaoFormulario() )
        ).subscribe()
    }

    protected registrarDependenciasPreenchimento(): void {
        // Usado apenas por classes filhas
    }

    mostrarCampo(formId: string): boolean {
        let flg = true;
        const controls = this.dependenciasCampos.get(formId);
        if (controls) {
            for (let c of controls) {
                if (!c.disabled) {
                    flg = c.dirty;
                }
            }
        }
        return flg;
    }

    private configurarValidacoesQtdProcedimentos(idPedido: number, res: SituacaoPedidoProcedimento[]) {
        if (!this.mappedProcedimentos.get(idPedido)) {
            this.mappedProcedimentos.set(idPedido, new Map<number, number>());
            res.forEach(sPedProc => this.mappedProcedimentos.get(idPedido).set(sPedProc.idProcedimento, sPedProc.qtdAutorizada));
        }
    }

    private carregarAutorizacoesComDataAtentimentoValida(): any {
        if(this.idAutorizacaoPreviaSiagsForm !== null &&
            this.idAutorizacaoPreviaSiagsForm !== undefined) {

            return this.autorizacaoPreviaService.verificarAutorizacoesComDataAtentimentoValida(this.idAutorizacaoPreviaSiagsForm,
                this.formatarData(this.dataAtendimentoForm)).pipe(
                HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error'),
                tap(() => console.log(' carregarAutorizacoesComDataAtentimentoValida '))
            );
        }
    }

    private formatarData(data:Date):string{
        let dataFormatada = '';

        if(data) {
          const dia = ('0' + data.getUTCDate()).slice(-2);
          const mes = ('0' + (data.getUTCMonth() + 1)).slice(-2);
          const ano = data.getUTCFullYear();

          dataFormatada = `${ano}-${mes}-${dia}`;
        }
        return  dataFormatada;
    }

    ouvirMudancaDocumentoFiscal(){
        this.procedimentoPedidoService.pedidoListenerValorNotaFiscal
         .subscribe((resp) => {
            this.valorDocumentoFiscal = Number( resp.valor )

            this.errorDocumentoFiscal('ouvirMudancaDocumentoFiscal')
            this.getForm().get('valorUnitarioPago').markAsDirty()

         })
    }

    errorDocumentoFiscal(origem = ''){
        const rotaAtual = this.procedimentoPedidoService.obterRotaAtual().split('/')
        let retorno = false
        if( rotaAtual[ rotaAtual.length -1] !== 'analise')
        return

            const valorUnitarioPago = this.conveterterParaNumero( this.getForm().get('valorUnitarioPago').value ) || 0
            const itens: any = JSON.parse(
                                    JSON.stringify( this.procedimentoPedidoService.getPedidoProcedimentoTabela() )
                                ).map(j => (
                                    {
                                        ...j, qtdSolicitada:
                                        j.qtdSolicitada ? j.qtdSolicitada : j.qtdMedicamento
                                    })
                                )
            if(this.getForm().get('qtdSolicitada') && (this.getForm().get('qtdSolicitada').dirty || this.getForm().get('valorUnitarioPago').dirty)){
                this.handleDirtyInputs(itens,valorUnitarioPago,retorno)


            }
            else if(!this.getForm().get('qtdSolicitada') && this.getForm().get('valorUnitarioPago').dirty){
                retorno = false
                if(valorUnitarioPago > this.valorDocumentoFiscal){
                    retorno = true
                }
            }
            else{
                retorno = false
                const valorTotal = itens.map(i => {
                                            const calc = Number(i.valorUnitarioPago) * i.qtdSolicitada
                                            return calc
                                        })
                                        .reduce((curr, val) => curr + val, 0)

                if( valorTotal > this.valorDocumentoFiscal){
                    retorno = true
                }
            }

          this.handleRetornoTruthfuL(retorno)

            this.erroValorDocumentoFiscal = retorno

    }

    handleRetornoTruthfuL(retorno:any){
        if(retorno){
            this.getForm().get('valorUnitarioPago').setErrors({incorret: true})
        }else{
            this.getForm().get('valorUnitarioPago').setErrors(null)
        }
    }
handleDirtyInputs(itens:any,valorUnitarioPago:any,retorno:any){
      if( !this.id ){
                    const index = itens.findIndex(item => item.id === 0);
                    const obj = {
                        id: 0,
                        valorUnitarioPago,
                        qtdSolicitada: Number( this.getForm().get('qtdSolicitada').value )
                    }
                    if( index == -1 ){
                        itens.push(obj)
                    }else{
                        itens[index] = obj
                    }
                }
                const valorTotal = itens
                                        .map(i => {
                                            let calc = 0
                                            if( this.id === i.id ){
                                                calc = valorUnitarioPago * Number(this.getForm().get('qtdSolicitada').value)
                                            }else{
                                                calc = Number(i.valorUnitarioPago) * i.qtdSolicitada
                                            }
                                            return calc
                                        })
                                        .reduce((curr, val) => curr + val, 0)

                if( valorTotal > this.valorDocumentoFiscal) {
                    retorno = true
                }
                else {
                    retorno = false
                }
}
    conveterterParaNumero(value: string){
        return NumberUtil.convertStringToNumber(value)
    }

    validarCamposQtdeValorUnitarioPago(){
        if( this.getForm().get('qtdSolicitada') ){
            this.getForm().get('qtdSolicitada').valueChanges.subscribe(val => {
                this.errorDocumentoFiscal('campo QtdeSolicitada')
            })
        }
        this.getForm().get('valorUnitarioPago').valueChanges.subscribe(val => {
            this.errorDocumentoFiscal('campo valorUnitarioPago')
        })
        this.errorDocumentoFiscal('campo valorUnitarioPago')
    }

    autorizacaoPreviaNaoWebSelecionada(event: any){
        const pedido = new Pedido()
        pedido.id = event
        pedido.idAutorizacaoPreviaSiags = event
        const autorizacaoNaoWeb = this.autorizacoesPrevia.find(a => a.value == event)
        pedido.nomeMotivoSolicitacao = autorizacaoNaoWeb.label
        this.autorizacaoPrevia = pedido
        this.form.controls['tipoAutorizacao'].setValue( autorizacaoNaoWeb.label )
    }
}
