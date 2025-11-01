import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MensagemPedidoDTO} from '../../../../../../app/shared/models/dtos';
import {MessageService} from '../../../../../../app/shared/services/services';
import {BaseComponent} from '../../../../../../app/shared/components/base.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OverlayPanel} from 'primeng/overlaypanel';
import {AscApresentadorComponent} from '../../../../../../app/shared/components/apresentador/apresentador.component';
import {take} from "rxjs/operators";
import { MensagemPedidoService } from 'app/shared/services/comum/mensagem-enviada.service';

@Component({
    selector: 'asc-mensagens-enviadas-detalhar',
    templateUrl: './mensagens-enviadas-detalhar.component.html',
    styleUrls: ['./mensagens-enviadas-detalhar.component.scss']
})
export class AscMensagensEnviadasDetalharComponent extends BaseComponent implements OnInit {

    @ViewChild('apresentador')
    apresentador: AscApresentadorComponent<MensagemPedidoDTO>;
    @ViewChild('op')
    op: OverlayPanel;
    @Output('onUpdate')
    onUpdate: EventEmitter<any>;
    @Output('onRead')
    onRead: EventEmitter<any>;
    @Input()
    mensagens: MensagemPedidoDTO[];

    display: boolean = false;
    mensagemEnviada: MensagemPedidoDTO;
    formulario: FormGroup;

    constructor(
        protected override messageService: MessageService,
        private mensagemPedidoService: MensagemPedidoService,
        private formBuilder: FormBuilder
    ) {
        super(messageService);
        this.onUpdate = new EventEmitter<any>();
        this.onRead = new EventEmitter<any>();
    }


    ngOnInit(): void {
        this.formulario = this.formBuilder.group({
            'emailDistinto': ['', [Validators.required, Validators.email]]
        });
    }

    public show(mensagemEnviada: MensagemPedidoDTO) {
        this.configurarDetalhamento(mensagemEnviada);
        this.apresentador.apresentar(mensagemEnviada);
    }

    public apresentar(mensagem: MensagemPedidoDTO): void {
        let header = '';
        if (mensagem && mensagem['email']) {
            header = `${mensagem['email'].assunto} - ${mensagem['email'].nomeSituacaoProcesso}`;
        }
        this.configurarDetalhamento(mensagem);
        this.apresentador.setHeader(header);
        this.onRead.emit(mensagem);
    }

    public reenviarConfirmar(emailDestinatario?: string) {
        if (confirm("Confirma o reenvio desta mensagem?")) {
            this.reenviar(emailDestinatario);
        }
    }

    private configurarDetalhamento(mensagemEnviada: MensagemPedidoDTO): void {
        this.mensagemEnviada = mensagemEnviada;
        this.formulario.reset();
        this.display = true;
    }

    private reenviar(emailDestinatario?: string) {

        let mensagem: MensagemPedidoDTO = (JSON.parse(JSON.stringify(this.mensagemEnviada)));
        if (emailDestinatario) {
            mensagem.emailDistintoReenvio = emailDestinatario;
        }

        this.mensagemPedidoService.reenviarMensagemPedido(mensagem).pipe(
            take(1)
        ).subscribe(() => {
            this.showSuccessMsg('MA102');
            this.onUpdate.emit();
            this.op.hide();
        }, error => {
            this.messageService.addMsgDanger(error);
        });
    }
}
