import {Component, Input, OnDestroy, OnInit, EventEmitter, Output} from '@angular/core';
import {fadeAnimation} from "app/shared/animations/faded.animation";
import {PedidoProcedimento} from "../../models/comum/pedido-procedimento";
import {Pedido} from "../../models/comum/pedido";
import {PedidoProcedimentoFormModel} from "../../components/asc-pedido/models/pedido-procedimento-form.model";
import {Procedimento} from "../../models/comum/procedimento";
import {GrauProcedimento} from "../../models/comum/grau-procedimento";
import {isNotUndefinedNullOrEmpty} from "../../constantes";
import {ProcedimentoPedidoService} from "../../services/comum/procedimento-pedido.service";
import {Subject} from "rxjs";
import {catchError, debounceTime, map, switchMap, takeUntil, tap} from "rxjs/operators";
import {MessageService, SituacaoPedidoProcedimentoService} from "../../services/services";
import {CustomOperatorsRxUtil} from "../../util/custom-operators-rx-util";
import {HttpUtil} from "../../util/http-util";
import {PermissoesSituacaoProcesso} from "../../models/fluxo/permissoes-situacao-processo";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SituacaoPedidoProcedimento} from "../../models/dto/situacao-pedido-procedimento";
import {of} from "rxjs";
import {Util} from "../../../arquitetura/shared/util/util";
import {BundleUtil} from "../../../arquitetura/shared/util/bundle-util";
import {AscValidators} from "../../validators/asc-validators";
import {StatusProcessoEnum} from "../../enums/status-processo.enum";
import {TipoProcessoEnum} from "../../components/asc-pedido/models/tipo-processo.enum";
import {somenteNumeros} from "app/shared/constantes";
import {MotivoNegacao} from "app/shared/models/comum/motivo-negacao";

@Component({
    selector: 'asc-procedimento-pedido-card-pl',
    templateUrl: './procedimento-pedido-card-pl.component.html',
    styleUrls: ['./procedimento-pedido-card-pl.component.scss'],
    animations: [...fadeAnimation]
})
export class ProcedimentoPedidoCardPlComponent implements OnInit, OnDestroy {

    
    @Input() processo: Pedido;
    @Input() permissoes: PermissoesSituacaoProcesso;
    @Output() readonly motivoNegacaoSelecionado = new EventEmitter<MotivoNegacao>();

    private _pedidoAux = new Pedido();
    pedidoProcedimentoForm: PedidoProcedimentoFormModel;
    isEdicao: boolean = false;
    private _pedidosProcedimentos: PedidoProcedimento[];
    showProcedimento = true;
    isEditingProcedimento: boolean;
    quantidadeProcedimentoInput: any;
    pedidoProcedimentoAtual:any;
    isHabilitaDisabilita = "";
    motivoNegacaoCombo: MotivoNegacao;
    isEditarRemover = false;
    titular: any;

    qtdAutorizada: number | null = null;
    motivoNegacao: MotivoNegacao | null = null;

    private procedimentoEditado = null;
    private readonly pedidoProcedimentos$ = new Subject<PedidoProcedimento>();
    private readonly removerProcedimento$ = new Subject<PedidoProcedimento>();
    private readonly adicionarValidacaoProcedimento$ = new Subject<SituacaoPedidoProcedimento>();
    private readonly unsubscribe$ = new Subject<void>();
    private formsValidacao = {} as any;

    loading = false;

    constructor(
        private readonly _fb: FormBuilder,
        private readonly procedimentoPedidoService: ProcedimentoPedidoService,
        private readonly validacaoProcedimentoService: SituacaoPedidoProcedimentoService,
        private readonly messageService: MessageService
    ) {
    }

    ngOnInit() { 
        this.registrarInclusaoPedidoProcedimento();
        this.registrarInclusaoAnalisePedidoProcedimento();
        this.registrarRemovePedidoProcedimento();
    }

    toggle() {
        this.isEdicao = !this.isEdicao;
    }

    goToTop() {
        window.scrollTo(0, 0);
    }

    @Input()
    set pedidosProcedimentos(pedidosProcedimentos: PedidoProcedimento[]) {
        this._pedidosProcedimentos = pedidosProcedimentos;
        if (this._pedidosProcedimentos)
            for (let pp of this._pedidosProcedimentos) {
                this.inicializarFormularioAnalisePedidoProcedimento(pp);
            }
    }

