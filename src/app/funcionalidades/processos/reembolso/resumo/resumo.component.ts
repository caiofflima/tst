import {Component, EventEmitter, Input, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TipoProcesso} from "../../../../shared/models/comum/tipo-processo";
import {Beneficiario} from "../../../../shared/models/comum/beneficiario";
import {Pedido} from "../../../../shared/models/comum/pedido";

import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {Municipio} from "../../../../shared/models/comum/municipio";
import {ProfissionalFormModel} from "../../../../shared/components/asc-pedido/models/profissional-form.model";
import {DocumentoTipoProcesso} from "../../../../shared/models/dto/documento-tipo-processo";
import {BeneficiarioForm} from "../../../../shared/components/asc-pedido/models/beneficiario.form";
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {DocumentoFiscal} from "../models/documento-fiscal.model";
import {MessageService} from '../../../../shared/components/messages/message.service';
import {FileUploadService} from '../../../../shared/services/comum/file-upload.service';
import {ReembolsoService} from '../../../../shared/services/comum/reembolso.service';

import {ResumoBaseComponent} from '../../../../shared/components/asc-pedido/base-components/resumo-base.component';

import {cpfCnpjUtil} from '../../../../shared/constantes';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {ProcedimentoPedidoService} from "../../../../shared/services/comum/procedimento-pedido.service";
import {
    MedicamentoPatologiaPedidoService
} from "../../../../shared/services/comum/medicamento-patologia-pedido.service";
import {ObjectUtils} from "../../../../shared/util/object-utils";
import {ProcessoService} from "../../../../shared/services/comum/processo.service";
import {PedidoProcedimento} from "../../../../shared/models/comum/pedido-procedimento";
import {RetornoSIASC} from "../../../../shared/models/dto/retorno-siasc";
import {Observable} from "rxjs";
import {NumberUtil} from "../../../../shared/util/number-util";
import {TipoProcessoEnum} from "../../../../shared/components/asc-pedido/models/tipo-processo.enum";
import {Util} from "../../../../arquitetura/shared/util/util";
import {istipoProcessoAutorizacaoPrevia} from "../../../../../app/shared/components/asc-pedido/models/tipo-processo.enum";
import {DscDialogService} from 'sidsc-components/dsc-dialog';
import {MatDialogRef} from '@angular/material/dialog';

@Component({ 
    selector: 'asc-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.scss'],
    animations: [...fadeAnimation]
})
export class ResumoComponent extends ResumoBaseComponent {

    @Input()
    beneficiarioModel: Beneficiario;

    @Input()
    beneficiarioForm: BeneficiarioForm;

    @Input()
    conselho: DadoComboDTO;

    @Input()
    municipioProfissional: Municipio;

    @Input()
    profissional: ProfissionalFormModel;

    @Input()
    ufConselho: DadoComboDTO;

    @Input()
    documentoFiscal: DocumentoFiscal;

    @Input()
    showProfissionalExecutante: boolean;

    @Output()
    reiniciarEvent: EventEmitter<void> = new EventEmitter<void>();

    @Input()
    tituloSolicitante = "Profissional executante";

    readonly resumoForm = new FormGroup({
        extra: new FormControl(null),
    });

    _arquivoParam: ArquivoParam;
    _documentoTipoProcessoDTOS: DocumentoTipoProcesso[];
    _documentoTipoProcessoDTO: DocumentoTipoProcesso;
    documentoNaoPossuiArquivos: boolean = false;
    showModal: boolean = false;
    isLoading = false;
    isValorDocumentoFiscalOK = true;
    private readonly tipoProcesso$ = new EventEmitter<TipoProcesso>();

    @ViewChild('modalReiniciarTemplate', { static: true })
    private modalReiniciarTemplate!: TemplateRef<any>;
    private dialogReiniciarRef?: MatDialogRef<any>;

    constructor(
        private readonly route: Router,
        private readonly reembolsoService: ReembolsoService,
        protected readonly _procedimentoPedidoService: ProcedimentoPedidoService,
        protected readonly medicamentoPatologiaPedido: MedicamentoPatologiaPedidoService,
        protected readonly processoService: ProcessoService,
        fileUploadService: FileUploadService,
        messageService: MessageService,
        private readonly dialogService: DscDialogService
    ) {
        super(fileUploadService, messageService, _procedimentoPedidoService, medicamentoPatologiaPedido);
    }

    ngOninit(){
        
        this.configurarTituloSolicitante();
    }

    public configurarTituloSolicitante():string{
        if (istipoProcessoAutorizacaoPrevia(this.finalidade.idTipoProcesso)) {
            this.tituloSolicitante = "Profissional solicitante";
        }
        return this.tituloSolicitante;
    }

    @Input() _tipoProcesso: TipoProcesso;

    get tipoProcesso() {
        return this._tipoProcesso;
    }

    @Input() set tipoProcesso(tipoProcesso: TipoProcesso) {
        this._tipoProcesso = tipoProcesso;
        this.tipoProcesso$.emit(this._tipoProcesso);
    }

    override pedidoProcedimentosAtualizados(procedimentos: PedidoProcedimento[]) {
        super.pedidoProcedimentosAtualizados(procedimentos);
        if (procedimentos && this.documentoFiscal) {
            this.verificarValorTotalProcedimentosAndDocumentoFiscal(procedimentos, Number(this.documentoFiscal.valor));
        }
    }

    updateBeneficiario(beneficiarioForm: BeneficiarioForm) {
        this.beneficiarioForm = beneficiarioForm;
    }

    arquivosSelecionados(arquivoParam: ArquivoParam) {
        this._arquivoParam = arquivoParam;
    }

