import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {SolicitacaoFormModel} from '../models/solicitacao-form.model';
import {FinalidadeFormModel} from '../models/finalidade-form-model';
import {PedidoProcedimento} from '../../../../shared/models/comum/pedido-procedimento';
import {ProfissionalFormModel} from '../models/profissional-form.model';
import {Beneficiario} from '../../../../shared/models/comum/beneficiario';
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {TipoProcesso} from '../../../../shared/models/comum/tipo-processo';
import {MotivoSolicitacao} from '../../../../shared/models/comum/motivo-solicitacao';
import {DadoComboDTO} from '../../../../shared/models/dto/dado-combo';
import {Municipio} from '../../../../shared/models/comum/municipio';
import {AutorizacaoPreviaService} from '../../../../shared/services/comum/pedido/autorizacao-previa.service';
import {Pedido} from '../../../../shared/models/comum/pedido';
import {
    aplicarAcaoQuandoFormularioValido,
    cpfCnpjUtil,
    cpfUtil,
    isNotUndefinedNullOrEmpty,
    isUndefinedNullOrEmpty,
} from '../../../../shared/constantes';
import {Router} from '@angular/router';
import {catchError, distinctUntilChanged, filter, switchMap, takeUntil} from 'rxjs/operators';
import {FileUploadService} from '../../../../shared/services/comum/file-upload.service';
import {MessageService} from '../../../../shared/components/messages/message.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, of, forkJoin} from 'rxjs';
import {ObjectUtils} from '../../../../shared/util/object-utils';
import {GrauProcedimento} from '../../../../shared/models/comum/grau-procedimento';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {AscValidators} from '../../../../shared/validators/asc-validators';
import {Procedimento} from "../../../../shared/models/entidades";
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {
    PedidoProcedimentoFormModel
} from "../../../../shared/components/asc-pedido/models/pedido-procedimento-form.model";
import {Arquivo} from "../../../../shared/models/dto/arquivo";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";
import {ArrayUtil} from "../../../../shared/util/array-util";
import {AscStepperComponent} from "../../../../shared/components/asc-stepper/asc-stepper/asc-stepper.component";
import { ProcedimentoPedidoService, SituacaoPedidoProcedimentoService } from 'app/shared/services/services';
import { DscDialogService } from 'sidsc-components/dsc-dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.scss'],
    animations: [...fadeAnimation]
})
export class ResumoComponent implements OnInit, OnDestroy {
    @Input()
    stepper: AscStepperComponent

    @Input()
    solicitacao?: SolicitacaoFormModel;

    @Input()
    finalidade?: FinalidadeFormModel;

    @Input()
    procedimentos?: PedidoProcedimento[] = [];

    @Input()
    profissional?: ProfissionalFormModel;

    @Input()
    beneficiario?: Beneficiario;

    @Input()
    tipoProcesso: TipoProcesso;

    @Input()
    motivoSolicitacao: MotivoSolicitacao;

    @Input()
    ufEstadoConselho: DadoComboDTO;

    @Input()
    municipioProfissional: Municipio;

    @Input()
    grauProcedimento: GrauProcedimento;

    @Input()
    conselho: DadoComboDTO;

    @Output()
    reiniciarEvent: EventEmitter<void> = new EventEmitter<void>();

    municipioProfissionalEdicao: Municipio;
    ufEstadoConselhoEdicao: DadoComboDTO;
    conselhoEdicao: DadoComboDTO;

    documentosCadastrados: DocumentoTipoProcesso[];
    addProcedimento = false;
    showProgress = false;
    pedidoCadastrado: Pedido;
    pedidoProcedimentoForm: PedidoProcedimentoFormModel;
    exibirFormularioProfissionalExecutante = false;
    documentoSelecionadoControl = new FormControl();
    documentoNaoPossuiArquivos: boolean = true;
    procedimentoEditado: PedidoProcedimento;
    informacoesAdicionais: string;

