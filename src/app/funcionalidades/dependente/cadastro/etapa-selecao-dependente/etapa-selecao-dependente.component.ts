import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject, Subscription} from 'rxjs';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {somenteNumeros} from "../../../../shared/constantes";
import {Beneficiario, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {AscValidators} from "../../../../shared/validators/asc-validators";
import {Util} from "../../../../arquitetura/shared/util/util";


import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {TipoBuscaMotivoSolicitacao} from "../../../../shared/models/tipo-busca-motivo-solicitacao";
import {FiltroPedidoRegrasInclusao} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao';
import {BeneficiarioService, MessageService, SessaoService} from "../../../../shared/services/services";
import {ProcessoService} from "app/shared/services/comum/processo.service";
import {TipoDependenteService} from 'app/shared/services/comum/tipo-dependente.service';
import {TipoBeneficiarioDTO} from 'app/shared/models/dto/tipo-beneficiario';

@Component({
    selector: 'asc-etapa-selecao-dependente',
    templateUrl: './etapa-selecao-dependente.component.html',
    styleUrls: ['./etapa-selecao-dependente.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaSelecaoDependenteComponent implements OnInit, OnDestroy {

    @Output() readonly beneficiarioModel = new EventEmitter<Beneficiario>();
    @Output() readonly beneficiarioDependenteModel = new EventEmitter<BeneficiarioDependenteFormModel>();
    @Output() readonly tipoDependenteModel = new EventEmitter<TipoDependente>();
    @Output() readonly motivoSolicitacaoModel = new EventEmitter<MotivoSolicitacao>();

    idBeneficiario = null;
    idTipoDependenteAtual = null;

    @Input() routerLinkToBack: string
    @Input() stepper: CdkStepper;
    @Input() checkRestart: Subject<void>;
    @Input() idBeneficiarioModel: number;

    sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'MASCULINO',
        label: "MASCULINO"
    }, {
        value: 'F',
        descricao: 'FEMININO',
        label: "FEMININO"
    }];

    readonly TIPO_PROCESSO = 13;
    readonly CARREGAR_POR_TIPO_PROCESSO = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_TIPO_PROCESSO;

    private eventsSubscription: Subscription;

    beneficiario: Beneficiario;
    tipoDependente: TipoDependente;
    tipoDependenteCompleto: TipoBeneficiarioDTO;
    tipoDependenteNovoCompleto: TipoBeneficiarioDTO;

	readonly INSCRICAO_DEPENDENTE = 11;
    readonly CANCELAMENTO_DEPENDENTE = 12;
    readonly ATUALIZACAO_BENEFICIARIO = 13;
	readonly RENOVACAO_DEPENDENTE = 14

    readonly ENQUADRAMENTO_PDPI_PCD = 9;
    readonly FORMACAO_CASAL_CAIXA = 16;

    @Input() idTipoProcesso;

    readonly formularioSolicitacao = new FormGroup({
        idTipoDependente: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        telefoneContato: new FormControl(null, AscValidators.telefoneOuCelular),
        matricula: new FormControl(null),
        idMotivoSolicitacao: new FormControl(null, Validators.required),
        dependente: new FormControl(null, Validators.required)
    });

    showProgress = false;

    constructor(
        private messageService: MessageService,
        private service: BeneficiarioService,
        readonly processoService: ProcessoService,
        private readonly tipoDependenteService: TipoDependenteService
    ) {
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    ngOnInit(): void {
        if (this.checkRestart) {
            this.eventsSubscription = this.checkRestart.subscribe(() => this.formularioSolicitacao.reset());
        }

        if (this.idBeneficiarioModel) {
            this.service.consultarBeneficiarioPorId(this.idBeneficiarioModel).subscribe( (beneficiario: Beneficiario) => {
              if (beneficiario) {
                  this.beneficiarioSelecionado(beneficiario);
                  this.formularioSolicitacao.controls['dependente'].setValue(beneficiario.id);
                  window.scrollTo(0, 0);
              }
            }, (err) => {
    
              this.messageService.addMsgDanger(err.error);
            });
          }
       
    }

    ngOnDestroy(): void {
        if (this.checkRestart) {
            this.eventsSubscription.unsubscribe();
        }
    }

    get showMatricula(): boolean {
        const tipoCasalCaixa = [4, 86, 87];
        const tipoNaoCasalCaixa = [3, 47, 62, 63];

        if(this.beneficiario !== undefined) {
            this.idTipoDependenteAtual = this.beneficiario.contratoTpdep.tipoDependente.codigo;
        }

        return this.formularioSolicitacao.get('idTipoDependente') 
            && tipoCasalCaixa.includes(this.formularioSolicitacao.get('idTipoDependente').value)
            && tipoNaoCasalCaixa.includes(this.idTipoDependenteAtual);
    }

    tipoDependenteSelecionado(tipo: any) {
        if (this.showMatricula) {
            this.formularioSolicitacao.controls['matricula'].setValidators([Validators.required]);
        } else {
            this.formularioSolicitacao.controls['matricula'].setValue(null);
            this.formularioSolicitacao.controls['matricula'].setValidators(null);
        }
        this.formularioSolicitacao.controls['matricula'].updateValueAndValidity();
        this.tipoDependente = tipo;
        this.tipoDependenteNovoCompleto = tipo;
        this.tipoDependenteModel.emit(this.tipoDependente);
    }

    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiario = beneficiario;
        this.beneficiarioModel.emit(beneficiario);

        if (beneficiario) {
            this.formularioSolicitacao.get('idTipoDependente').setValue(beneficiario.tipoDependente.id);
            this.idBeneficiario = beneficiario.id;
        } else {
            this.formularioSolicitacao.get('idTipoDependente').setValue(null);
            this.idBeneficiario = null;
        }
    }

    motivoSolicitacaoSelecionado(motivoSolicitacao: MotivoSolicitacao) {
        this.motivoSolicitacaoModel.emit(motivoSolicitacao);
    }

    onSubmit(): void {
        console.log("alterar-etapa-selecao-dependente: idTipoProcesso = " +this.idTipoProcesso);

        if(this.idTipoProcesso === this.CANCELAMENTO_DEPENDENTE 
            || this.idTipoProcesso === this.ATUALIZACAO_BENEFICIARIO
             || this.idTipoProcesso === this.RENOVACAO_DEPENDENTE){

            if(this.formularioSolicitacao && this.formularioSolicitacao.valid){
                let idMotivoSolicitacao = this.formularioSolicitacao.get('idMotivoSolicitacao').value;

                let filtro = new FiltroPedidoRegrasInclusao(this.idTipoProcesso, this.beneficiario.id, idMotivoSolicitacao, null);
                console.log('FILTRO');
                console.log(filtro);
                this.confirmaRegraInclusao(filtro);
            }
        }else{
            this.submeter();
        }
 
    }
    

    private confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):void{
        
        console.log("ETAPA_SEL_DEP-confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):boolean{ [retorno]");
        console.log(filtro);
        console.log("this.idTipoProcesso === this.ATUALIZACAO_BENEFICIARIO -> " + (this.idTipoProcesso === this.ATUALIZACAO_BENEFICIARIO));
        console.log(this.beneficiario);
        this.processoService.consultarPedidosRegrasInclusao(filtro).subscribe(res => {

           if(!res){
                if(this.idTipoProcesso === this.ATUALIZACAO_BENEFICIARIO){
                    this.verificaRegrasAlteracao();
                }else{
                    this.submeter();
                }
            }else{
                this.messageService.addMsgDanger("Tipo de pedido já cadastrado e em aberto para a(o) beneficiária(o).");
            }
        }, err => this.messageService.addMsgDanger(err.error)); 
    }

    verificaRegrasAlteracao():void{
        this.tipoDependenteService.consultarTipoDependente(this.beneficiario.tipoDependente.id)
            .subscribe(tipoDependenteCompleto => {

            this.tipoDependenteCompleto = tipoDependenteCompleto;
            
            if(!this.isTipoDependenteAtualizacaoIncompativel()){
                this.isNovoCasalCaixaPermitido();
            }
        }, err => this.messageService.addMsgDanger(err.error));
    }

    isNovoCasalCaixaPermitido():void{
        /*------------------------------------------------------------------
        1.	Validação se o tipo de beneficiário atual não é casal CAIXA 
        (coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "0"), 
        o novo tipo é casal CAIXA (coluna IC_CASAL_CAIXA igual a "1") e o dependente é empregado CAIXA 
        (buscar pela matrícula) cancelado (MOTIVOCANCELAMENTO diferente de 34 - FORMAÇÃO CASAL CAIXA - DEPENDENTE); 
        mensagem: "Proposto casal CAIXA não possui condição de titular ativo..";
        ------------------------------------------------------------------*/
       console.log(this.beneficiario);
       console.log("this.tipoDependenteCompleto - ATUAL");
       console.log(this.tipoDependenteCompleto);
       console.log("this.tipoDependenteNovoCompleto - NOVO");
       console.log(this.tipoDependenteNovoCompleto);
       console.log("this.matricula -------");
       console.log(this.matricula);
  
       if(!this.matricula)
        return
            this.service.consultarPorMatricula(somenteNumeros(this.matricula))
                .subscribe( (beneficiarioCaixa: Beneficiario) =>{
                    console.log("consultarPorMatricula -> beneficiarioCaixa-------");
                    console.log(beneficiarioCaixa);
                if (beneficiarioCaixa !== null) {

                    if(!this.tipoDependenteCompleto.casalCaixa 
                        && this.tipoDependenteNovoCompleto.casalCaixa 
                        && (beneficiarioCaixa.motivocancelamento && beneficiarioCaixa.motivocancelamento !== 34)){
                        
                        let mensagem = "Proposto casal CAIXA não possui condição de titular ativo.";
                        this.messageService.addMsgDanger(mensagem);
                    }else{
                        if(!this.isMatriculaTitular() 
                            && !this.isMotivoAtualizacaoIncompativel()
                            && !this.isFormacaoCasalIncompativel()){
                            this.submeter();
                        }  
                    }
                }

            }, (err) => {
                this.messageService.addMsgDanger(err.error);
            });
       

    }

    isMatriculaTitular():boolean{
        /*
        Validação se a matrícula do proposto dependente do tipo casal CAIXA 
        (coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "1") é a do(a) próprio(a) titular; 
        mensagem: "Matrícula Titular não permitida.";
        */
       let matriculaDependente = this.formularioSolicitacao.get('matricula').value;
        
        if(this.tipoDependenteNovoCompleto.casalCaixa && matriculaDependente){
            if(somenteNumeros(SessaoService.getMatriculaFuncional()).slice(0,-1) === somenteNumeros(matriculaDependente)){
                let mensagem = "Matrícula Titular não permitida.";
                this.messageService.addMsgDanger(mensagem);
                return true;
            }
        }

        return false;
    }

    isTipoDependenteAtualizacaoIncompativel():boolean{
        /*-------------------------------------------------------------
        8.	validação se os tipos de beneficiário atual e novo são de tipos de dependência 
        diferentes (coluna IC_LEGADO_TIPO da tabela SSCTB068_TIPO_BENEFICIARIO): > de 1 para 2 e CO_LEGADO_DEPENDENCIA = "F"; 
        mensagem: "Motivo da atualização incompatível com o tipo de beneficiário selecionado. Para renovação de filho(a)/enteado(a) DIRETO para INDIRETO, utilize o menu [Novo pedido > Beneficiário > Renovação].";
        -------------------------------------------------------------*/
        console.log("isTipoDependenteAtualizacaoIncompativel() ");
        console.log("(this.tipoDependenteCompleto.tipoLegado !== this.tipoDependenteNovoCompleto.tipoLegado)"+(this.tipoDependenteCompleto.tipoLegado !== this.tipoDependenteNovoCompleto.tipoLegado));
        console.log(this.tipoDependenteCompleto.tipoLegado +" !== "+ this.tipoDependenteNovoCompleto.tipoLegado);
        console.log("ATUAL codigoLegadoDependencia ="+this.tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase()+" -- "+
        "NOVO tipoDependenteNovoCompleto ="+ this.tipoDependenteNovoCompleto.codigoLegadoDependencia.toUpperCase())
        console.log("tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase() === F -> "+(this.tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase() ==="F") 
        +",  tipoDependenteNovoCompleto.codigoLegadoDependencia.toUpperCase() === F -> "+ (this.tipoDependenteNovoCompleto.codigoLegadoDependencia.toUpperCase() ==="F"));
        console.log("this.tipoDependenteCompleto.tipoLegado tipoof: " + (typeof this.tipoDependenteCompleto.tipoLegado));
        console.log("tipoDependenteCompleto.tipoLegado: "+(this.tipoDependenteCompleto.tipoLegado === 1) 
            +"tipoDependenteNovoCompleto.tipoLegado: "+(this.tipoDependenteNovoCompleto.tipoLegado  === 2));
        if(this.tipoDependenteCompleto.tipoLegado !== this.tipoDependenteNovoCompleto.tipoLegado ){
            let mensagem = "Alteração do tipo de beneficiário não permitida.";

            if((this.tipoDependenteCompleto.tipoLegado === 1
                && this.tipoDependenteNovoCompleto.tipoLegado  === 2)
                && (this.tipoDependenteCompleto.codigoLegadoDependencia.toUpperCase() ==="F" 
                && this.tipoDependenteNovoCompleto.codigoLegadoDependencia.toUpperCase() ==="F")){
                    mensagem = "Motivo da atualização incompatível com o tipo de beneficiário selecionado. Para renovação de filho(a)/enteado(a) DIRETO para INDIRETO, utilize o menu [Novo pedido > Beneficiário > Renovação].";
            }

            console.log(mensagem);
            this.messageService.addMsgDanger(mensagem);
            return true;
        }
        return false;
    }

    isMotivoAtualizacaoIncompativel():boolean{
        /*-------------------------------------------------------------
        validação de compatibilidade entre o motivo da atualização 
        (motivo 9 - ENQUADRAMENTO PDPI/PCD) e o novo tipo de beneficiário 
        (coluna IC_PDPI da tabela SSCTB068_TIPO_BENEFICIARIO = "0"); 
        mensagem: "Motivo da atualização incompatível com o tipo de beneficiário selecionado.";
        -------------------------------------------------------------*/
        console.log("idMotivoSolicitacao = "+this.formularioSolicitacao.get('idMotivoSolicitacao').value);
        console.log("idTipoDependente = "+this.formularioSolicitacao.get('idTipoDependente').value);
        
        if(this.formularioSolicitacao.get('idMotivoSolicitacao').value === this.ENQUADRAMENTO_PDPI_PCD 
            && !this.tipoDependenteNovoCompleto.pdpi){
            let mensagem = "Motivo da atualização incompatível com o tipo de beneficiário selecionado.";
            this.messageService.addMsgDanger(mensagem);
            return true;
        }
        return false;
    }

    isFormacaoCasalIncompativel():boolean{
        /*---------------------------------------------------------------------------------
        validação de compatibilidade entre o motivo da atualização 
        (motivo 16 - FORMAÇÃO DE CASAL CAIXA) e o novo tipo de beneficiário 
        (coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO = "0"); 
        mensagem: "Motivo da atualização incompatível com o tipo de beneficiário selecionado.";
        ---------------------------------------------------------------------------------*/

        if(this.formularioSolicitacao.get('idMotivoSolicitacao').value === this.FORMACAO_CASAL_CAIXA
            && this.tipoDependenteCompleto.casalCaixa){

            let mensagem = "Motivo da atualização incompatível com o tipo de beneficiário selecionado.";
            this.messageService.addMsgDanger(mensagem);
            return true;
        }
        return false;
    }

    private submeter(): void{
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.showProgress = true;
            const matricula = this.formularioSolicitacao.get('matricula').value;

            if (matricula) {
                this.service.consultarBeneficiarioPorId(this.beneficiario.id).subscribe(
                    (beneficiario: Beneficiario) => {
                        const dependente: BeneficiarioDependenteFormModel = {
                            idTipoBeneficiario: this.formularioSolicitacao.get('idTipoDependente').value,
                            matricula: somenteNumeros(matricula.toString()),
                            nomeCompleto: beneficiario.nome,
                            cpf: beneficiario.matricula.cpf,
                            nomeMae: beneficiario.matricula.nomeMae,
                            nomePai: beneficiario.matricula.nomePai,
                            sexo: this.sexos.filter(s => s.value === beneficiario.matricula.sexo)[0],
                            dataNascimento: Util.getDate(beneficiario.matricula.dataNascimento),
                            email: this.formularioSolicitacao.get('email').value,
                            telefoneContato: somenteNumeros(this.formularioSolicitacao.get('telefoneContato').value),
                            idMotivoSolicitacao: this.formularioSolicitacao.get('idMotivoSolicitacao').value,
                            idBeneficiario: this.beneficiario.id,
                            estadoCivil: this.beneficiario.estadoCivil.id,
                            emailDependente: this.beneficiario.email
                        };
                        this.beneficiarioDependenteModel.emit(dependente);
                        this.showProgress = false;
                        this.stepper.next();
                    }
                );
            } else {
                const dependente: BeneficiarioDependenteFormModel = {
                    idTipoBeneficiario: this.formularioSolicitacao.get('idTipoDependente').value,
                    matricula: somenteNumeros(this.beneficiario.matriculaFuncional.toString()),
                    nomeCompleto: this.beneficiario.nome,
                    cpf: this.beneficiario.matricula.cpf,
                    nomeMae: this.beneficiario.matricula.nomeMae,
                    nomePai: this.beneficiario.matricula.nomePai,
                    sexo: this.sexos.filter(s => s.value === this.beneficiario.matricula.sexo)[0],
                    dataNascimento: Util.getDate(this.beneficiario.matricula.dataNascimento),
                    email: this.formularioSolicitacao.get('email').value,
                    telefoneContato: somenteNumeros(this.formularioSolicitacao.get('telefoneContato').value),
                    idMotivoSolicitacao: this.formularioSolicitacao.get('idMotivoSolicitacao').value,
                    idBeneficiario: this.beneficiario.id,
                    estadoCivil: this.beneficiario.estadoCivil.id,
                    emailDependente: this.beneficiario.email
                };
                this.beneficiarioDependenteModel.emit(dependente);
                this.showProgress = false;
                this.stepper.next();
            }
        }
    }
}
