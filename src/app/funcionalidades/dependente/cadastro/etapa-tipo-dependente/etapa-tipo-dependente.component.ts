import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject} from 'rxjs';
import {take} from "rxjs/operators";
import {fadeAnimation} from "../../../../shared/animations/faded.animation";

import {AscValidators} from "../../../../shared/validators/asc-validators";
import {somenteNumeros} from "../../../../shared/constantes";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {Util} from "../../../../arquitetura/shared/util/util";
import {BeneficiarioService, MessageService, SessaoService} from "../../../../shared/services/services";
import {Beneficiario} from "../../../../shared/models/entidades";
import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {TipoBeneficiarioDTO} from 'app/shared/models/dto/tipo-beneficiario';

@Component({
    selector: 'asc-etapa-tipo-dependente',
    templateUrl: './etapa-tipo-dependente.component.html',
    styleUrls: ['./etapa-tipo-dependente.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaTipoDependenteComponent {

    @Output()
    readonly beneficiarioDependenteModel = new EventEmitter<BeneficiarioDependenteFormModel>();

    @Output()
    readonly tipoDependenteModel = new EventEmitter<TipoDependente>();

    @Output()
    readonly beneficiarioModel = new EventEmitter<Beneficiario>();

    @Input()
     routerLinkToBack: string

    @Input()
 stepper: CdkStepper;

    @Input()
    set checkRestart(subject: Subject<void>) {
        subject.subscribe(() => this.formularioSolicitacao.reset());
    }

    @Input()
    listaBeneficiarios:Beneficiario[]=[];

    @Input()
    idTipoProcesso: number;

    sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'Masculino',
        label: "Masculino"
    }, {
        value: 'F',
        descricao: 'Feminino',
        label: "Feminino"
    }];

    private idTipoBeneficiario: number;

    tipoDependente: TipoDependente;

    beneficiario: Beneficiario = null;

    CONJUGE_COMPANHEIRO = 3;

    @Input() tipoDependenteCompleto: TipoBeneficiarioDTO;

    readonly formularioSolicitacao = new FormGroup({
        idTipoDependente: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        matricula: new FormControl(null),
    });

    private dependente: BeneficiarioDependenteFormModel;
    showProgress = false;

    constructor(
        private messageService: MessageService,
        private service: BeneficiarioService
    ) {
        this.consultarBeneficiarioUsuarioLogado();
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    get showMatricula(): boolean {
        // TODO: Alterar para flag IC_CASAL_CAIXA
        return this.formularioSolicitacao.get('idTipoDependente') && (this.formularioSolicitacao.get('idTipoDependente').value == 86 || this.formularioSolicitacao.get('idTipoDependente').value == 87);
    }

    tipoDependenteSelecionado(tipo: any): void {
         // TODO: Alterar para flag IC_CASAL_CAIXA
        if (this.formularioSolicitacao.get('idTipoDependente').value == 86 || this.formularioSolicitacao.get('idTipoDependente').value == 87) {
            this.formularioSolicitacao.controls['matricula'].setValidators([Validators.required]);
        } else {
            this.formularioSolicitacao.controls['matricula'].setValidators(null);
            this.formularioSolicitacao.controls['matricula'].reset();
        }
        this.formularioSolicitacao.controls['matricula'].updateValueAndValidity();
        this.tipoDependente = tipo;
        this.tipoDependenteCompleto = tipo;
        this.tipoDependenteModel.emit(this.tipoDependente);
    }

    onSubmit(): void {
        console.log("onSubmit - etapa tipo dependente-dependente");
        console.log(this.dependente);
        console.log("tipoDependente - onSubmit");
        console.log(this.tipoDependente);
        console.log("beneficiario - onSubmit");
        console.log(this.beneficiario);
        console.log("listaBeneficiarios - onSubmit");
        console.log(this.listaBeneficiarios);

        this.validarRegras();
    }

    private validarRegras(){
        console.log(this.isConjugeNaFamilia()); 
        console.log(this.isMatriculaTitular());

        if(!this.isConjugeNaFamilia() && !this.isMatriculaTitular()){
            this.isConjugeEmpregadoCaixaCancelado();
        }
    }

    isConjugeNaFamilia():boolean{
        //- validação se o proposto dependente é do tipo cônjuge/companheiro e o(a) titular 
        // já possui cônjuge/companheiro(a) 
        // (coluna CO_LEGADO_DEPENDENCIA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "C" ou "D") vigente; 
        console.log("isConjugeNaFamilia -> this.tipoDependenteCompleto ");
        console.log(this.tipoDependenteCompleto);
        let retorno = false;
        if((this.tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase() === "C" 
            || this.tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase() === "D" ) ){ 
                
            if(this.recuperarCompanheiroConjuge()){
                let mensagem = "Existe cônjuge/companheiro(a) vigente na família." ;
                console.log('antes chamada message service')
                this.messageService.addMsgDanger(mensagem);
                retorno = true;
            }
        }
        return retorno;
    }

    recuperarCompanheiroConjuge(){
        let beneficiario = null;
        beneficiario = this.listaBeneficiarios.find(bene=>bene.contratoTpdep.tipoDependente.parentesco === 5
            || bene.contratoTpdep.tipoDependente.parentesco === 16);
            
        console.log("recuperarCompanheiroConjuge(){ ---> ");
        console.log(beneficiario);

        return beneficiario;
    }

    isConjugeEmpregadoCaixaCancelado(){
        //- validação se o proposto dependente do tipo casal CAIXA 
        //(coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "1") 
        //é empregado CAIXA (buscar pela matrícula) 
        //cancelado (MOTIVOCANCELAMENTO diferente de 34 - FORMAÇÃO CASAL CAIXA - DEPENDENTE); 
        let matricula = this.formularioSolicitacao.get('matricula').value;

        if(this.tipoDependenteCompleto.casalCaixa && matricula){     
            this.service.consultarPorMatricula(somenteNumeros(matricula.toString())).pipe(
                take(1)
            ).subscribe((beneficiario: Beneficiario) => {
                if (beneficiario!==null) {
                    console.log("beneficiario.motivocancelamento = " + beneficiario.motivocancelamento);
                    if(beneficiario.motivocancelamento && beneficiario.motivocancelamento !== 34 ){
                        let mensagem = "Proposto casal CAIXA não possui condição de titular ativo.";
                        this.messageService.addMsgDanger(mensagem);
                    }else{
                        this.submeter();
                    }
                }
            }, error => {
                this.messageService.showDangerMsg(error.error);
            });
        }else{
            this.submeter();
        }
        
    }

    isMatriculaTitular():boolean{
        //- validação se a matrícula do proposto dependente do tipo casal CAIXA 
        // (coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "1") 
        //é a do(a) próprio(a) titular; 
        let retorno = false;
        if(this.tipoDependenteCompleto.casalCaixa){ 
            let matricula = this.formularioSolicitacao.get('matricula').value;
            console.log("isMatriculaTitular = if("+somenteNumeros(matricula)+" === "+somenteNumeros(this.matricula).slice(0,-1)+")");
            if(somenteNumeros(matricula) === somenteNumeros(this.matricula.slice(0,-1))){
                let mensagem = "Matrícula Titular não permitida.";
                this.messageService.addMsgDanger(mensagem);
                retorno = true;
            }
        }
        return retorno;
    }

    recuperarDependentePorTipoDependente(id: number): Beneficiario{
        let beneficiario = null;
        this.listaBeneficiarios.find(bene=>bene.tipoDependente.id === id);

        return beneficiario;
    }

    private submeter(){
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.idTipoBeneficiario = this.formularioSolicitacao.get('idTipoDependente').value;

            this.showProgress = true;
            const matricula = this.formularioSolicitacao.get('matricula').value;

            if (matricula) {
                this.service.consultarPorMatricula(somenteNumeros(matricula.toString())).pipe(
                    take(1)
                    ).subscribe((beneficiario: Beneficiario) => {
                        const beneficiarioUpperCase = this.toUpperCaseBeneficiario(beneficiario);
                        const dependente: BeneficiarioDependenteFormModel = {
                            idTipoBeneficiario: this.formularioSolicitacao.get('idTipoDependente').value,
                            matricula: somenteNumeros(matricula.toString()),
                            nomeCompleto: beneficiarioUpperCase.nome,
                            cpf: beneficiario.matricula.cpf,
                            nomeMae: beneficiarioUpperCase.matricula.nomeMae,
                            nomePai: beneficiarioUpperCase.matricula.nomePai,
                            sexo: this.sexos.filter(s => s.value === beneficiario.matricula.sexo)[0],
                            dataNascimento: Util.getDate(beneficiario.matricula.dataNascimento),
                            email: this.formularioSolicitacao.get('email').value,
                            telefoneContato: somenteNumeros(this.formularioSolicitacao.get('telefoneContato').value),
                            estadoCivil: beneficiario.estadoCivil.codigo
                        };
                        this.beneficiarioModel.emit(beneficiarioUpperCase);
                        this.beneficiarioDependenteModel.emit(dependente);
                        this.showProgress = false;
                        this.stepper.next();
                    }, error => {
                        this.showProgress = false;
                        this.messageService.showDangerMsg(error.error)
                    });
            } else {
                this.beneficiarioDependenteModel.emit({
                    ...this.dependente,
                    idTipoBeneficiario: this.formularioSolicitacao.get('idTipoDependente').value,
                    email: this.formularioSolicitacao.get('email').value,
                    telefoneContato: somenteNumeros(this.formularioSolicitacao.get('telefoneContato').value)
                });
                this.beneficiarioModel.emit(this.beneficiario);
                this.showProgress = false;
                this.stepper.next();
            }
        }
    }

    consultarBeneficiarioUsuarioLogado() {
        this.service.consultarPorMatricula(somenteNumeros(SessaoService.getMatriculaFuncional())).pipe(
            take(1)
        ).subscribe((beneficiario: Beneficiario) => {
            
            this.beneficiario = beneficiario;
        }, error => {
            this.showProgress = false;
            this.messageService.showDangerMsg(error.error)
        });
    }

    private toUpperCaseBeneficiario(beneficiario: Beneficiario): Beneficiario {
        const upperCaseBeneficiario: Beneficiario = { ...beneficiario }; // Cria uma cópia do objeto
        for (const key in upperCaseBeneficiario) {
            if (typeof upperCaseBeneficiario[key] === 'string') {
                upperCaseBeneficiario[key] = upperCaseBeneficiario[key].toUpperCase(); // Converte para maiúsculas
            }
        }
        return upperCaseBeneficiario;
    }
}
