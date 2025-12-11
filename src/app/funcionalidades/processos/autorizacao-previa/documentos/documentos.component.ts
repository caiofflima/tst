import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {filter, takeUntil} from 'rxjs/operators';
import {isUndefinedNullOrEmpty} from '../../../../shared/constantes';
import {Subject} from 'rxjs';
import {DocumentoTipoProcesso} from '../../../../shared/models/dto/documento-tipo-processo';
import {FormControl} from '@angular/forms';
import {ArquivoParam} from "../../../../shared/components/asc-file/models/arquivo.param";
import {Arquivo} from "../../../../shared/models/dto/arquivo";
import {Pedido} from "../../../../shared/models/comum/pedido";
import {DocumentoParam} from "../../../../shared/components/asc-pedido/models/documento.param";
import {CdkStepper} from "@angular/cdk/stepper";

@Component({
    selector: 'app-documentos',
    templateUrl: './documentos.component.html',
    styleUrls: ['./documentos.component.scss'],
})
export class DocumentosComponent implements OnInit, OnDestroy {

    @Input() parametro: DocumentoParam;
    @Input() title = 'Quase lá! Para finalizar, precisamos de alguns documentos.'
    @Input() subtitle = 'Documentos obrigatórios'
    @Input() pedido: Pedido;
    @Input() stepper: CdkStepper;

    @Output() documentosObrigatorios = new EventEmitter<DocumentoTipoProcesso[]>();
    documentos: DocumentoTipoProcesso[] = [];

    private readonly documentoParam = new EventEmitter<DocumentoParam>();
    private readonly subjectUnsubscription = new Subject<void>();

    documentoSelecionadoControl = new FormControl();
    private indexSelecionado = 0;
    documentoNaoPossuiArquivos = true;

    loading = true;

    private _pedidoProcedimentoVersao: number;

    @Input()
    set pedidoProcedimentoVersao(versao: number) {
        if (this._pedidoProcedimentoVersao != versao) {
            this.documentos.forEach(documento => documento.arquivos = []);
        }

        this._pedidoProcedimentoVersao = versao;
    }

    ngOnInit() {
        this.gerenciarIndexSelecionado();
        this.documentoParam.emit(this.parametro);
    }

    private gerenciarIndexSelecionado() {
        this.documentoSelecionadoControl.valueChanges.pipe(
            filter((documento: DocumentoTipoProcesso) => documento.id !== this.documentos[0].id),
            takeUntil(this.subjectUnsubscription),
        )
        .subscribe((documento: DocumentoTipoProcesso) => {
            this.indexSelecionado = this.documentos.findIndex(doc => documento.id === doc.id);
            this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        });
    }

    ngOnDestroy(): void {
        this.subjectUnsubscription.next();
        this.subjectUnsubscription.complete();
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

    arquivosSelecionados(arquivo: ArquivoParam) {
        if (this.documentos && this.documentos.length) {
            if (isUndefinedNullOrEmpty(this.documentos[this.indexSelecionado].arquivos)) {
                this.documentos[this.indexSelecionado].arquivos = [];
            }
            arquivo.files.forEach((file: Arquivo) => {
                file.isNew = true;
                file.data = new Date();
                arquivo.param.arquivos.push(file);
                if (!this.possuiArquivoNaListagem(this.documentos[this.indexSelecionado].arquivos, file)) {
                    this.documentos[this.indexSelecionado].arquivos.push(file);
                }
            });
            this.indexSelecionado = 0;
        }

        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    existeDocumentoParaProcedimentosSelecionados(): boolean {
        return !isUndefinedNullOrEmpty(this.documentos);
    }

    verificarFaltaDeDocumentos(): boolean {
        return this.existeDocumentoParaProcedimentosSelecionados() &&
            this.documentos && this.documentos.some(doc => isUndefinedNullOrEmpty(doc.arquivos));
    }

    selecionarTipoDocumento(tipoDocumento: DocumentoTipoProcesso) {
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
        this.documentoSelecionadoControl.setValue(tipoDocumento);
    }

    onSubmit(): void {
        this.documentosObrigatorios.emit(this.documentos);
        this.stepper?.next();
    }

    previous(): void {
        this.stepper?.previous();
    }

    watchDocumentos(documentos: DocumentoTipoProcesso[]) {
        this.documentos = documentos;
        this.documentoNaoPossuiArquivos = this.verificarFaltaDeDocumentos();
    }

    loadingDocument(loading: boolean) {
        this.loading = loading;
    }
}
