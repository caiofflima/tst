import {Component, EventEmitter, Output} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {BaseComponent} from '../../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../../app/shared/components/messages/message.service';
import {SituacaoPedidoService} from '../../../../../../app/shared/services/comum/situacao-pedido.service';
import {TipoOcorrenciaService} from '../../../../../../app/shared/services/comum/tipo-ocorrencia.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'asc-nova-ocorrencia',
    templateUrl: './nova-ocorrencia.component.html',
    styleUrls: ['./nova-ocorrencia.component.scss']
})
export class AscNovaOcorrenciaComponent extends BaseComponent {

    display: boolean = false;
    form: FormGroup;
    itensTipoOcorrencia: SelectItem[];
    @Output('onUpdate')
    emitter: EventEmitter<any>;

    constructor(
        override readonly messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly situacaoPedidoService: SituacaoPedidoService,
        private readonly tipoOcorrenciaService: TipoOcorrenciaService
    ) {
        super(messageService);
        this.itensTipoOcorrencia = [];
        this.emitter = new EventEmitter<any>();
        this.initForm();
    }

    private initForm(): void {
        this.form = this.fb.group({
            idPedido: this.fb.control('', Validators.required),
            idTipoOcorrencia: this.fb.control('', Validators.required),
            descricaoHistorico: this.fb.control('', Validators.required)
        });
    }

    get idPedido(): AbstractControl {
        return this.form.get('idPedido');
    }

    get idTipoOcorrencia(): AbstractControl {
        return this.form.get('idTipoOcorrencia');
    }

    get descricaoHistorico(): AbstractControl {
        return this.form.get('descricaoHistorico');
    }

    public carregarTiposOcorrencia(): void {
        this.tipoOcorrenciaService.consultarTiposOcorrenciaManuais().subscribe(res => {
            this.itensTipoOcorrencia = [];
            for (let to of res) {
                this.itensTipoOcorrencia.push({label: to.nome, value: to.id});
            }
            this.display = true;
        }, error => this.messageService.addMsgDanger(error.error));
    }

    public show(pedido: any) {
        this.form.reset();
        if (pedido && pedido.id) {
            this.idPedido.setValue(pedido.id);
            this.carregarTiposOcorrencia();
        } else {
            this.display = false;
        }
    }

    public adicionarOcorrencia(): void {
        if (this.form.valid) {
            this.situacaoPedidoService.incluirOcorrenciaPedido(this.form.value).subscribe(res => {
                this.showSuccessMsg('MA00I');
                this.emitter.emit(this.idPedido.value);
            }, error => this.messageService.addMsgDanger(error.error));
            this.display = false;
        } else {
            this.validateAllFormFields(this.form);
            this.showDangerMsg('MA007');
        }
    }

    public limparCampos(): void {
        this.descricaoHistorico.reset();
        this.idTipoOcorrencia.reset();
    }
}