    get pedidosProcedimentos() {
        return this._pedidosProcedimentos;
    }

    get isPermiteAdicionarProcedimento(): boolean {
        if (!this.processo.ultimaSituacao) {
            return false;
        }

        return this.processo.idTipoProcesso !== TipoProcessoEnum.REEMBOLSO_CONSULTA
            && this.processo.ultimaSituacao.idSituacaoProcesso !== StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR
            && StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.CANCELADO_PELO_TITULAR !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.PROCESSO_ENCERRADO !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.AUTORIZ_PREVIA_NEGADA !== this.processo.ultimaSituacao.idSituacaoProcesso;
    }

    get isPermiteEditarProcedimento(): boolean {
        if (!this.processo.ultimaSituacao) {
            return false;
        }

        return this.processo.ultimaSituacao.idSituacaoProcesso !== StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR
            && StatusProcessoEnum.AGUARD_DOC_COMPLEMENTAR !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.CADASTRADO_SISTEMA_SAUDE !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.CANCELADO_PELO_TITULAR !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.PROCESSO_ENCERRADO !== this.processo.ultimaSituacao.idSituacaoProcesso
            && StatusProcessoEnum.AUTORIZ_PREVIA_NEGADA !== this.processo.ultimaSituacao.idSituacaoProcesso;
    }

    exibirFormularioProcedimento(_: any) {
        this.pedidoProcedimentoForm = {
            id: null,
            idProcedimento: null,
            idGrauProcedimento: null,
            qtdSolicitada: null,
            qtdAutorizada: null,
            motivoNegacao: null,
            tsOperacao: new Date(),
            index: null,
        };
        this.showProcedimento = false;
    }

    procedimentoSelecionado(procedimento: Procedimento) {
        if (procedimento) {
            const indexProcedimento = this._pedidosProcedimentos.findIndex(proc => proc.idProcedimento === procedimento.id);
            if (indexProcedimento > -1) {
                this._pedidosProcedimentos[indexProcedimento].procedimento = procedimento;
            }
        }
    }

    grauSelecionado(grauProcedimento: GrauProcedimento) {
        if (grauProcedimento) {
            const index = this._pedidosProcedimentos.findIndex(proc => proc.idGrauProcedimento === grauProcedimento.id);
            if (index > -1) {
                this._pedidosProcedimentos[index].grauProcedimento = grauProcedimento;
            }
        }
    }

    adicionarNovoProcedimento(pedidoProcedimentoForm: PedidoProcedimento): void {
        if (!pedidoProcedimentoForm) {
            console.warn('Nenhum pedidoProcedimentoForm fornecido.');
            return;
        }
        
        // Verifica se o PedidoProcedimento já existe (edição) ou é um novo (adição)
        const isEditando = !!pedidoProcedimentoForm.id;
        
        // Extrair os valores de qtdAutorizada e motivoNegacao do PedidoProcedimento
        const qtdAutorizada = (pedidoProcedimentoForm as any).qtdAutorizada;
        const motivoNegacao = (pedidoProcedimentoForm as any).motivoNegacao;
    
        // Remover qtdAutorizada e motivoNegacao antes de salvar o PedidoProcedimento
        delete (pedidoProcedimentoForm as any).qtdAutorizada;
        delete (pedidoProcedimentoForm as any).motivoNegacao;
    
        // Cria o PedidoProcedimento a partir do formulário
        const pedidoProcedimento: PedidoProcedimento = {
            ...pedidoProcedimentoForm,
            idPedido: this.processo.id, // Vincula ao processo atual
        };
        
        // Salvar ou atualizar o PedidoProcedimento no backend
        this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento(pedidoProcedimento).pipe(
            tap((pedidoProcedimentoSalvo: PedidoProcedimento) => {
    
                if (isEditando) {
                    // Atualizar o PedidoProcedimento existente na lista
                    const index = this._pedidosProcedimentos.findIndex(pp => pp.id === pedidoProcedimentoSalvo.id);
                    if (index !== -1) {
                        this._pedidosProcedimentos[index] = pedidoProcedimentoSalvo;
                    }
                } else {
                    // Adicionar o novo PedidoProcedimento à lista
                    this._pedidosProcedimentos.push(pedidoProcedimentoSalvo);
                }
    
                // Caso não tenha qtdAutorizada, fecha o formulário
                if (!qtdAutorizada) {
                    console.log('Nenhuma validação necessária. Fechando formulário...');
                    this.fecharFormulario();
                } else {
                    // Caso tenha qtdAutorizada, processar a validação associada
                    this.processarValidacao({
                        procedimento: pedidoProcedimentoSalvo, // Envia o PedidoProcedimento salvo e completo
                        qtdAutorizada, // Envia a quantidade autorizada
                        motivoNegacao, // Envia o motivo de negação
                    });
                }
            }),
            catchError((err: any) => {
                console.error('Erro ao salvar ou atualizar o PedidoProcedimento:', err);
                this.messageService.addMsgDanger('Erro ao salvar ou atualizar o PedidoProcedimento.');
                return of(null);
            })
        ).subscribe();
    }

