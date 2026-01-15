import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DocumentoParam} from '../../models/documento.param';
import {isUndefinedNullOrEmpty} from '../../../../constantes';
import {Subject} from 'rxjs';
import {DocumentoTipoProcesso} from '../../../../models/dto/documento-tipo-processo';

import {FormControl} from '@angular/forms';
import {ArquivoParam} from "../../../asc-file/models/arquivo.param";

import {CdkStepper} from "@angular/cdk/stepper";
import { Loading } from 'app/shared/components/loading/loading-modal.component';

@Component({
    selector: 'asc-documentos-requeridos-pedido',
    templateUrl: './asc-documentos-requeridos-pedido.component.html',
    styleUrls: ['./asc-documentos-requeridos-pedido.component.scss'],
})
export class AscDocumentosRequeridosPedidoComponent implements OnInit, OnDestroy {

    @Input() parametro: DocumentoParam;
    @Input() title = 'Quase lá! Para finalizar, precisamos de alguns documentos.'
    @Input() subtitle = 'Documentos obrigatórios'
    @Input() stepper: CdkStepper;

    @Output() documentosSelecionados = new EventEmitter<DocumentoTipoProcesso[]>();

    private _pedidoProcedimentoVersao: number;

    @Input()
    set pedidoProcedimentoVersao(versao: number) {
        if (this._pedidoProcedimentoVersao != versao) {
            this.documentos.forEach(documento => documento.arquivos = []);
        }

        this._pedidoProcedimentoVersao = versao;
    }

    documentos: any | DocumentoTipoProcesso[] = [];
    documentoSelecionadoControl = new FormControl();
    documentoNaoPossuiArquivos = true;
    loading = false;
    private readonly documentoParam = new EventEmitter<DocumentoParam>();
    private readonly subjectUnsubscription = new Subject<void>();

    ngOnInit() {
        console.log("init")
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        this.documentoParam.emit(this.parametro);
    }

    verificarFaltaDeDocumentos(): boolean {
        return this.existeDocumentoParaProcedimentosSelecionados() &&
            this.documentos && this.documentos.some(doc => isUndefinedNullOrEmpty(doc.arquivos));
    }

    ngOnDestroy(): void {
        this.subjectUnsubscription.next();
        this.subjectUnsubscription.complete();
    }

    possuiArquivoNaListagem(lista: File[], file: File): boolean {
        let isDuplicado = false;
        lista.forEach(arquivo => {
            if (arquivo.name === file.name && arquivo.size === file.size && arquivo.type === file.type) {
                isDuplicado = true;
            }
        });
        return isDuplicado;
    }

    arquivosSelecionados(arquivo: ArquivoParam) {
        if (!arquivo.files || arquivo.files.size == 0) {
            this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        } else {
            Loading.start()
            setTimeout(() => {
                try {
                    arquivo.files.forEach(file => {
                        if (!arquivo.param.arquivos) {
                            arquivo.param.arquivos = [];
                        }
                        if (!this.possuiArquivoNaListagem(arquivo.param.arquivos, file)) {
                            const anexo: any = file;
                            anexo.data = new Date();
                            arquivo.param.arquivos.push(anexo);
                        }
                    });

                    this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
                } finally {
                    Loading.stop()
                }
            });
        }
    }

    existeDocumentoParaProcedimentosSelecionados(): boolean {
        return !isUndefinedNullOrEmpty(this.documentos);
    }

    selecionarTipoDocumento(tipoDocumento: DocumentoTipoProcesso) {
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        this.documentoSelecionadoControl.setValue(tipoDocumento);
    }

    onSubmit(): void {
        this.documentosSelecionados.emit(this.documentos);
        this.stepper.next();
    }

    watchDocumentos(documentos: DocumentoTipoProcesso[]) {
        setTimeout(() => {
            if (documentos) {
                this.documentos = documentos;
                this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
            }
        }, 0);
    }

    isLoading(isLoading: boolean) {
        this.loading = isLoading;
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }
}