    documentosTipoProcessoSelecionados(documentoTipoProcessoDTOS: DocumentoTipoProcesso[]) {
        this._documentoTipoProcessoDTOS = documentoTipoProcessoDTOS;
    }

    documentoTipoProcessoSelecionado(documentoTipoProcessoDTO: DocumentoTipoProcesso) {
        this._documentoTipoProcessoDTO = documentoTipoProcessoDTO;
    }

    onSubmit(): void {
        super.salvarPedido();
    }

    buildPedido(): Pedido {
        const pedido = new Pedido();
        pedido.idBeneficiario = this.beneficiarioModel.id;
        pedido.beneficiario = this.beneficiarioModel;
        pedido.idTipoProcesso = this.finalidade.idTipoProcesso;
        pedido.idTipoBeneficiario = this.beneficiarioModel.contratoTpdep.idTipoBeneficiario;
        pedido.idMotivoSolicitacao = this.finalidade.idMotivoSolicitacao;
        pedido.idConselhoProfissional = ObjectUtils.readValueFromPossibilityEmpty(() => this.profissional.idConselhoProfissional);
        pedido.idEstadoConselho = ObjectUtils.readValueFromPossibilityEmpty(() => this.profissional.idEstadoConselho);

        
        if(this.profissional !==null && this.profissional!==undefined
            && this.profissional.numeroConselho !==null && this.profissional.numeroConselho!==undefined){
            pedido.numeroConselho = this.profissional.numeroConselho.toString();
        }

        const cpfCnpjSemFormatacao = cpfCnpjUtil.limparFormatacao(this.profissional.cpfCnpj);

        if (cpfCnpjSemFormatacao && cpfCnpjSemFormatacao.length == 11) {
            pedido.cpf = cpfCnpjSemFormatacao;
        } else {
            pedido.cnpj = cpfCnpjSemFormatacao;
        }

        pedido.nomeProfissional = this.profissional.nomeProfissional;
        pedido.idMunicipioProfissional = this.profissional.idMunicipioProfissional;
        pedido.email = this.beneficiarioForm.email;
        pedido.telefoneContato = NumberUtil.convertStringToNumber(this.beneficiarioForm.telefoneContato);
        pedido.tipoProcesso = this.tipoProcesso;
        pedido.pedidosProcedimento = this.pedidoProcedimentos;
        pedido.idCaraterSolicitacao = 1;
        pedido.dataEmissaoDocumentoFiscal = Util.getDate(this.documentoFiscal.data);
        pedido.numeroDocumentoFiscal = NumberUtil.convertStringToNumber(this.documentoFiscal.numeroDoc);
        pedido.valorDocumentoFiscal = NumberUtil.convertStringToNumber(this.documentoFiscal.valor);
        pedido.id = this.pedido.id;
        pedido.observacao = this.resumoForm.get('extra').value;
        if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            pedido.pedidosProcedimento = null;
        }
        return pedido;
    }

    incluirNovo(pedido: Pedido): Observable<RetornoSIASC> {
        return this.reembolsoService.incluirNovo(pedido);
    }

    getTipoProcessadorUpload(): string {
        return 'reembolso';
    }

    getTipoUpload(): string {
        return 'documentoPedidoBeneficiario';
    }

    async irParaPaginaSucesso(): Promise<void> {
        await this.route.navigate(['meus-dados', 'pedidos', 'reembolso', 'recibo', this.pedido.id]);
    }

    possuiFaltaDeArquivos(value: boolean) {
        this.documentoNaoPossuiArquivos = value;
    }

    reiniciarForm(): void {
        this.fecharModalReiniciar();
        this.stepper.reset();
        this.reiniciarEvent.emit();
    }

    abrirModalReiniciar(): void {
        this.dialogReiniciarRef = this.dialogService.confirm({
            data: {
                title: {
                    text: 'Deseja reiniciar a solicitação de reembolso?',
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

    setModal(bool: boolean): void {
        if (bool) {
            this.abrirModalReiniciar();
        } else {
            this.fecharModalReiniciar();
        }
    }

    documentoFiscalAtualizado(documentoFiscal: DocumentoFiscal) {
        this.documentoFiscal = documentoFiscal;
        if (this.documentoFiscal) {
            this.verificarValorTotalProcedimentosAndDocumentoFiscal(this.pedidoProcedimentos, NumberUtil.convertStringToNumber(documentoFiscal.valor));
        }
    }

    protected override configurarPedidosProcedimento(pedidosProcedimento: PedidoProcedimento[]) {
        super.configurarPedidosProcedimento(pedidosProcedimento);
        if (this.documentoFiscal)
            this.verificarValorTotalProcedimentosAndDocumentoFiscal(pedidosProcedimento, NumberUtil.convertStringToNumber(this.documentoFiscal.valor));
    }

    protected verificarValorTotalProcedimentosAndDocumentoFiscal(pedidosProcedimento: PedidoProcedimento[], valorDocumentoFiscal?: number) {
        const valor = valorDocumentoFiscal || (this.pedido ? this.pedido.valorDocumentoFiscal : null);
        if (this.possuiPedidoProcedimentos && valor) {
            const totais = pedidosProcedimento.map(p => {
                // Procedimentos de reembolso consulta não possuem quantidade. É sempre 1.
                let quantidade = p.qtdSolicitada || p.qtdMedicamento || 1;
                return NumberUtil.convertStringToNumber(p.valorUnitarioPago) * quantidade;
            });
            const total = totais.reduce((subtotal: number, t: number) => t + subtotal, 0);
            this.isValorDocumentoFiscalOK = valor >= total;
        }
    }
}
