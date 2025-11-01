import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {BaseComponent} from '../../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../../app/shared/components/messages/message.service';
import {DocumentoService} from '../../../../../../app/shared/services/comum/documento.service';
import {DocumentoPedidoService} from '../../../../../../app/shared/services/comum/documento-pedido.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {take} from "rxjs/operators";
import { Documento } from 'app/shared/models/entidades';

@Component({
    selector: 'asc-solicitar-documentacao-adicional',
    templateUrl: './solicitar-documentacao-adicional.component.html',
    styleUrls: ['./solicitar-documentacao-adicional.component.scss']
})
export class AscSolicitarDocumentacaoAdicionalComponent extends BaseComponent {

    display: boolean = false;
    form: FormGroup;
    itensDocumento: SelectItem[];
    @Output('onUpdate')
    emitter: EventEmitter<any>;
    selected: SelectItem;

    constructor(
        override readonly messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly documentoService: DocumentoService,
        private readonly documentoPedidoService: DocumentoPedidoService
    ) {
        super(messageService);
        this.itensDocumento = [];
        this.emitter = new EventEmitter<any>();
        this.initForm();
    }

    private initForm(): void {
        this.form = this.fb.group({
            idDocumento: this.fb.control('', Validators.required),
            idPedido: this.fb.control('', Validators.required),
        });
    }

    get idDocumento(): AbstractControl {
        return this.form.get('idDocumento');
    }

    get idPedido(): AbstractControl {
        return this.form.get('idPedido');
    }

    public showItem(item: SelectItem): void {
        this.selected = item;
    }

    public carregarDocumentosDisponiveis(): void {
        if (this.idPedido.value) {
            this.documentoService.consultarDocumentosDisponiveisPorIdPedido(this.idPedido.value).pipe(
                take(1)
            ).subscribe((res: Documento[]) => {
                /* res: any[] */
                this.itensDocumento = [];
                for (let d of res) {
                    this.itensDocumento.push({label: d.nome, value: d.id});
                }
                this.display = true;
            }, error => this.messageService.addMsgDanger(error.error));
        }
    }

    public show(pedido: any) {
        if (pedido && pedido.id) {
            this.idPedido.setValue(pedido.id);
            this.carregarDocumentosDisponiveis();
        } else {
            this.display = false;
        }
    }

    public adicionarDocumento(): void {
        if (this.form.valid) {
            this.documentoPedidoService.incluirDocumentoAdicional(this.idPedido.value, this.idDocumento.value).pipe(
                take(1)
            ).subscribe(() => {
                this.showSuccessMsg('MA00I');
                this.emitter.emit(this.idPedido.value);
            }, error => this.messageService.addMsgDanger(error.error));
            this.display = false;
        }
    }

    public limparCampo(): void {
        this.idDocumento.reset();
    }
}
