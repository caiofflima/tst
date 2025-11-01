import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DocumentosFiscalBase} from "./asc-documento-fiscal-base";
import {DocumentoFiscal} from "../../../../../funcionalidades/processos/reembolso/models/documento-fiscal.model";
import {ProcessoService} from "../../../../services/comum/processo.service";
import {Pedido} from "../../../../models/comum/pedido";
import {take, tap} from "rxjs/operators";
import {LocalidadeService, MessageService, ProcedimentoPedidoService} from "../../../../services/services";
import {cpfUtil} from "../../../../constantes";
import {HttpUtil} from "../../../../util/http-util";
import {NumberUtil} from "../../../../util/number-util";

@Component({
    selector: 'asc-card-documento-fiscal',
    templateUrl: './asc-card-documento-fiscal.component.html',
    styleUrls: ['./asc-card-documento-fiscal.component.scss']
})
export class AscCardDocumentoFiscalComponent extends DocumentosFiscalBase {

    @Input()
    toTop = false;

    loading = false;
    isShowMunicipio = false;
    private _isEditing = false;

    @Output('onEditing') readonly onEditing$ = new EventEmitter<boolean>();
    readonly isEditing$ = new EventEmitter<boolean>();

    @Output() recarregarProcesso = new EventEmitter<void>()

    private _processo: Pedido;
    private _pedidoAux = new Pedido();
    private _documentoFiscalOriginal: DocumentoFiscal;
    labelCPF_CNPJ = "CPF ou CNPJ do Emissor";

    titular: any;
     
    constructor(
        private readonly processoService: ProcessoService,
        private readonly messageService: MessageService,
        protected override readonly localidadeService: LocalidadeService,
        private procedimentoPedidoService: ProcedimentoPedidoService
    ) {
        super(localidadeService);
    }

    set isEditing(b: boolean) {
        this._isEditing = b;
        this.onEditing$.emit(this._isEditing);
    }

    get isEditing(): boolean {
        return this._isEditing;
    }

    @Input() set processo(processo: Pedido) {
        setTimeout(() => {
            if (this._processo !== processo) this.limparCard();
            this._processo = processo;
        }, 0)
    }

    @Input() set documentoFiscal(documentoFiscal: DocumentoFiscal) {
        if (documentoFiscal) {
            Object.keys(this.formularioDocumentoFiscal.controls).forEach((keyControl) => {
                if (documentoFiscal[keyControl]) {
                    this.formularioDocumentoFiscal.get(keyControl).setValue(documentoFiscal[keyControl]);
                }
            })
            if (documentoFiscal.valor && documentoFiscal.valor.includes(",")) {
                documentoFiscal.valor = NumberUtil.removeMaskCurrencyBrazil(documentoFiscal.valor).toFixed(2);
            }

            this._documentoFiscal = documentoFiscal;
            this.inicializar();
        }
    }

    override ngOnInit() {
        super.ngOnInit();
        setTimeout(() => this.isShowMunicipio = true, 0);
        this.inicializar();
    }

    inicializar(){
        if(this.isTipoMedicamento){
           this.labelCPF_CNPJ = "CNPJ do Emissor";
        }
    }


    get processo(): Pedido {
        return this._processo;
    }

    get documentoFiscal() {
        return this._documentoFiscal;
    }

