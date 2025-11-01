import {Component, Input, OnDestroy} from '@angular/core';
import {forkJoin, Observable, Subject} from 'rxjs';

import {DocumentoTipoProcesso} from '../../../models/dto/documento-tipo-processo';
import {Pedido} from '../../../models/comum/pedido';
import {GrauProcedimento} from "../../../models/comum/grau-procedimento";
import {Procedimento} from "../../../models/comum/procedimento";
import {FinalidadeFormModel} from "../models/finalidade-form-model";
import {PedidoProcedimento} from "../../../models/comum/pedido-procedimento";

import {MessageService} from '../../messages/message.service';
import {FileUploadService} from '../../../services/comum/file-upload.service';

import {HttpUtil} from '../../../util/http-util';
import {isUndefinedNullOrEmpty} from "../../../constantes";
import {of} from "rxjs";
import {ProcedimentoPedidoService} from "../../../services/comum/procedimento-pedido.service";
import {TipoProcessoEnum} from "../models/tipo-processo.enum";
import {MedicamentoPatologiaPedidoService} from "../../../services/comum/medicamento-patologia-pedido.service";
import {MedicamentoPatologiaPedido} from "../../../models/comum/medicamento-patologia-pedido";
import {RetornoSIASC} from "../../../models/dto/retorno-siasc";
import {AscStepperComponent} from "../../asc-stepper/asc-stepper/asc-stepper.component";

@Component({
  selector: 'asc-resumo-base',
  template: ''
})
export abstract class ResumoBaseComponent implements OnDestroy {

    @Input() stepper: AscStepperComponent

    @Input() pedido: Pedido;
    @Input() grauProcedimento: GrauProcedimento;
    @Input() procedimento: Procedimento;
    @Input() finalidade: FinalidadeFormModel;
    @Input() documentos: DocumentoTipoProcesso[];
    @Input() loading = false;

    editing: boolean;
    private readonly subjecUnsubscribe = new Subject();

    protected constructor(
        private readonly fileUploadService: FileUploadService,
        private readonly messageService: MessageService,
        private readonly procedimentoPedidoService: ProcedimentoPedidoService,
        protected readonly medicamentoPatologiaPedidoService: MedicamentoPatologiaPedidoService
    ) {
    }

    private _pedidoProcedimentos: PedidoProcedimento[] = [];

    get pedidoProcedimentos(): PedidoProcedimento[] {
        return this._pedidoProcedimentos;
    }

    @Input() set pedidoProcedimentos(pedidosProcedimento: PedidoProcedimento[]) {
        this.configurarPedidosProcedimento(pedidosProcedimento);
    }

    get possuiPedidoProcedimentos(): boolean {
        return this._pedidoProcedimentos && this._pedidoProcedimentos.length > 0;
    }

    pedidoProcedimentosAtualizados(procedimentos: PedidoProcedimento[]) {
        this.configurarPedidosProcedimento(procedimentos);
    }

    salvarPedido(): void {
        let totalBytes = 0;
        if (this.documentos && this.documentos.length) {
            this.documentos.forEach(doc => {
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
        this.loading = true;
        const novoPedido = new Pedido({ ...this.buildPedido() });
        forkJoin(this.uploadTodosDocumentos(this.documentos, this.pedido)).subscribe(() => {
            this.incluirNovo(novoPedido).subscribe((retorno: RetornoSIASC) => {
                this.pedido = retorno.map['pedido'];
                const pedidosProcedimentos$ = this.pedidoProcedimentos.map(pedidoProcedimento => {
                    return this.incluirOuAtualizarPedidoProcedimentoOuMedicamentoPatologiaPedido(pedidoProcedimento, this.pedido);
                });
                forkJoin(pedidosProcedimentos$).subscribe(() => {
                    this.loading = false;
                    this.irParaPaginaSucesso();
                }, error => {
                    this.messageService.addMsgDanger(error.error || error.message);
                    this.loading = false;
                });
            }, error => {
                this.messageService.addMsgDanger(error.error || error.message);
                this.loading = false;
            });
        }, error => {
            this.messageService.addMsgDanger(error.message || 'Erro ao realizar o upload do arquivo, SICEM indisponível');
            this.loading = false;
        });
    }
    
    uploadTodosDocumentos(documentos: DocumentoTipoProcesso[], pedido: Pedido): Observable<RetornoSIASC>[] {
        if (isUndefinedNullOrEmpty(documentos)) return [of()];
        return documentos.map(documento => {
            const formData = new FormData();

            console.log('idPedido ' +  pedido.id.toString());
            console.log('idDocumentoProcesso '  + documento.id.toString());
            console.log('processadorUpload ' + this.getTipoProcessadorUpload());
            console.log('tipoUpload ' +  this.getTipoUpload());
            console.log('rascunhoPedido ' + Boolean(true).toString());
            
            formData.append('idPedido', pedido.id.toString());
            formData.append('idDocumentoProcesso', documento.id.toString());
            formData.append('processadorUpload', this.getTipoProcessadorUpload());
            formData.append('tipoUpload', this.getTipoUpload());
            formData.append('rascunhoPedido', Boolean(true).toString());
            return this.fileUploadService.realizarUpload(formData, documento.arquivos);
        });
    }

    ngOnDestroy() {
        this.subjecUnsubscribe.next({});
        this.subjecUnsubscribe.complete();
    }

    abstract incluirNovo(pedido: Pedido): Observable<RetornoSIASC>;

    abstract buildPedido(): Pedido;

    abstract irParaPaginaSucesso(): void;

    abstract getTipoProcessadorUpload(): string;

    abstract getTipoUpload(): string;

    setFlagEdicao(editing: boolean) {
        this.editing = editing;
    }

    protected configurarPedidosProcedimento(pedidosProcedimento: PedidoProcedimento[]) {
        this._pedidoProcedimentos = pedidosProcedimento;
    }

    private incluirOuAtualizarPedidoProcedimentoOuMedicamentoPatologiaPedido(
        pedidoProcedimento: MedicamentoPatologiaPedido | PedidoProcedimento | any,
        pedido: Pedido
    ) {
        const procedimento = {
            ...pedidoProcedimento,
            idProcedimento: pedidoProcedimento.idProcedimento || pedidoProcedimento.idPatologia,
            idPedido: pedido.id
        };
        
        let operation$ = this.procedimentoPedidoService.incluirOuAtualizarPedidoProcedimento(procedimento)
        if (pedido.idTipoProcesso === TipoProcessoEnum.REEMBOLSO_MEDICAMENTO) {
            procedimento.patologia = null;
            procedimento.medicamento = null;
            procedimento.pedido = null;
            const medicamento: MedicamentoPatologiaPedido = procedimento;
            medicamento.medicamentoPatologia = {
                idPatologia: procedimento.medicamentoPatologia.patologia.id,
                idMedicamento: procedimento.medicamentoPatologia.idMedicamento
            };
            operation$ = this.incluirOuCadastrarPedidoMedicamentoPatologiaPedido(procedimento);
        }
        return operation$.pipe(
            HttpUtil.catchError(this.messageService, () => this.loading = false)
        )
    }

    private incluirOuCadastrarPedidoMedicamentoPatologiaPedido(medicamentoPatologiaPedido: MedicamentoPatologiaPedido): Observable<any> {
        return this.medicamentoPatologiaPedidoService.incluir(medicamentoPatologiaPedido);
    }
}
