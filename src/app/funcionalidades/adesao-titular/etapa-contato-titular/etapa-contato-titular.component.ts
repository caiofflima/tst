import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject} from 'rxjs';
import { fadeAnimation } from 'app/shared/animations/faded.animation';
//import {AscValidators} from "../../../../shared/validators/asc-validators";
import { AscValidators } from 'app/shared/validators/asc-validators';
//import {somenteNumeros} from "../../../../shared/constantes";
import { somenteNumeros } from 'app/shared/constantes';
//import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import { BeneficiarioDependenteFormModel } from 'app/funcionalidades/dependente/models/beneficiario-dependente-form.model';
//import {Util} from "../../../../arquitetura/shared/util/util";
import { Util } from 'app/arquitetura/shared/util/util';
//import {BeneficiarioService, MessageService, SessaoService} from "../../../../shared/services/services";
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
//import {Beneficiario} from "../../../../shared/models/entidades";
import { Beneficiario } from 'app/shared/models/entidades';
//import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import { TipoDependente } from 'app/shared/models/comum/tipo-dependente';
//import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import { DadoComboDTO } from 'app/shared/models/dtos';
//import {TipoBeneficiarioDTO} from 'app/shared/models/dto/tipo-beneficiario';
import { TipoBeneficiarioDTO } from 'app/shared/models/dto/tipo-beneficiario';
import { EnderecoCorreios } from 'app/shared/models/comum/endereco-correios';
import { IntegracaoCorreiosService } from 'app/shared/services/comum/integracao-correios.service';
import { Router } from '@angular/router';
import { ContatoEnderecoFormModel } from '../models/contato-endereco-form-model';

@Component({
    selector: 'asc-etapa-contato-titular',
    templateUrl: './etapa-contato-titular.component.html',
    styleUrls: ['./etapa-contato-titular.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaContatoTitularComponent {

    @Input()
     stepper: CdkStepper;

    @Input()
    set checkRestart(subject: Subject<void>) {
        subject.subscribe(() => this.formularioContatoTitular.reset());
    }

    @Output()
    readonly contatoEnderecoModel = new EventEmitter<ContatoEnderecoFormModel>();

    @Output() beneficiarioDependente: BeneficiarioDependenteFormModel;
  

    showProgress: boolean = false;

    enderecoTitularForm:any = this.formBuilder.group({
        cep: [null, Validators.required],
        logradouro: [null, Validators.required],
        bairro: [null, Validators.required],
        municipio: [null, Validators.required],
        estado: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
      });
      @Output()
      readonly formularioContatoTitular = new FormGroup({
        telefone: new FormControl(null),
        email: new FormControl(null),
        cep: this.enderecoTitularForm.get("cep"),
        logradouro: this.enderecoTitularForm.get("logradouro"),
        bairro: this.enderecoTitularForm.get("bairro"),
        municipio: this.enderecoTitularForm.get("municipio"),
        estado: this.enderecoTitularForm.get("estado"),
        numero: this.enderecoTitularForm.get("numero"),
        complemento: this.enderecoTitularForm.get("complemento")
    });
    
    constructor(private messageService: MessageService,
                private formBuilder: FormBuilder,
                private integracaoCorreiosService: IntegracaoCorreiosService) {

    }
      
    onSubmit(): void {
      this.showProgress = true;
      const contatoEndereco = this.formularioContatoTitular.getRawValue() as ContatoEnderecoFormModel;
      this.contatoEnderecoModel.emit(contatoEndereco);
      console.log(this.contatoEnderecoModel);
      this.stepper.next();
  }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }

    getLogradouro(endereco: EnderecoCorreios):string{
        let tipo = "";
        let logradouro ="";
        let retorno = "";
      
        if(endereco && endereco.tipoLogradouro && endereco.tipoLogradouro.tipo){
          tipo = endereco.tipoLogradouro.tipo.trim();  
        }
      
        if(endereco && endereco.logradouro){
          logradouro = endereco.logradouro.trim();
        }
      
        if(tipo === ""){
          retorno = logradouro;
        }else{
          retorno = tipo + ' ' + logradouro;
        }
        
        return retorno;
       }

    getEnderecoByCEP() {
        this.integracaoCorreiosService.getEnderecoByCEP(this.enderecoTitularForm.value.cep).subscribe((endereco: EnderecoCorreios) => {
          if (endereco) {
            console.log(endereco);
              this.enderecoTitularForm.patchValue({
              cep: endereco.cep || '',
              logradouro: this.getLogradouro(endereco),
              bairro: endereco.bairro  || '',
              municipio: endereco.codigoMunicipioSIAGS  || '',
              estado: endereco.codigoEstadoSIAGS  || '',
              complemento: endereco.complemento  || '',
            });
          } else {
            this.messageService.addMsgDanger('Endereço não encontrado para o cep informado.');
          }
        },
        (err) => {
          this.messageService.addMsgDanger(err.error);
          console.log(err);
          this.showProgress = false;
        }
        );
     }

}
