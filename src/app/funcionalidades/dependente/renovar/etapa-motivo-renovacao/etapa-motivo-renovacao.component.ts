import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SessaoService, MessageService,  TipoDependenteService, MotivoCancelamentoService, BeneficiarioService} from "../../../../shared/services/services";
import {Beneficiario, MotivoSolicitacao } from "../../../../shared/models/entidades";
import {CdkStepper} from "@angular/cdk/stepper";
import {Observable, Subscription} from 'rxjs';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {TipoBuscaMotivoSolicitacao} from "../../../../shared/models/tipo-busca-motivo-solicitacao";
import {TipoDependente} from 'app/shared/models/comum/tipo-dependente';
import {AscValidators} from "../../../../shared/validators/asc-validators";
import {FiltroPedidoRegrasInclusao} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao';
import {ProcessoService} from "../../../../shared/services/comum/processo.service";
import { ActivatedRoute } from '@angular/router';
import { DateUtil } from 'app/shared/util/date-util';
import { addDays, differenceInDays, isWithinInterval, subDays } from 'date-fns';
@Component({
    selector: 'asc-etapa-motivo-renovacao',
    templateUrl: './etapa-motivo-renovacao.component.html',
    styleUrls: ['./etapa-motivo-renovacao.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaMotivoRenovacaoComponent implements OnInit, OnDestroy {

    @Output()
    readonly beneficiarioModel = new EventEmitter<Beneficiario>();

    @Output()
    readonly motivoSolicitacaoModel = new EventEmitter<MotivoSolicitacao>();

    @Output()
    readonly tipoDependenteModel = new EventEmitter<TipoDependente>();
    @Input() idBeneficiarioModel: number;

    @Input()
    routerLinkToBack: string

    @Input()
    stepper: CdkStepper;

    @Input()
    checkRestart: Observable<void>;

    sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'MASCULINO',
        label: "MASCULINO"
    }, {
        value: 'F',
        descricao: 'FEMININO',
        label: "FEMININO"
    }];

    idParentesco: number = null;
    sexo: string = null;
    idTipoDeficiencia: number = 0;
    dataNascimento: string = null;
    mensagemIdade: string = "Idade do dependente incompatível com o tipo de beneficiário selecionado.";

    readonly TIPO_PROCESSO = 14;
    readonly CARREGAR_POR_TIPO_PROCESSO = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_TIPO_PROCESSO;
    private eventsSubscription: Subscription;
    showProgress = false;

    beneficiario: Beneficiario;

    idBeneficiario = null;

    isValidoReativacao: boolean = true;
    isValidoCompatibilidade: boolean = true;
    isValidoRenovavel: boolean = true;

    codTipoLegado: number;

    idMotivoRenovacao : number;

    motivoSolicitacao: MotivoSolicitacao

    tipoDependente : TipoDependente;
    _tipoDependente : any;

    @Input() idTipoProcesso;

    constructor(
        private messageService: MessageService,
        readonly processoService: ProcessoService,
        private tipoDependenteService: TipoDependenteService,
        private motivoCancelamentoService: MotivoCancelamentoService,
        private service: BeneficiarioService,
        protected route: ActivatedRoute) {
       
    }

    readonly formularioSolicitacao = new FormGroup({
        idTipoDependente: new FormControl(null, Validators.required),
        idMotivoSolicitacao: new FormControl(null, Validators.required),
        dependente: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        celular: new FormControl(null, AscValidators.telefoneOuCelular),
        matricula: new FormControl(null)
    });
    permiteRenovar = true

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    get showMatricula(): boolean {
        return false;
        // Por solicitação do usuário, esse campo não será mais exibido nessa tela. TODO: Remover do HTLM se confirmada a não utilização do mesmo.
        //return this.formularioSolicitacao.get('idTipoDependente') && this.formularioSolicitacao.get('idTipoDependente').value == 86;
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

    onSubmit(): void {
        if (this.formularioSolicitacao.valid) {
            let idMotivoSolicitacao = this.formularioSolicitacao.get('idMotivoSolicitacao').value;
            this.motivoSolicitacaoModel.emit( this.motivoSolicitacao );
    
            const tipoDependenteId = this.formularioSolicitacao.get('idTipoDependente').value;
            if (tipoDependenteId) {
                this.tipoDependenteService.get(tipoDependenteId).subscribe(
                    tipoDependenteArray => {
                        const tipoDependente = Array.isArray(tipoDependenteArray) ? tipoDependenteArray[0] : tipoDependenteArray;
                        this.tipoDependenteModel.emit(tipoDependente);
                    }
                );
            }
    
            if (this.idTipoProcesso === 12 || this.idTipoProcesso === 13 || this.idTipoProcesso === 14) {
                let filtro = new FiltroPedidoRegrasInclusao(this.idTipoProcesso, this.beneficiario.id, idMotivoSolicitacao, null);
                this.confirmaRegraInclusao(filtro);
            } else {
                this.submeter();
            }
        }
    }    

    private confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):void{
        let retorno = false;
        this.processoService.consultarPedidosRegrasInclusao(filtro).subscribe(res => {
           retorno = res;
           
           if(!res){
                if( !this.idadeIncompativel() ){
                    this.submeter();
                }
            }else{
                this.messageService.addMsgDanger("Tipo de pedido já cadastrado e em aberto para a(o) beneficiária(o).");
            }
        }, err => this.messageService.addMsgDanger(err.error));
    }

    idadeIncompativel():boolean{
        //- validação de compatibilidade entre o tipo de beneficiário 
        //	(colunas NU_IDADE_MINIMA e NU_IDADE_MAXIMA da tabela SSCTB068_TIPO_BENEFICIARIO) 
        //e a idade do beneficiário; 
        const matricula = this.beneficiario.matricula
        
        const benef: any = this.beneficiario
        
        if(matricula.dataNascimento !== null){
            const arrDataNascimento = matricula.dataNascimento.split('-').map(Number)            
            const novaDataNascimento = new Date( arrDataNascimento[0], (arrDataNascimento[1] -1), arrDataNascimento[2] )
            const arrVigencia = benef.cartaoIdentificacaoAtual.dataFinalValidade.split('-').map(Number)
            let vigencia = new Date( arrVigencia[0], (arrVigencia[1] -1), arrVigencia[2] )
            if( this.verificarNascimentoNosProximos30Dias(vigencia, novaDataNascimento, this._tipoDependente) ){
                return false
            }
            else{

                let idade = DateUtil.getIdade( novaDataNascimento );
                
                if(this._tipoDependente.idadeMinima && this._tipoDependente.idadeMaxima){
                    if(idade < this._tipoDependente.idadeMinima  || idade > this._tipoDependente.idadeMaxima){
                        let mensagem = this.mensagemIdade
                        this.messageService.addMsgDanger(mensagem);
                        return true;
                    }
                }else if(this._tipoDependente.idadeMinima){
                    if(idade < this._tipoDependente.idadeMinima){
                        let mensagem = this.mensagemIdade
                        this.messageService.addMsgDanger(mensagem);
                        return true;
                    }
                }else if(this._tipoDependente.idadeMaxima){
                    if(idade > this._tipoDependente.idadeMaxima){
                        let mensagem = this.mensagemIdade
                        this.messageService.addMsgDanger(mensagem);
                        return true;
                    }
                }
            
            }
         }

        return false;
        
    }

    verificarNascimentoNosProximos30Dias(vigencia: Date,nascimento: Date, tipoDependente: any): boolean{
        const expiration = vigencia;
        const birth = nascimento;
        const daysAfterExpiration = 30

        // Calcula a data após o vencimento
        //expiration.setDate(expiration.getDate() - daysAfterExpiration);

        // Calcula a idade na data após o vencimento
        birth.setDate( birth.getDate() - daysAfterExpiration )
        let age = expiration.getFullYear() - birth.getFullYear();
        const m = expiration.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && expiration.getDate() < birth.getDate())) {
            age--;
        }

        // Verifica se a idade está dentro do intervalo especificado
        console.log('idade', age);
        console.log('minina', tipoDependente.idadeMinima);
        console.log('maxina', tipoDependente.idadeMaxima);
        
        return age > tipoDependente.idadeMinima && age < tipoDependente.idadeMaxima;
    }

    

    private submeter(){
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.showProgress = true;
            this.beneficiarioModel.emit({
                ...this.beneficiario,
                email: this.formularioSolicitacao.get('email').value,
                celular: this.formularioSolicitacao.get('celular').value
            });
            this.showProgress = false;
            this.stepper.next();
        }
    }

    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiario = this.toUpperCaseBeneficiario(beneficiario);

        this.beneficiarioModel.emit(this.beneficiario);

        if( this.beneficiario &&  this.beneficiario.motivocancelamento){
            this.validarMotivoCancelamento(this.beneficiario.motivocancelamento);  
        }
              
        if (this.beneficiario) {
            this.formularioSolicitacao.get('idTipoDependente').setValue( this.beneficiario.contratoTpdep.tipoDependente.id);
            this.idBeneficiario =  this.beneficiario.id;
        } else {
            this.formularioSolicitacao.get('idTipoDependente').setValue(null);
            this.idBeneficiario = null;
        }

        this.verificarVigencia( beneficiario )
    }

    verificarVigencia(beneficiario: any){
        this.permiteRenovar = true
        if( beneficiario && beneficiario.cartaoIdentificacaoAtual ){

            const vigencia = beneficiario.cartaoIdentificacaoAtual.dataFinalValidade
            const hoje = new Date();
            
            const diasFaltando = differenceInDays(new Date(vigencia), hoje) + 1
            const diasLimite = 60
            if( diasFaltando > diasLimite ){
                this.permiteRenovar = false
                this.messageService.addMsgDanger(`Renovação permitida com antecedência máxima de ${diasLimite} dias.`);
            }
        }
    }

    motivoSolicitacaoSelecionado(motivoSolicitacao: MotivoSolicitacao) {
        this.motivoSolicitacao = motivoSolicitacao
        this.motivoSolicitacaoModel.emit(motivoSolicitacao);

        if(motivoSolicitacao != undefined){
            this.idMotivoRenovacao = motivoSolicitacao.id;
        }

    }

    tipoDependenteSelecionado(tipo: TipoDependente) {
        this._tipoDependente = tipo
        
        this.tipoDependenteModel.emit(tipo);
        if (tipo) {
            this.codTipoLegado = tipo.tipoLegado;
            this.validarCompatibilidadeRenovacao();
            this.dependenteRenovavel(tipo.renovavel);
            this.dependenteReativavel(tipo.reativavel);
        }
    }

    buscarTipoDependente(id: number){
        if(id){
            this.tipoDependenteService.get(id).subscribe(res=> {
                this.tipoDependente = res[0];
                this.tipoDependente.descricao = this.tipoDependente.descricao.toUpperCase();
             })
        }
    }

    dependenteReativavel(reativavel : boolean){
        if(reativavel == false){
            this.messageService.addMsgDanger("Tipo de beneficiário não suporta reativação.");
        }
    }

    dependenteRenovavel(renovavel : boolean){
        if(renovavel == false){
            this.messageService.addMsgDanger("Tipo de beneficiário não suporta renovação.");
            this.isValidoRenovavel = false;
        }else{
            this.isValidoRenovavel = true;
        }
    }

    validarCompatibilidadeRenovacao() {
        if (this.idMotivoRenovacao === 15) {
            const tipoBeneficiarioAtualId = this.beneficiario.contratoTpdep.tipoDependente.id;
    
            this.tipoDependenteService.consultarTipoDependente(tipoBeneficiarioAtualId).subscribe(tipoAtual => {
                const tipoBeneficiarioAtualLegado = tipoAtual.tipoLegado; // Supondo que tipoLegado esteja em TipoBeneficiarioDTO
                const tipoBeneficiarioNovoLegado = this.codTipoLegado;
    
                if (tipoBeneficiarioAtualLegado !== 1 || tipoBeneficiarioNovoLegado !== 2) {
                    this.messageService.addMsgDanger("Motivo da atualização incompatível com o tipo de beneficiário atual e novo tipo de beneficiário selecionado");
                    this.isValidoCompatibilidade = false;
                } else {
                    this.isValidoCompatibilidade = true;
                }
            });
        } else {
            this.isValidoCompatibilidade = true;
        }
    }
    
    

    validarMotivoCancelamento(idMotivoCancelamento: number){
        this.motivoCancelamentoService.consultarPorId(idMotivoCancelamento).subscribe(res=>{
            if(res.suportareativacao=="N"){
                this.messageService.addMsgDanger("Motivo de cancelamento do dependente não permite reativação.");
                this.isValidoReativacao = false;
            }else{
                this.isValidoReativacao = true;
            }
        })
    }

    formularioValido(): boolean{
        return !(this.formularioSolicitacao.valid && this.isValidoReativacao && this.isValidoCompatibilidade && this.isValidoRenovavel && this.permiteRenovar)
    }

    private toUpperCaseBeneficiario(beneficiario: Beneficiario): Beneficiario {
        const upperCaseBeneficiario: Beneficiario = { ...beneficiario };
        upperCaseBeneficiario.nome = beneficiario.nome.toUpperCase();
        upperCaseBeneficiario.contratoTpdep.tipoDependente.descricao = beneficiario.contratoTpdep.tipoDependente.descricao.toUpperCase();
        upperCaseBeneficiario.matricula.nomeMae = beneficiario.matricula.nomeMae.toUpperCase();
        return upperCaseBeneficiario;
    }

}