    isToEdit(): void {
        this.isEditing = true;
        this.isEditing$.emit(this.isEditing)
        this.pedidoProcedimentos$.next(this.pedidoProcedimentos)
        this.uf = this._documentoFiscal.ufAsObject
        this.municipio = this._documentoFiscal.municipioAsObject
        this._documentoFiscalOriginal = this._documentoFiscal;
        this.formularioDocumentoFiscal.get('cpfCnpj').setValue(this._documentoFiscal.cpfCnpj);
        this.formularioDocumentoFiscal.get('numeroDoc').setValue(this._documentoFiscal.numeroDoc);
        this.formularioDocumentoFiscal.get('data').setValue(this._documentoFiscal.data);
        this.formularioDocumentoFiscal.get('valor').setValue(NumberUtil.convertStringToNumber(this._documentoFiscal.valor).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }));
        this.formularioDocumentoFiscal.get('nome').setValue(this._documentoFiscal.nome);
        
        const pedidos = this.procedimentoPedidoService.getPedidoProcedimentoTabela()
        
        const totalValorUnitarioPago = pedidos.map(p => Number(p.valorUnitarioPago) * p.qtdMedicamento)
                                              .reduce((curr, val) => curr + val, 0)
        this.definirValorMinimo(totalValorUnitarioPago)
        
        
        setTimeout(() => {
            for (let i in this.formularioDocumentoFiscal.controls) {
                this.formularioDocumentoFiscal.controls[i].markAsTouched();
            }

            this.formularioDocumentoFiscal.get('valor').markAsDirty();
            this.formularioDocumentoFiscal.get('valor').updateValueAndValidity();
            
            this.formularioDocumentoFiscal.get('data').markAsDirty();
            this.formularioDocumentoFiscal.get('data').updateValueAndValidity();
            if (this.municipio) {
                this.formularioDocumentoFiscal.get('idEstado').setValue(this.municipio.estado.id);
                this.formularioDocumentoFiscal.get('idMunicipio').setValue(this.municipio.id);
            }
        }, 100);
    }

    onSubmit(): void {
        const documentoFiscal = this.formularioDocumentoFiscal.getRawValue() as DocumentoFiscal;
        if (this.valorMinimo > NumberUtil.convertStringToNumber(documentoFiscal.valor)) {
            this.messageService.addMsgDanger('MA083');
            return;
        }

        this.loading = true;
        const processo = new Pedido({...this.processo});
        const cpfCnpjSemFormatacao = cpfUtil.limparFormatacao(documentoFiscal.cpfCnpj);

        if (cpfCnpjSemFormatacao && cpfCnpjSemFormatacao.length == 11) {
            processo.cpf = cpfCnpjSemFormatacao;
            processo.cnpj = null;
        } else {
            processo.cpf = null;
            processo.cnpj = cpfCnpjSemFormatacao;
        }
        
        processo.nomeProfissional = documentoFiscal.nome;
        processo.idEstadoConselho = documentoFiscal.idEstado;
        processo.idMunicipioProfissional = documentoFiscal.idMunicipio;
        processo.numeroDocumentoFiscal = documentoFiscal.numeroDoc;
        processo.valorDocumentoFiscal = NumberUtil.removeMaskCurrencyBrazil(documentoFiscal.valor);
        documentoFiscal.valor = String(processo.valorDocumentoFiscal);
        processo.dataEmissaoDocumentoFiscal = documentoFiscal.data as Date;
        documentoFiscal.ufAsObject = this.uf;
        documentoFiscal.municipioAsObject = this.municipio;
        this._documentoFiscalOriginal = null;
        this.processoService.atualizarDocumentoFiscal(processo).pipe(
            tap(() => this.messageService.addMsgSuccess("Documento Fiscal Atualizado com sucesso!")),
            HttpUtil.catchErrorAndReturnEmptyObservable(this.messageService, () => this.loading = false),
            tap(() => this.loading = false),
            tap(() => this.isEditing = false),
            tap(() => this.isEditing$.emit(this.isEditing)),
            tap(() => this.documentoFiscal$.emit(documentoFiscal)),
            tap(() => {
                this._documentoFiscal = documentoFiscal
                this.procedimentoPedidoService.setValorNotaFiscal(documentoFiscal)
            }),
            tap(() => {
                console.log("Emitindo evento para atualizar os procedimentos...");
                this.recarregarProcesso.emit();
            }),
            take(1)
        ).subscribe()
    }

    onCancel() {
        this.isEditing = false;
        this.isEditing$.emit(this.isEditing);
        if (this._documentoFiscalOriginal) {
            this.documentoFiscal = this._documentoFiscalOriginal;
            this._documentoFiscalOriginal = null;
        }
    }

    private limparCard() {
        this.formularioDocumentoFiscal.reset();
    }

    goToTop() {
        window.scrollTo(0, 0);
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
}
