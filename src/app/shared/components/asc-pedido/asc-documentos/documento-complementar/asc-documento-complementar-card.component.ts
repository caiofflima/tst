import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MessageService} from "../../../../../../app/shared/services/services";
import {take} from "rxjs/operators";
import {Pedido} from "../../../../../../app/shared/models/comum/pedido";
import {SelectItem} from 'primeng/api';
import {fadeAnimation} from "../../../../animations/faded.animation";
import {DocumentoPedidoService} from '../../../../../../app/shared/services/comum/documento-pedido.service';
import {AscComponenteAutorizadoMessage} from "../../asc-componente-autorizado-message";
import {of} from "rxjs";
import {Documento} from "../../../../models/comum/documento";
import {DocumentoPedido} from "../../../../models/comum/documento-pedido";
import { DocumentoService } from 'app/shared/services/comum/documento.service';

@Component({
    selector: 'asc-documento-complementar-card',
    templateUrl: './asc-documento-complementar-card.component.html',
    styleUrls: ['./asc-documento-complementar-card.component.scss'],
    animations: [...fadeAnimation]
})
export class DocumentoComplementarCardComponent extends AscComponenteAutorizadoMessage implements OnDestroy {

    private _processo: Pedido;
    private readonly processo$ = new EventEmitter<Pedido>();

    documentos: Documento[];
    tipoDocumentoComplementar: any = [];
    selected: SelectItem;
    dadosProcesso: any = null;
    fcDocumentoComplementar = new FormControl();

    @Input()
    loading = false;

    @Input()
    possuiDocumentosObrigatorios = true;

    @Output()
    readonly atualizarProcesso$ = new EventEmitter<void>();

    @Output()
    readonly onCancelar = new EventEmitter<void>()

    @Output()
    readonly hasDocumentos = new EventEmitter<boolean>();

    constructor(
        protected override readonly messageService: MessageService,
        private documentoService: DocumentoService,
        private documentoPedidoService: DocumentoPedidoService
    ) {
        super(messageService);
    }

    @Input()
    set processo(processo: Pedido) {
        if (processo != null) {
            this.processo$.emit(processo);
            this._processo = processo;

            this.dadosProcesso = processo;
            this.carregarDocumentoComplementar();
        }
    }

    onChange(event): void {
        this.selected = this.tipoDocumentoComplementar.find(t => t.value === event.value);
    }

    get descricao(): string {
        if (this.selected != null) {
            return this.documentos.find(d => d.id == this.selected.value).descricao;
        }

        return null;
    }

    get processo() {
        return this._processo;
    }

    get documentoComplementar(): any {
        return this.fcDocumentoComplementar.value;
    }

    set documentoComplementar(value: any) {
        this.fcDocumentoComplementar.setValue(value);
    }

    public cancelar(): void {
        this.limpaCampos();
        this.onCancelar.emit();
    }

    public limpaCampos(): void {
        this.fcDocumentoComplementar.setValue('');
        this.selected = null;
    }

    public adicionarDocComplementar(): void {
        if (this.selected) {
            this.loading = true;
            let idPedido = this.dadosProcesso.id;
            let idDocumento = this.selected.value;

            this.documentoPedidoService.incluirDocumentoAdicional(idPedido, idDocumento).pipe(
                take<DocumentoPedido>(1)
            ).subscribe(() => {
                this.messageService.showSuccessMsg('MA00I');
                this.hasDocumentos.next(true);
                this.atualizarProcesso$.next();
                this.limpaCampos();
                this.loading = false;
            }, error => {
                this.messageService.showDangerMsg(error.error);
                this.loading = false;
                return of({});
            });
        } else {
            this.messageService.showDangerMsg('Favor informar o documento complementar!');
        }
    }

    private carregarDocumentoComplementar(): void {
        if (this._processo && this._processo.id) {
            this.documentoService.consultarDocumentosDisponiveisPorIdPedido(this._processo.id).pipe(take(1)).subscribe((documentos: Documento[]) => {
                this.documentos = documentos;
                this.tipoDocumentoComplementar = [];
                for (let d of documentos) {
                    const tamanho = (d.nome.length > 100) ? '...' : '';
                    const nome = d.nome.substring(0, 100) + tamanho;

                    this.tipoDocumentoComplementar.push({
                        label: nome,
                        value: d.id,
                        descricao: d.descricao,
                        filter: nome + " tipo "+ `${d.id}` 
                    });
                }
            }, error => this.messageService.showDangerMsg(error.error));
        }
    }
}
