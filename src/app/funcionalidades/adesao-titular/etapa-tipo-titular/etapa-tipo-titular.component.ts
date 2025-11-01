import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkStepper } from "@angular/cdk/stepper";
import { Subject } from 'rxjs';
import { fadeAnimation } from 'app/shared/animations/faded.animation';
import { AscValidators } from 'app/shared/validators/asc-validators';
import { somenteNumeros } from 'app/shared/constantes';
import { BeneficiarioDependenteFormModel } from 'app/funcionalidades/dependente/models/beneficiario-dependente-form.model';
import { Util } from 'app/arquitetura/shared/util/util';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { Beneficiario } from 'app/shared/models/entidades';
import { TipoDependente } from 'app/shared/models/comum/tipo-dependente';
import { DadoComboDTO } from 'app/shared/models/dtos';
import { TipoBeneficiarioDTO } from 'app/shared/models/dto/tipo-beneficiario';
import { TipoBuscaMotivoSolicitacao } from 'app/shared/models/tipo-busca-motivo-solicitacao';

@Component({
    selector: 'asc-etapa-tipo-titular',
    templateUrl: './etapa-tipo-titular.component.html',
    styleUrls: ['./etapa-tipo-titular.component.scss'],
    animations: [...fadeAnimation] 
})
export class EtapaTipoTitularComponent {

    @Output()
    readonly beneficiarioDependenteModel = new EventEmitter<BeneficiarioDependenteFormModel>();

    @Output()
    readonly tipoDependenteModel = new EventEmitter<TipoDependente>();

    @Output()
    readonly beneficiarioModel = new EventEmitter<Beneficiario>();

    @Input()
    routerLinkToBack: string;

    @Input()
    stepper: CdkStepper;

    @Input()
    set checkRestart(subject: Subject<void>) {
        subject.subscribe(() => this.formularioSolicitacao.reset());
    }

    @Input()
    idTipoProcesso: number;

    tipoDependente: TipoDependente;

    beneficiarioTitular: Beneficiario = null;

    showProgress = false;

    private dependente: BeneficiarioDependenteFormModel;
    private idTipoBeneficiario: number;

    readonly TIPO_PROCESSO = 15;
    readonly CARREGAR_POR_ID_TIPO_PROCESSO = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_ID_TIPO_PROCESSO;
    
    @Input() tipoDependenteCompleto: TipoBeneficiarioDTO;

    readonly formularioSolicitacao = new FormGroup({
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        matricula: new FormControl(null),
        idMotivoSolicitacao: new FormControl(null, Validators.required)
    });

    sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'Masculino',
        label: "Masculino"
    }, {
        value: 'F',
        descricao: 'Feminino',
        label: "Feminino"
    }];

    constructor(
        private messageService: MessageService,
        private service: BeneficiarioService
    ) {
        this.getDadosBeneficiarioTitular(this.matricula);
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    protected getDadosBeneficiarioTitular(matricula: string) {
        this.service.consultarBeneficiarioAtivoPorMatricula(matricula).subscribe(
            (existeAdesao: Beneficiario) => {
                if (existeAdesao) {
                    this.messageService.addMsgDanger("Já existe uma adesão para a matrícula em questão");
                    this.stepper.previous();
                } else {
                    this.service.verificarSeEmpregadoEstaAtivoPorMatricula(matricula).subscribe(
                        (funcionarioAtivo: boolean) => {
                             if (funcionarioAtivo) {
                                this.service.consultarTitularPorMatricula(matricula, true).subscribe(
                                    (beneficiario: Beneficiario) => {
                                      if (beneficiario) {
                                        this.beneficiarioTitular = beneficiario;
                                      }
                                    },
                                    (err) => {
                                      this.messageService.addMsgDanger(err.error);
                                      console.log("< DEBUG ERRO >");
                                      console.log(err);
                                      console.log(err.message);
                                      this.stepper.previous();
                                    }
                                  )
                             } else {
                                this.messageService.addMsgDanger("O empregado não consta como ativo.");
                                this.stepper.previous();
                             }
                        }
                    );
                }
            },
            (erro) => {
                this.messageService.addMsgDanger(erro.error);
                console.log("< DEBUG ERRO >");
                console.log(erro);
                console.log(erro.message);
                this.stepper.previous();
            }
        );
      }

    obterDescricaoSexo(): string {
        return this.beneficiarioTitular.matricula.sexo == "M" ? 'Masculino' : "Feminino";
    }

    onSubmit(): void {
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.showProgress = true;
            const matricula = this.formularioSolicitacao.get('matricula').value;

            const dependente: BeneficiarioDependenteFormModel = {
                idTipoBeneficiario: this.beneficiarioTitular.tipoDependente.id,
                matricula: somenteNumeros(this.beneficiarioTitular.matricula.matricula.toString()),
                nomeCompleto: this.beneficiarioTitular.nome,
                cpf: this.beneficiarioTitular.matricula.cpf,
                nomeMae: this.beneficiarioTitular.matricula.nomeMae,
                nomePai: this.beneficiarioTitular.matricula.nomePai,
                sexo: this.sexos.filter(s => s.value === this.beneficiarioTitular.matricula.sexo)[0],
                dataNascimento: Util.getDate( this.beneficiarioTitular.matricula.dataNascimento),
                email: this.formularioSolicitacao.get('email').value,
                telefoneContato: somenteNumeros(this.formularioSolicitacao.get('telefoneContato').value),
                estadoCivil:  this.beneficiarioTitular.estadoCivil.codigo,
                idMotivoSolicitacao: this.formularioSolicitacao.get('idMotivoSolicitacao').value
            };
            this.beneficiarioModel.emit(this.beneficiarioTitular);
            this.beneficiarioDependenteModel.emit(dependente);
            this.showProgress = false;
            this.stepper.next();
        } 
    }

}