    processarValidacao({ procedimento, qtdAutorizada, motivoNegacao }: { procedimento: PedidoProcedimento, qtdAutorizada: number | null, motivoNegacao: MotivoNegacao | null }): void {
        if (!procedimento || !procedimento.id) {
            console.warn('PedidoProcedimento inválido ou não salvo.');
            return;
        }
        
        // Criar o objeto de validação
        const validacao: SituacaoPedidoProcedimento = {
            id: procedimento.ultimaValidacao ? procedimento.ultimaValidacao.id : undefined, // Usa o ID da validação existente, se houver
            idPedidoProcedimento: procedimento.id, // ID do PedidoProcedimento salvo
            idProcedimento: procedimento.idProcedimento,
            idGrau: procedimento.idGrauProcedimento,
            qtdAutorizada: qtdAutorizada || 0, // Garante que qtdAutorizada não seja null
            idMotivoNegacao: motivoNegacao ? motivoNegacao.id : null,
            motivoNegacao,
        };
    
        // Enviar a validação para o backend
        this.validacaoProcedimentoService.post(validacao).pipe(
            tap((validacaoSalva: SituacaoPedidoProcedimento) => {
              // Atualiza a última validação do PedidoProcedimento
              procedimento.ultimaValidacao = validacaoSalva;
              // Atualiza a lista de procedimentos no frontend
              this._pedidosProcedimentos = [...this._pedidosProcedimentos];
              // Fecha o formulário e limpa os valores
              this.fecharFormulario();
              this.messageService.addMsgSuccess("Validação realizada com sucesso!");
            }),
            catchError((err: any) => {

              this.procedimentoPedidoService.consultarPedidosProcedimentoPorPedido(this.processo.id).subscribe(pedidosProcedimentos => {
                this._pedidosProcedimentos = pedidosProcedimentos;
                this.fecharFormulario();
                this.messageService.addMsgSuccess("Validação realizada com sucesso!");
              });
              return of(null);
            })
          ).subscribe();
    }