    @ViewChild('modalReiniciarTemplate', { static: true })
    private modalReiniciarTemplate!: TemplateRef<any>;
    private dialogReiniciarRef?: MatDialogRef<any>;
    isIndisponibilidadeRedeCredenciada: boolean = false;
    pedidoProcedimento: PedidoProcedimento

    readonly profissionalExecutanteForm: any = this.formBuilder.group({
        idConselhoProfissional: [null, [Validators.required]],
        numeroConselho: [null, [Validators.required]],
        idEstadoConselho: [null, [Validators.required]],
        cpfCnpj: [null, [Validators.required, AscValidators.cpfOuCnpj()]],
        nomeProfissional: [null, [Validators.required]],
        idEstadoProfissional: [null, [Validators.required]],
        idMunicipioProfissional: [null, [Validators.required]],
    });


    private readonly subjecUnsubscribe = new Subject();
    private _arquivos: any | Set<Arquivo> | Arquivo[];
    private indexSelecionado = 0;
    isEditingProcedimento: boolean;
    listaIdsRede = [40, 73, 74, 78];

    constructor(
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly fileUploadService: FileUploadService,
        private readonly route: Router,
        private readonly messageService: MessageService,
        private readonly formBuilder: FormBuilder,
        private readonly pedidoProcedimentoService: ProcedimentoPedidoService,
        private readonly dialogService: DscDialogService
    ) {
    }

    ngOnInit() {
        this.gerenciarIndexSelecionado();
        this.gerenciarAlteracaoDoMunicipioDoProfissionalExecutante();
        this.indisponibilidadeRedeCredenciada();
    }

    private indisponibilidadeRedeCredenciada():boolean{

        if(this.finalidade && this.finalidade.idMotivoSolicitacao){
            if(this.listaIdsRede.find(item=>item===this.finalidade.idMotivoSolicitacao)){
                this.isIndisponibilidadeRedeCredenciada = true;
            }  
        }

        return this.isIndisponibilidadeRedeCredenciada;
    }

    private gerenciarAlteracaoDoMunicipioDoProfissionalExecutante() {
        this.profissionalExecutanteForm.get('idEstadoProfissional').valueChanges.pipe(
            takeUntil(this.subjecUnsubscribe)
        ).subscribe((value) => {
            if (value !== this.municipioProfissional.estado.id) {
                const idMunicipioProfissional = this.profissionalExecutanteForm.get('idMunicipioProfissional');
                idMunicipioProfissional.setValue(null);
                idMunicipioProfissional.updateValueAndValidity();
            }
        })
    }

    private gerenciarIndexSelecionado() {
        this.documentoSelecionadoControl.valueChanges.pipe(
            filter((documento: DocumentoTipoProcesso) => documento.id !== this.documentosCadastrados[0].id),
            takeUntil(this.subjecUnsubscribe),
        ).subscribe((documento: DocumentoTipoProcesso) => {
            this.indexSelecionado = this.documentosCadastrados.findIndex(doc => documento.id === doc.id);
        });
    }

