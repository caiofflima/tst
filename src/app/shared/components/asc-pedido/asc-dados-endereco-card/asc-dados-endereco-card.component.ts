import {Component, Input} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import { InscricaoDependenteService } from 'app/shared/services/comum/inscricao-dependente.service';
import { PedidoDependenteDTO } from '../../../../../app/shared/models/dto/pedido-dependente';
import { Pedido } from '../../../../../app/shared/models/entidades';
import { MessageService } from '../../../../../app/shared/services/services';
import { AscComponenteAutorizadoMessage } from '../asc-componente-autorizado-message';


@Component({
    selector: 'asc-dados-endereco-card',
    templateUrl: './asc-dados-endereco-card.component.html',
    styleUrls: ['./asc-dados-endereco-card.component.scss']
})
export class AscDadosEnderecoCardComponent extends AscComponenteAutorizadoMessage {

    modoEdicao: boolean = false;
    dependente: PedidoDependenteDTO;
    _processo: Pedido;

    enderecoForm: FormGroup;

    @Input()
    set processo(processo: Pedido) {
        this._processo = processo;
        if (processo && processo.id) {
            this.inscricaoDependenteService.findDependenteByPedido(processo.id).subscribe(dependente =>{
                this.dependente = dependente;
                console.log('Dependente')
                console.log(dependente)
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
        this.enderecoForm = this.formBuilder.group({
            cep: [null, Validators.required],
            logradouro: [null, Validators.required],
            bairro: [null, Validators.required],
            municipio: [null, Validators.required],
            estado: [null, Validators.required],
            numero: [null, Validators.required],
            complemento: [null],
          });
    }

    public clickAlerarDados(status) {
        this.modoEdicao = status;
        if (status) {
            this.enderecoForm.patchValue({
                cep: this.dependente.coCepTitular,
                logradouro: this.dependente.deLogradouroTitular,
                bairro: this.dependente.noBairroTitular,
                municipio: this.dependente.noMunicipio,
                estado: this.dependente.noEstado,
                numero: this.dependente.nuEnderecoTitular,
                complemento: this.dependente.deComplementoTitula,
            });
        }
    }

    public onSubmit() {
        this.dependente.coTelefoneTitular = this.enderecoForm.value.coTelefoneTitular;
        this.dependente.deEmailTitular = this.enderecoForm.value.deEmailTitular;

        this.inscricaoDependenteService.put(this.dependente).subscribe(res =>{

        },
            (err) => {
              this.messageService.addMsgDanger(err.error);
            }
          );
    }

    //Tratamento para os casos em que o número é zero e o angular considera como um valor vazio
    tratarZeroHifem(numero: number): string | number{
        if (numero >= 0) {
            return numero;
        } else if (!numero) {
            return '-';
        } 
        else{
            return '-'
        }
    }
}
