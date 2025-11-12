import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {AbstractControl, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {BaseComponent} from "app/shared/components/base.component";
import {MessageService} from "app/shared/components/messages/message.service";
import {Beneficiario} from "app/shared/models/entidades";
import {Data} from "app/shared/providers/data";
import * as constantes from "app/shared/constantes";
import {CI_MASK, CPF_MASK} from "../../shared/util/masks";
import {AutorizacaoPreviaService} from "../../shared/services/comum/pedido/autorizacao-previa.service";
import {BeneficiarioService} from "../../shared/services/comum/beneficiario.service";
import { take } from "rxjs";

@Component({
    selector: 'app-novo-pedido-autorizador',
    templateUrl: 'novo-pedido-credenciado.component.html',
    styleUrls: ['novo-pedido-credenciado.component.scss']
})
export class NovoPedidoAutorizadorComponent extends BaseComponent {

    beneficiarios: Beneficiario[];
    beneficiario: Beneficiario;
    maskCI: string = CI_MASK;
    maskCPF: string = CPF_MASK;
    titular: any;
    form: any;

    itensFinalidade: any[];

    constructor(
        messageService: MessageService,
        private readonly fb: FormBuilder,
        private readonly router: Router,
        public readonly beneficiarioService: BeneficiarioService,
        private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
        private readonly data: Data
    ) {
        super(messageService);
        this.form = fb.group({
            'cpf': fb.control(''),
            'numeroCartao': fb.control('')
        });
    }

    public novaSolicitacao(row: Beneficiario): void {
        this.data.storage['benfroAtendimento'] = row;
        this.router.navigateByUrl(`/pedido/autorizacao-previa/${btoa('novo-pedido-credenciado')}`);
    }

    get numeroCartao(): FormControl {
        return this.form.get('numeroCartao') as FormControl;
    }

    get cpf(): FormControl {
        return this.form.get('cpf') as FormControl;
    }

    get tipoProcesso(): AbstractControl {
        return this.form.get('tipoProcesso');
    }

    get idMotivoSolicitacao(): AbstractControl {
        return this.form.get('idMotivoSolicitacao');
    }

    get resultadoVisivel(): boolean {
        return this.beneficiarios && this.beneficiarios.length > 0;
    }

    public pesquisarBeneficiario(): void {
        if (constantes.isUndefinedNullOrEmpty(this.cpf.value)
            && constantes.isUndefinedNullOrEmpty(this.numeroCartao.value)) {
            this.showDangerMsg("MA114");
        } else {
            this.beneficiarioService.consultarBeneficiarioParaSolicitacaoCredenciado(this.form.getRawValue()).pipe(take(1)).subscribe((next:any) => {
                this.beneficiario = next as Beneficiario;
                this.beneficiarios = next.beneficiarios as Beneficiario[];
                if (!this.beneficiarios) {
                    this.novaSolicitacao(this.beneficiario);
                }
            }, error => this.showDangerMsg(error.error));
        }
    }

    public limparCampos(): void {
        this.form.reset();
        this.numeroCartao.reset();
        this.itensFinalidade = [];
        this.beneficiario = null;
    }

    public isTitular(): boolean {
        return this.beneficiario && !this.beneficiario.titular;
    }

}