    @Input()
    set documentos(documentos: DocumentoTipoProcesso[]) {
        ObjectUtils.applyWhenIsNotEmpty(documentos, () => {
            this.documentosCadastrados = documentos;
            this.arquivos = this.documentosCadastrados.reduce((acc, current) => {
                return [...acc, ...current.arquivos];
            }, []);
        });

        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    get arquivos() {
        return this._arquivos;
    }

    set arquivos(arquivos: any | Set<Arquivo> | Arquivo[]) {
        this._arquivos = arquivos;
    }


    cancelarAdicaoProcedimento() {
        this.addProcedimento = false;
        this.procedimentoEditado = null;
    }

    onSubmit() {
        let totalBytes = 0;
        if (this.documentosCadastrados && this.documentosCadastrados.length) {
            this.documentosCadastrados.forEach(doc => {
                if (doc.arquivos && doc.arquivos.length) {
                    doc.arquivos.forEach(arquivo => {
                        totalBytes += Number(arquivo.size);
                    });
                }
            });
        }
        const limite = 50 * 1024 * 1024;
        if (totalBytes > limite) {
            this.messageService.addMsgDanger('O tamanho máximo dos arquivos somados é de 50 MB.');
            return;
        }
        if (!this.showProgress) {
            const novoPedido = this.buildPedido();
            this.showProgress = true;
            let operation: Observable<any>;
            if (!isUndefinedNullOrEmpty(this.documentosCadastrados)) {
                operation = forkJoin(...this.uploadTodosDocumentos(this.documentosCadastrados)).pipe(
                    catchError((error) => {
                        this.messageService.addMsgDanger(error.message || 'Erro ao realizar o upload do arquivo');
                        this.showProgress = false;
                        return of(null);
                    }),
                    filter(result => result !== null),
                    distinctUntilChanged(),
                    switchMap(() => this.autorizacaoPreviaService.incluirNovo(novoPedido))
                );
            } else {
                operation = this.autorizacaoPreviaService.incluirNovo(novoPedido);
            }
            operation.pipe(
                switchMap(() => this.autorizacaoPreviaService.liberarProcessoParaAnalise(this.pedidoCadastrado.id)),
                this.handlerError(),
                takeUntil(this.subjecUnsubscribe),
            ).subscribe(() => {
                this.showProgress = true;
                this.route.navigate(['meus-dados', 'pedidos', 'autorizacao-previa', 'pedido-enviado', this.pedidoCadastrado.id]);
            });
        }
    }

    private handlerError() {
        return catchError((httpResponseError: HttpErrorResponse) => {
            this.showProgress = false;
            this.messageService.addMsgDanger(httpResponseError.error);
            throw httpResponseError;
        });
    }

    pedidoRestore = Pedido;

    private buildPedido() {
        const pedido = new Pedido();
        pedido.idBeneficiario = this.beneficiario.id;
        pedido.beneficiario = this.beneficiario;
        pedido.idTipoProcesso = this.finalidade.idTipoProcesso;
        pedido.idTipoBeneficiario = this.beneficiario.contratoTpdep.idTipoBeneficiario;
        pedido.idMotivoSolicitacao = this.motivoSolicitacao.id;
        pedido.idConselhoProfissional = this.profissional.idConselhoProfissional;
        pedido.idEstadoConselho = this.profissional.idEstadoConselho;
        pedido.numeroConselho = this.profissional.numeroConselho.toString();
        pedido.observacao = this.informacoesAdicionais
        const cpfCnpjSemFormatacao = cpfCnpjUtil.limparFormatacao(this.profissional.cpfCnpj);
        const isCpf = cpfUtil.isValido(cpfCnpjSemFormatacao);
        pedido.cnpj = cpfCnpjSemFormatacao;
        if (isCpf) {
            pedido.cpf = cpfCnpjSemFormatacao;
            pedido.cnpj = null;
        }
        pedido.nomeProfissional = this.profissional.nomeProfissional;
        pedido.idMunicipioProfissional = this.profissional.idMunicipioProfissional;
        pedido.email = this.solicitacao.email;
        pedido.telefoneContato = Number(this.solicitacao.telefoneContato);
        pedido.tipoProcesso = this.tipoProcesso;
        pedido.pedidosProcedimento = this.procedimentos;
        pedido.idCaraterSolicitacao = 1;
        if(this.pedidoCadastrado !==null && this.pedidoCadastrado.id  !==null  &&this.pedidoCadastrado.id  !==undefined){
            pedido.id = this.pedidoCadastrado.id;
        }
        return pedido;
    }

    @Input()
    set conselhoProfissionalSelecionado(conselhoProfissionalSelecionado: DadoComboDTO) {
        this.conselho = conselhoProfissionalSelecionado;
    }

    @Input()
    set pedido(pedido: Pedido) {
        this.pedidoCadastrado = pedido;
    }

    private uploadTodosDocumentos(documentos: DocumentoTipoProcesso[]): Observable<any>[] {
        if (isUndefinedNullOrEmpty(documentos)) return [of({})]
        return documentos.map(documento => {
            const formData = new FormData();
            console.log('Aqui!!!!')
            console.log('idPedido: ' + this.pedidoCadastrado.id);
            console.log('idDocumentoProcesso: ' + documento.id);
            console.log('processadorUpload: ' + 'autorizacaoPrevia');
            console.log('tipoUpload: ' +  'documentoPedidoBeneficiario');
            console.log('rascunhoPedido: ' +  true);

            formData.append('idPedido', String(this.pedidoCadastrado.id));
            formData.append('idDocumentoProcesso', String(documento.id));
            formData.append('processadorUpload', 'autorizacaoPrevia');
            formData.append('tipoUpload', 'documentoPedidoBeneficiario');
            formData.append('rascunhoPedido', String(true));
            return this.fileUploadService.realizarUpload(formData, documento.arquivos);
        });
    }

    ngOnDestroy(): void {
        this.subjecUnsubscribe.next('');
        this.subjecUnsubscribe.complete();
    }

    adicionarNovoProcedimento(procedimento: PedidoProcedimento) {
        
        if (isNotUndefinedNullOrEmpty(procedimento)) {
            if (this.hasIndexOnTheForm()) {
                this.procedimentos[this.pedidoProcedimentoForm.index] = procedimento;
                
                    if( this.pedidoProcedimento && this.pedidoProcedimento.idPedido ){
                        
                        this.pedidoProcedimentoService
                            .excluirProcedimentoDoPedido( this.pedidoProcedimento.idPedido, this.pedidoProcedimento.idProcedimento )
                            .subscribe(() => {
                        
                                this.pedidoProcedimento = null
                                
                            })
                }
            } else {
                this.procedimentos.push(procedimento);
            }
            this.addProcedimento = false;
        }
    }

    private hasIndexOnTheForm(): boolean {
        return isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm) && isNotUndefinedNullOrEmpty(this.pedidoProcedimentoForm.index);
    }

