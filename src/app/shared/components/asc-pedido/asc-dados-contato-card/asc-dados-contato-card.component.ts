import {Component, Input} from '@angular/core';
import {FormGroup, FormBuilder} from "@angular/forms";
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';
import { PedidoDependenteDTO } from '../../../../../app/shared/models/dto/pedido-dependente';
import { Pedido } from '../../../../../app/shared/models/entidades';
import { MessageService } from '../../../../../app/shared/services/services';
import { AscComponenteAutorizadoMessage } from '../asc-componente-autorizado-message';


@Component({
    selector: 'asc-dados-contato-card',
    templateUrl: './asc-dados-contato-card.component.html',
    styleUrls: ['./asc-dados-contato-card.component.scss']
})
export class AscDadosContatoCardComponent extends AscComponenteAutorizadoMessage {

    modoEdicao: boolean = false;
    dependente: PedidoDependenteDTO;
    _processo: Pedido;

    dadosPessoaisForm: FormGroup;

    @Input()
    set processo(processo: Pedido) {
        this._processo = processo;
        if (processo && processo.id) {
            this.inscricaoDependenteService.findDependenteByPedido(processo.id).subscribe(dependente =>{
                this.dependente = dependente;
            },
            (err) => {
              this.messageService.addMsgDanger(err.error);
            }
          );
        }
    }

    constructor(
        private readonly inscricaoDependenteService: InscricaoDependenteService,
        private formBuilder: FormBuilder,
        override readonly messageService: MessageService
    ) {
        super(messageService);
    }

    ngOnInit() {
        this.dadosPessoaisForm = this.formBuilder.group({
            telefone: [null],
            email: [null],
        });
    }

    public clickAlerarDados(status) {
        this.modoEdicao = status;
        if (status) {
            this.dadosPessoaisForm.patchValue({
                telefone: this.dependente.coTelefoneTitular,
                email: this.dependente.deEmailTitular
            });
        }
    }

    public onSubmit() {
        this.dependente.coTelefoneTitular = this.dadosPessoaisForm.value.coTelefoneTitular;
        this.dependente.deEmailTitular = this.dadosPessoaisForm.value.deEmailTitular;

        this.inscricaoDependenteService.put(this.dependente).subscribe(res =>{

        },
            (err) => {
              this.messageService.addMsgDanger(err.error);
            }
          );
    }
}
