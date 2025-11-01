import { MotivoSolicitacaoEnum } from './../../../../shared/enums/motivoCancelamento.enum';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SessaoService, MessageService, BeneficiarioService} from "../../../../shared/services/services";
import {Beneficiario, MotivoSolicitacao} from "../../../../shared/models/entidades";
import {CdkStepper} from "@angular/cdk/stepper";
import {Subject, Subscription} from 'rxjs';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {DadoComboDTO} from "../../../../shared/models/dto/dado-combo";
import {TipoBuscaMotivoSolicitacao} from "../../../../shared/models/tipo-busca-motivo-solicitacao";
import {AscValidators} from "../../../../shared/validators/asc-validators";
import {FiltroPedidoRegrasInclusao} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao';
import {ProcessoService} from "../../../../shared/services/comum/processo.service";

@Component({
    selector: 'asc-etapa-motivo-beneficiario',
    templateUrl: './etapa-motivo-beneficiario.component.html',
    styleUrls: ['./etapa-motivo-beneficiario.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaMotivoDependenteComponent implements OnInit, OnDestroy {

    @Output() readonly beneficiarioModel = new EventEmitter<Beneficiario>();
    @Output() readonly motivoCancelamentoModel = new EventEmitter<MotivoSolicitacao>();
    @Output() readonly dataOcorrenciaModel = new EventEmitter<Date>();
    
    @Input() routerLinkToBack: string
    @Input() stepper: CdkStepper;
    @Input() checkRestart: Subject<void>;
    @Input() idBeneficiarioModel: number;

    @Input() idTipoProcesso;

    idBeneficiario = null;

    sexos: DadoComboDTO[] = [{
        value: 'M',
        descricao: 'Masculino',
        label: "Masculino"
    }, {
        value: 'F',
        descricao: 'Feminino',
        label: "Feminino"
    }];

    readonly TIPO_PROCESSO = 12;
    readonly CARREGAR_POR_TIPO_PROCESSO = TipoBuscaMotivoSolicitacao.CARREGAR_LISTA_POR_TIPO_PROCESSO;
    private eventsSubscription: Subscription;
    showProgress = false;
    hiddenDados = true;
    apresentarCampoDataOcorrencia: Boolean = false;

    beneficiario: Beneficiario;
    motivoCancelamento: MotivoSolicitacao;
    
    idParentesco: number = null;
    sexo: string = null;
    idTipoDeficiencia: number = 0;
    dataNascimento: string = null;

    constructor(
        private messageService: MessageService,
        readonly processoService: ProcessoService,
        private beneficiarioService: BeneficiarioService
    ) {
    }

    readonly formularioSolicitacao:any = new FormGroup({
        motivoCancelamento: new FormControl(null, Validators.required),
        idTipoDependente: new FormControl(null, Validators.required),
        dependente: new FormControl(null, Validators.required),
        email: new FormControl(null, AscValidators.email()),
        celular: new FormControl(null, AscValidators.telefoneOuCelular)
    });

    readonly finalidadeForm = new FormGroup({
        idTipoProcesso: new FormControl(null, [Validators.required]),
        idMotivoSolicitacao: new FormControl(null, [Validators.required]),
    });

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    ngOnInit(): void {
        if (this.checkRestart) {
            this.eventsSubscription = this.checkRestart.subscribe(() => this.formularioSolicitacao.reset());
        }

        if (this.idBeneficiarioModel) {
            this.beneficiarioService.consultarBeneficiarioPorId(this.idBeneficiarioModel).subscribe( (beneficiario: Beneficiario) => {
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
        let idMotivoSolicitacao = this.formularioSolicitacao.get('motivoCancelamento').value;

        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            if(this.idTipoProcesso === 12 || this.idTipoProcesso === 13 || this.idTipoProcesso === 14){
                let filtro = new FiltroPedidoRegrasInclusao(this.idTipoProcesso, this.beneficiario.id, idMotivoSolicitacao, null);
                
                this.confirmaRegraInclusao(filtro);
            }else{
                this.submeter();
            }
            
        }
    }

    private confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):void{
        console.log(filtro);
        let retorno = false;
        this.processoService.consultarPedidosRegrasInclusao(filtro).subscribe(res => {
           retorno = res;
           console.log("ETAPA-MOTIVO-confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):boolean{ [retorno] = " + res);
           if(!res){
                this.submeter();
            }else{
                this.messageService.addMsgDanger("Tipo de pedido já cadastrado e em aberto para a(o) beneficiária(o).");
            }
        }, err => this.messageService.addMsgDanger(err.error));
    }

    submeter():void{
        if (this.formularioSolicitacao && this.formularioSolicitacao.valid) {
            this.showProgress = true;
            this.beneficiarioModel.emit({
                ...this.beneficiario,
                celular: this.formularioSolicitacao.get('celular').value,
                email: this.formularioSolicitacao.get('email').value
            });
            
            this.dataOcorrenciaModel.emit(this.formularioSolicitacao.get('dataOcorrencia') ? 
                    this.formularioSolicitacao.get('dataOcorrencia').value : undefined);

            this.showProgress = false;
            this.stepper.next();
        }
    }

    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiario = this.toUpperCaseBeneficiario(beneficiario);

        this.hiddenDados = false;
        this.beneficiarioModel.emit(beneficiario);

        if (beneficiario) {
            this.formularioSolicitacao.get('idTipoDependente').setValue(beneficiario.tipoDependente.id);
            this.idBeneficiario = beneficiario.id;
        } else {
            this.formularioSolicitacao.get('idTipoDependente').setValue(null);
            this.idBeneficiario = null;
        }
    }

    motivoCancelamentoSelecionado(motivoCancelamento: MotivoSolicitacao) {
        this.motivoCancelamento = motivoCancelamento;
        this.motivoCancelamentoModel.emit(motivoCancelamento);

        this.apresentarCampoDataOcorrenciaSeCabivel(motivoCancelamento);
    }

    private toUpperCaseBeneficiario(beneficiario: Beneficiario): Beneficiario {
        const upperCaseBeneficiario: Beneficiario = { ...beneficiario };
        upperCaseBeneficiario.nome = beneficiario.nome.toUpperCase();
        upperCaseBeneficiario.contratoTpdep.tipoDependente.descricao = beneficiario.contratoTpdep.tipoDependente.descricao.toUpperCase();
        upperCaseBeneficiario.matricula.nomeMae = beneficiario.matricula.nomeMae.toUpperCase();
        return upperCaseBeneficiario;
    }

    private apresentarCampoDataOcorrenciaSeCabivel(motivoCancelamento: MotivoSolicitacao) {
        this.apresentarCampoDataOcorrencia = (motivoCancelamento 
                && (motivoCancelamento.id == MotivoSolicitacaoEnum.SEPARACAO_OU_DIVORCIO 
                    || motivoCancelamento.id == MotivoSolicitacaoEnum.DISSOLUCAO_DE_CASAL_CAIXA
                    || motivoCancelamento.id == MotivoSolicitacaoEnum.FALECIMENTO)
            );
            
console.log("this.apresentarCampoDataOcorrencia: " + this.apresentarCampoDataOcorrencia);
        if (this.apresentarCampoDataOcorrencia) {
            this.formularioSolicitacao.addControl('dataOcorrencia', new FormControl(null, [AscValidators.dataMenorIgualAtual, Validators.required]));
        } else {
            this.formularioSolicitacao.removeControl('dataOcorrencia');
        }
    }
}