    editarProcedimento(pedidoProcedimento: PedidoProcedimento, index: number) {
        this.pedidoProcedimento = JSON.parse( JSON.stringify( {...pedidoProcedimento, index} ) )
        
        if (isNotUndefinedNullOrEmpty(this.procedimentos)) {
            this.addProcedimento = true;
            this.pedidoProcedimentoForm = {
                idGrauProcedimento: pedidoProcedimento.idGrauProcedimento,
                idProcedimento: pedidoProcedimento.idProcedimento,
                qtdSolicitada: pedidoProcedimento.qtdSolicitada,
                tsOperacao: pedidoProcedimento.tsOperacao,
                index
            };
            this.procedimentoEditado = Object.assign({}, pedidoProcedimento);
        }
    }

    excluirProcedimento(pedidoProcedimento: PedidoProcedimento) {
        this.messageService.addConfirmYesNo('Deseja excluir esse procedimento?', () => {
            ArrayUtil.remove(this.procedimentos, pedidoProcedimento);
        }, null, null, 'Sim', 'Não');
    }

    editarProfissionalExecutante() {
        this.exibirFormularioProfissionalExecutante = true;
        if (this.profissional) {
            this.profissionalExecutanteForm.setValue({
                idConselhoProfissional: this.profissional.idConselhoProfissional,
                numeroConselho: this.profissional.numeroConselho,
                idEstadoConselho: this.profissional.idEstadoConselho,
                cpfCnpj: this.profissional.cpfCnpj,
                nomeProfissional: this.profissional.nomeProfissional,
                idEstadoProfissional: this.municipioProfissional.estado.id,
                idMunicipioProfissional: this.profissional.idMunicipioProfissional,
            });
        }

    }

    salvarEdicaoProfissionalExecutante() {
        aplicarAcaoQuandoFormularioValido(this.profissionalExecutanteForm, () => {
            const profissionalFormModel = this.profissionalExecutanteForm.value as ProfissionalFormModel;
            this.profissional = {...profissionalFormModel};
            this.municipioProfissional = this.municipioProfissionalEdicao;
            this.ufEstadoConselho = this.ufEstadoConselhoEdicao;
            this.conselho = this.conselhoEdicao;
            this.exibirFormularioProfissionalExecutante = false;
        });
    }

