import {Component} from '@angular/core';
import {BaseComponent} from '../../../../../../app/shared/components/base.component';
import {MessageService} from '../../../../../../app/shared/components/messages/message.service';
import {AnexoService} from '../../../../../../app/shared/services/comum/anexo.service';
import {BeneficiarioService} from '../../../../../../app/shared/services/comum/beneficiario.service';
import {FormBuilder} from '@angular/forms';

@Component({
    selector: 'asc-exibir-ocorrencia',
    templateUrl: './exibir-ocorrencia.component.html',
    styleUrls: ['./exibir-ocorrencia.component.scss']
})
export class AscExibirOcorrenciaComponent extends BaseComponent {

    static usuarioHistorico: any;
    display: boolean = false;
    situacaoPedido: any;
    usuarioCadastramento: any;
    listaAnexos: any[];

    constructor(
        private fb: FormBuilder,
        protected override messageService: MessageService,
        private anexoService: AnexoService,
        private beneficiarioService: BeneficiarioService
    ) {
        super(messageService);
        AscExibirOcorrenciaComponent.usuarioHistorico = {};
    }

    public show(situacaoPedido: any) {
        this.situacaoPedido = situacaoPedido;
        let matriculaUsuario = situacaoPedido.matriculaCadastramento
        this.anexoService.consultarPorIdSituacaoPedido(situacaoPedido.id).subscribe(res => this.listaAnexos = res,
            error => this.messageService.showDangerMsg(error.error));
        if (!AscExibirOcorrenciaComponent.usuarioHistorico[matriculaUsuario]) {
            this.beneficiarioService.consultarTitularPorMatricula(situacaoPedido.matriculaCadastramento).subscribe(res => {
                AscExibirOcorrenciaComponent.usuarioHistorico[matriculaUsuario] = res;
                this.usuarioCadastramento = res;
            }, error => this.messageService.showDangerMsg(error.error));
        }
        this.usuarioCadastramento = AscExibirOcorrenciaComponent.usuarioHistorico[matriculaUsuario];
        this.display = true;
    }

    public showAnexos(): boolean {
        return this.listaAnexos && this.listaAnexos.length > 0;
    }

    public hasMotivoNegacao(): boolean {
        return this.situacaoPedido && this.situacaoPedido.motivoNegacao;
    }

    public close(): void {
        this.display = false;
        this.listaAnexos = [];
        this.usuarioCadastramento = null;
    }

}