    private hasIndexOnTheForm(): boolean {
        return isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm) && isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm.index);
    }


    cancelarAdicaoProcedimento(_: any) {
        this.showProcedimento = true;
        this.procedimentoEditado = null;
    }

    isEditingProcedimentoForm(isEditingProcedimentoForm: boolean) {
        this.isEditingProcedimento = isEditingProcedimentoForm;
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

    private registrarInclusaoPedidoProcedimento() {
        this.pedidoProcedimentos$.pipe(
            CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
            tap(() => this.loading = true),
            switchMap((pedidoProcedimento: PedidoProcedimento) => this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento({
                ...pedidoProcedimento,
                idPedido: this.processo.id
            })),
            switchMap(() => this.procedimentoPedidoService.consultarPedidosProcedimentoPorPedido(this.processo.id)),
            tap((pedidosProcedimentos: PedidoProcedimento[]) => {
                this._pedidosProcedimentos = pedidosProcedimentos;
    
            }),            HttpUtil.catchError(this.messageService, () => this.loading = false),
            tap(() => this.loading = false),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    removerProcedimento(pedidoProcedimento: PedidoProcedimento) {
        this.removerProcedimento$.next(pedidoProcedimento)
    }

    private registrarRemovePedidoProcedimento() {
        this.removerProcedimento$.pipe(
            debounceTime(200),
            CustomOperatorsRxUtil.filterNotEmptyAndDistinctUntilChanged(),
            tap(() => this.loading = true),
            map((pedidosProcedimentos: PedidoProcedimento) => Number(pedidosProcedimentos.id)),
            switchMap((idPedidoProcedimento: number) => this.procedimentoPedidoService.excluirPorId(idPedidoProcedimento)),
            switchMap(() => this.procedimentoPedidoService.consultarPedidosProcedimentoPorPedido(this.processo.id)),
            tap((pedidosProcedimentos: PedidoProcedimento[]) => this._pedidosProcedimentos = pedidosProcedimentos),
            tap(() => this.loading = false),
            takeUntil(this.unsubscribe$)
        ).subscribe()
    }

    analisar(pedidoProcedimento: PedidoProcedimento) {
        this.isHabilitaDisabilita = "";
        this.pedidoProcedimentoAtual = null;
        this.inicializarFormularioAnalisePedidoProcedimento(pedidoProcedimento);
        pedidoProcedimento.emAnalise = !pedidoProcedimento.emAnalise;
        if(pedidoProcedimento && pedidoProcedimento.ultimaValidacao && pedidoProcedimento.ultimaValidacao.qtdAutorizada){
            this.quantidadeProcedimentoInput = this.getControlQtdAutorizada(pedidoProcedimento);
            this.quantidadeProcedimentoInput.setValue(pedidoProcedimento.ultimaValidacao.qtdAutorizada);
            this.pedidoProcedimentoAtual = pedidoProcedimento;

            if(parseInt(this.quantidadeProcedimentoInput.value, 10) === parseInt(this.pedidoProcedimentoAtual.qtdSolicitada, 10)){
                this.isHabilitaDisabilita = "disabled";
            }

            this.getControlMotivoNegacao(pedidoProcedimento).setValue(pedidoProcedimento.ultimaValidacao.idMotivoNegacao);
        }        
    }

    motivoNegacaoSelecionadoEmissor(motivoNegacaoSelecionado: any) {
        if(motivoNegacaoSelecionado && motivoNegacaoSelecionado.obj){
            this.motivoNegacaoCombo = motivoNegacaoSelecionado.obj;
            this.motivoNegacaoSelecionado.emit(motivoNegacaoSelecionado);
        }
    }

    private inicializarFormularioAnalisePedidoProcedimento(pp: PedidoProcedimento) {
        if (!this.formsValidacao[pp.id]) {
            this.formsValidacao[pp.id] = {};
            this.formsValidacao[pp.id]["form"] = this.getFormAnaliseProcedimentoPedido(pp);
        }
    }

    private getFormAnaliseProcedimentoPedido(pp?: PedidoProcedimento): FormGroup {
        let formGroup = this._fb.group({
            qtdAutorizada: this._fb.control("", [Validators.required, Validators.max(pp.qtdSolicitada), AscValidators.inteiroPositivo]),
            idMotivoNegacao: this._fb.control(""),
            idPedidoProcedimento: this._fb.control(pp ? pp.id : null, Validators.required),
        });
        formGroup.get("qtdAutorizada").valueChanges.subscribe(qtd => {
            if (pp) {
                let idMotivoNegacao = formGroup.get("idMotivoNegacao");
                if (Util.isInteiroPositivo(qtd)) {
                    if (Number(qtd) < pp.qtdSolicitada) {
                        idMotivoNegacao.setValidators(Validators.required);
                        idMotivoNegacao.enable();
                    } else {
                        idMotivoNegacao.setValidators([]);
                    }
                } else {
                    idMotivoNegacao.reset();
                    idMotivoNegacao.disable();
                }
                idMotivoNegacao.updateValueAndValidity();
            }
        });
        return formGroup;
    }

    editarProcedimento(pedidoProcedimento: PedidoProcedimento): void {
        this.pedidoProcedimentoForm = {
            id: pedidoProcedimento.id,
            idProcedimento: pedidoProcedimento.procedimento.id,
            idGrauProcedimento: pedidoProcedimento.grauProcedimento ? pedidoProcedimento.grauProcedimento.id : null,
            qtdSolicitada: pedidoProcedimento.qtdSolicitada,
            qtdAutorizada: (pedidoProcedimento.ultimaValidacao && pedidoProcedimento.ultimaValidacao.qtdAutorizada !== undefined && pedidoProcedimento.ultimaValidacao.qtdAutorizada !== null)
                ? pedidoProcedimento.ultimaValidacao.qtdAutorizada
                : null,
            motivoNegacao: (pedidoProcedimento.ultimaValidacao && pedidoProcedimento.ultimaValidacao.motivoNegacao)
                ? pedidoProcedimento.ultimaValidacao.motivoNegacao.id
                : null,
            tsOperacao: new Date(),
            index: this._pedidosProcedimentos.indexOf(pedidoProcedimento),
        };
    
        this.procedimentoEditado = pedidoProcedimento; // Procedimento em edição
        this.showProcedimento = false; // Mostra o formulário
        this.isEdicao = true; // Indica modo de edição
    }

    enviarAnalise(pedidoProcedimento: PedidoProcedimento) {
        let formValidacao = this.formsValidacao[pedidoProcedimento.id].form as FormGroup;

        if (formValidacao.valid) {
            this.adicionarValidacaoProcedimento$.next(formValidacao.value);
        }
    }

    getControlMotivoNegacao(pedidoProcedimento: PedidoProcedimento): FormControl {
        if (pedidoProcedimento) {
            return this.formsValidacao[pedidoProcedimento.id].form.get("idMotivoNegacao")
        }
        return new FormControl();
    }

    ativarDesativarMotivo(e: any, pedidoProcedimento: PedidoProcedimento){
        let  qtdAutorizado = e.target.value.replace(/[^0-9]/g,'');
        if(parseInt(qtdAutorizado, 10) === pedidoProcedimento.qtdSolicitada){
            this.isHabilitaDisabilita = "disabled";
        }else{
            this.isHabilitaDisabilita = "";
        }  
    }

    getControlQtdAutorizada(pedidoProcedimento: PedidoProcedimento): FormControl {
        if (pedidoProcedimento) {
            return this.formsValidacao[pedidoProcedimento.id].form.get("qtdAutorizada")
        }
        return new FormControl();
    }

    private registrarInclusaoAnalisePedidoProcedimento() {
        this.adicionarValidacaoProcedimento$.pipe(
            switchMap((validacao: SituacaoPedidoProcedimento) => this.validacaoProcedimentoService.post(validacao)
            .pipe(
                tap((validacao: SituacaoPedidoProcedimento) => this.concluirAnalisePedidoProcedimento(validacao))
            )),
            catchError((err: any) => {
                console.error(err);
                return of({});
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    private fecharFormulario(): void {
        this.showProcedimento = true; // Fecha o formulário
        this.qtdAutorizada = null; // Limpa o valor de qtdAutorizada
        this.motivoNegacao = null; // Limpa o valor de motivoNegacao
    }

    cancelarAnalise(pp: PedidoProcedimento) {
        this.formsValidacao[pp.id].form.reset();
        pp.emAnalise = false;
    }

    podeEnviarAnalise(pedidoProcedimento: PedidoProcedimento) {
        return this.formsValidacao[pedidoProcedimento.id].form.valid;
    }

    bundle(msg?: string, args?: any): string {
        return BundleUtil.fromBundle(msg, args);
    }

    private concluirAnalisePedidoProcedimento(validacao: SituacaoPedidoProcedimento) {
        let pedidoProcedimento = this._pedidosProcedimentos.find(pp => pp.id === validacao.idPedidoProcedimento);
        if((validacao.motivoNegacao.id === null || validacao.motivoNegacao.id === undefined) && this.isHabilitaDisabilita === "" ){
            validacao.motivoNegacao = this.motivoNegacaoCombo;
        }else if(this.isHabilitaDisabilita !== ""){
            validacao.motivoNegacao = null;
            validacao.idMotivoNegacao = null;
        }
        pedidoProcedimento.ultimaValidacao = validacao;
        pedidoProcedimento.emAnalise = false;
        //this.formsValidacao[validacao.idPedidoProcedimento].form.reset();
        //this.formsValidacao[validacao.idPedidoProcedimento].form.updateValueAndValidity();
        this.messageService.addMsgSuccess("MA095");
    }
}