    cancelarEdicaoProfissionalExecutante() {
        this.exibirFormularioProfissionalExecutante = false;
    }

    arquivosSelecionados(arquivo: ArquivoParam) {
        if (this.documentosCadastrados && this.documentosCadastrados.length) {
            if (isUndefinedNullOrEmpty(this.documentosCadastrados[this.indexSelecionado].arquivos)) {
                this.documentosCadastrados[this.indexSelecionado].arquivos = [];
            }
            arquivo.files.forEach(file => {
                if (!this.possuiArquivoNaListagem(this.documentosCadastrados[this.indexSelecionado].arquivos, file)) {
                    this.documentosCadastrados[this.indexSelecionado].arquivos.push(file);
                }
            });
            this.indexSelecionado = 0;
            this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        }
    }

    possuiArquivoNaListagem(lista: Arquivo[], file: Arquivo): boolean {
        let isDuplicado = false;
        lista.forEach(arquivo => {
            if (arquivo.name === file.name && arquivo.size === file.size && arquivo.type === file.type) {
                isDuplicado = true;
            }
        });
        return isDuplicado;
    }

    watchDocumentos(documentos: DocumentoTipoProcesso[]) {
        this.documentosCadastrados = documentos;
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    selecionarTipoDocumento(tipoDocumento: DocumentoTipoProcesso) {
        this.documentoSelecionadoControl.setValue(tipoDocumento);
        this.documentoSelecionadoControl.updateValueAndValidity();
    }

    possuiFaltaDeArquivos(value: boolean) {
        this.documentoNaoPossuiArquivos = value;
    }

    verificarFaltaDeDocumentos(): boolean {
        return this.documentosCadastrados
            && this.documentosCadastrados.length
            && this.documentosCadastrados.some(doc => isUndefinedNullOrEmpty(doc.arquivos));
    }

    isTipoProcessoOdontologico() {
        return this.finalidade.idTipoProcesso === TipoProcessoEnum.AUTORIZACAO_PREVIA_ODONTOLOGICA;
    }

    criarProcedimento(): void {
        this.addProcedimento = true;
        this.pedidoProcedimentoForm = null;
    }

    municipioProfissionalSelecionado(municipio: Municipio) {
        this.municipioProfissionalEdicao = municipio;
    }

    ufEstadoConselhoSelecionado(ufConselho: DadoComboDTO) {
        this.ufEstadoConselhoEdicao = ufConselho;
    }

    conselhoSelecionado(conselhoProfissional: DadoComboDTO) {
        this.conselhoEdicao = conselhoProfissional;
    }

    procedimentoSelecionado(procedimento: Procedimento) {
        if (procedimento) {
            const indexProcedimento = this.procedimentos.findIndex(proc => proc.idProcedimento === procedimento.id);
            if (indexProcedimento > -1) {
                this.procedimentos[indexProcedimento].procedimento = procedimento;
            }
        }
    }

    isEditingProcedimentoForm(isEditingProcedimentoForm: boolean) {
        this.isEditingProcedimento = isEditingProcedimentoForm;
    }

    abrirModalReiniciar(): void {
        this.dialogReiniciarRef = this.dialogService.confirm({
            data: {
                title: {
                    text: 'Deseja reiniciar a solicitação de autorização prévia?',
                    showCloseButton: true,
                    highlightVariant: true
                },
                template: this.modalReiniciarTemplate,
                context: this
            }
        });
    }

    fecharModalReiniciar(): void {
        if (this.dialogReiniciarRef) {
            this.dialogReiniciarRef.close();
            this.dialogReiniciarRef = null;
        }
    }

    reiniciarForm(): void {
        this.fecharModalReiniciar();
        this.stepper.reset();
        this.reiniciarEvent.emit();
    }
}
