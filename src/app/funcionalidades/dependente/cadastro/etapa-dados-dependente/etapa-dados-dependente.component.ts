import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkStepper} from "@angular/cdk/stepper";
import {Observable, Subscription} from 'rxjs';
import {fadeAnimation} from "../../../../shared/animations/faded.animation";
import {Dependente, EstadoCivil} from "../../../../shared/models/entidades";
import {AscValidators} from "../../../../shared/validators/asc-validators";
import {DadosDependenteFormModel} from "../../models/dados-dependente-form.model";
import {BeneficiarioDependenteFormModel} from "../../models/beneficiario-dependente-form.model";
import {BaseComponent} from "../../../../shared/components/base.component";
import {Util} from "../../../../arquitetura/shared/util/util";
import {SelectItem} from "primeng/api";
import {DateUtil} from "../../../../shared/util/date-util";
import {ProcessoService} from "../../../../shared/services/comum/processo.service";
import {FiltroPedidoRegrasInclusao} from 'app/shared/models/filtro/filtro-pedido-regras-inclusao';
import {somenteNumeros} from "../../../../shared/constantes";
import {TipoBeneficiarioDTO} from 'app/shared/models/dto/tipo-beneficiario';
import {Beneficiario} from "../../../../shared/models/entidades";
import {MessageService, SessaoService, BeneficiarioService} from "../../../../shared/services/services";
import {TipoDependenteService} from 'app/shared/services/comum/tipo-dependente.service';
import { isAfter, isEqual, parseISO, format } from 'date-fns';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AtendimentoService } from 'app/shared/services/comum/atendimento.service';

@Component({
    selector: 'asc-etapa-dados-dependente',
    templateUrl: './etapa-dados-dependente.component.html',
    styleUrls: ['./etapa-dados-dependente.component.scss'],
    animations: [...fadeAnimation]
})
export class EtapaDadosDependenteComponent extends BaseComponent implements OnInit, OnDestroy {

    @Output()
    readonly dadoDependenteModel = new EventEmitter<DadosDependenteFormModel>();

    @Output()
    readonly estadoCivilModel = new EventEmitter<EstadoCivil>();
    mensagemIdade: string = "Idade  do dependente incompatível com o tipo de beneficiário selecionado.";


    @Input()
    set beneficiarioDependente(dependente: BeneficiarioDependenteFormModel) {
        if (dependente && dependente.matricula) {
            dependente = this.toUpperCaseDependente(dependente);
            this.beneficiarioDependenteFormModel = dependente;
            Object.keys(dependente).forEach(key => {
                if (this.formularioDadosDependente.contains(key)) {
                    const field = this.formularioDadosDependente.get(key);
                    field.setValue(dependente[key]);
                    field.markAsTouched();
                    field.markAsDirty();
                }
            });

            this.formularioDadosDependente.get('sexo').setValue(dependente.sexo ? dependente.sexo.value : null);
            this.formularioDadosDependente.get('sexo').markAsDirty();
            this.formularioDadosDependente.get('idEstadoCivil').setValue(dependente.estadoCivil);
            this.formularioDadosDependente.get('idEstadoCivil').markAsDirty();
            this.validDataNascimento()
        } else {
            this.formularioDadosDependente.reset();
        }
    }

    @Input()
    routerLinkToBack: string

    @Input()
    stepper: CdkStepper;

    @Input() checkRestart: Observable<void>;

    private eventsSubscription: Subscription;

    @Input() idTipoProcesso;

    @Input() tipoDependente: TipoBeneficiarioDTO;

    @Input()
    listaBeneficiarios:Beneficiario[]=[];

    sexos: SelectItem[] = [{
        value: 'M',
        label: "MASCULINO"
    }, {
        value: 'F',
        label: "FEMININO"
    }];

    cpfRequired = false;
    apresentaDeclaracaoNascidoVivo = false;
    readonly matricula = SessaoService.usuario.matriculaFuncional;
    TIPO_PROCESSO_INCLUSAO_DEPENDENTE = 11;
    TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE = 13;
    CONJUGE_COMPANHEIRO = 3;
    COMPANHEIRO_DIRETO = 62;
    dadoDependente:any;

    beneficiarioDependenteFormModel: BeneficiarioDependenteFormModel;
    beneficiarioModel: Beneficiario;
    beneficiarioCarregado: Beneficiario;
    tipoDependenteOriginal: TipoBeneficiarioDTO;

    readonly formularioDadosDependente = new FormGroup({
        nomeCompleto: new FormControl(null, Validators.required),
        cpf: new FormControl(null, [AscValidators.cpf, Validators.required]),
        dataNascimento: new FormControl(null, [Validators.required, AscValidators.dataMenorIgualAtual]),
        nomeMae: new FormControl(null, Validators.required),
        sexo: new FormControl(null, Validators.required),
        nomePai: new FormControl(null),
        declaracaoNascidoVivo: new FormControl(null),
        idEstadoCivil: new FormControl(null, Validators.required),
        emailDependente: new FormControl(null, AscValidators.email()),
    });
    showProgress = false;

    constructor(
        messageService: MessageService,
        readonly processoService: ProcessoService,
        private beneficiarioService: BeneficiarioService,
        private readonly tipoDependenteService: TipoDependenteService,
        private atendimentoService: AtendimentoService,
    ) {
        super(messageService);
    }

    ngOnInit(): void {
        if (this.checkRestart) {
            this.eventsSubscription = this.checkRestart.subscribe(() => this.formularioDadosDependente.reset());
        }
    }

    override ngOnDestroy(): void {
        if (this.checkRestart) {
            this.eventsSubscription.unsubscribe();
        }
    }

    validDataNascimento() {
        const dataNascimento = this.formularioDadosDependente.get('dataNascimento').value;
        if (dataNascimento) {
            let data: Date = Util.getDate(dataNascimento);
            const idade = DateUtil.getIdade(data);

            if (idade <= 14) {
                this.formularioDadosDependente.get('cpf').setValidators([Validators.required, AscValidators.cpf]);
                this.formularioDadosDependente.get('cpf').updateValueAndValidity();
                this.cpfRequired = true;
            } else {
                this.formularioDadosDependente.get('cpf').setValidators(AscValidators.cpf);
                this.formularioDadosDependente.get('cpf').updateValueAndValidity();
                this.cpfRequired = false;
            }

            this.apresentaDeclaracaoNascidoVivo =  this.isDateAfterOrEqualComparison();
            if( this.apresentaDeclaracaoNascidoVivo ){
                this.formularioDadosDependente.get('declaracaoNascidoVivo').setValidators([Validators.required]);
                this.formularioDadosDependente.get('declaracaoNascidoVivo').updateValueAndValidity();
            }else{
                this.formularioDadosDependente.get('declaracaoNascidoVivo').setValidators([]);
                this.formularioDadosDependente.get('declaracaoNascidoVivo').updateValueAndValidity();

            }
        }
    }

    onSubmit(): void {
        //console.log("onSubmit(): void { - ETAPA DADOS DEPENDENTE ");
        this.validDataNascimento()
        if (this.formularioDadosDependente && this.formularioDadosDependente.valid) {

            this.dadoDependente = this.formularioDadosDependente.getRawValue() as BeneficiarioDependenteFormModel;
            let filtro = new FiltroPedidoRegrasInclusao(this.idTipoProcesso, null, null, somenteNumeros(this.dadoDependente.cpf));
            //console.log("dadoDependente ---------- ");
            // console.log(this.dadoDependente);
            // console.log("tipoDependente ---------");
            // console.log(this.tipoDependente);
            // console.log("this.idTipoProcesso ---------" + this.idTipoProcesso);
            // console.log("this.beneficiarioDependenteFormModel ---------");
            // console.log(this.beneficiarioDependenteFormModel);

            if(this.beneficiarioDependenteFormModel && this.beneficiarioDependenteFormModel.matricula){
                this.beneficiarioService.consultarPorMatricula(this.beneficiarioDependenteFormModel.matricula).subscribe(res => {
                    this.beneficiarioCarregado = res;
                    // console.log("this.beneficiarioCarregado");
                    // console.log(this.beneficiarioCarregado);

                    this.tipoDependenteService.consultarTipoDependente(this.beneficiarioCarregado.tipoDependente.id)
                    .subscribe(tipoDependenteCompleto => {

                    this.tipoDependenteOriginal = tipoDependenteCompleto;
                        // console.log("this.tipoDependenteOriginal");
                        // console.log(this.tipoDependenteOriginal);

                        if(this.idTipoProcesso === this.TIPO_PROCESSO_INCLUSAO_DEPENDENTE
                            || this.idTipoProcesso === this.TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE){
                            // console.log("if(this.idTipoProcesso === this.TIPO_PROCESSO_INCLUSAO_DEPENDENTE){");
                            this.confirmaRegraInclusao(filtro);

                        }else{
                            // console.log("this.submeter(); - > ELSE");
                            this.submeter();
                        }
                    }, err => this.messageService.addMsgDanger(err.error));



                }, (err) => {
                    console.log("Matricula: carregarBeneficiario( " + this.beneficiarioDependenteFormModel.matricula +" )");
                    console.log(err.error);
                });
            }else{
                // console.log("if(this.beneficiarioDependenteFormModel && this.beneficiarioDependenteFormModel.matricula){ --");
                this.handleElseOnSubmit(filtro)

            }


        }
    }


    handleElseOnSubmit(filtro:any){
        if(this.idTipoProcesso === this.TIPO_PROCESSO_INCLUSAO_DEPENDENTE
            || this.idTipoProcesso === this.TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE){
            // console.log("if(this.idTipoProcesso === this.TIPO_PROCESSO_INCLUSAO_DEPENDENTE){");
            this.confirmaRegraInclusao(filtro);

        }else{
            // console.log("this.submeter(); - > ELSE");
            this.submeter();
        }
    }



    carregarBeneficiario(){
        this.beneficiarioService.consultarPorMatricula(this.beneficiarioDependenteFormModel.matricula).subscribe(res => {
            this.beneficiarioCarregado = res;
        }, (err) => {
            console.log("Matricula: carregarBeneficiario( " + this.beneficiarioDependenteFormModel.matricula +" )");
            console.log(err.error);
        });
    }

    isConjugeEmpregadoCaixaAtivo():boolean{

        //- validação se o proposto dependente do tipo cônjuge/companheiro
        // (coluna CO_LEGADO_DEPENDENCIA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "C")
        // é empregado CAIXA ativo (buscar pelo CPF);
        let retorno = false;
        if(this.tipoDependente.codigoLegadoDependencia.toUpperCase() === "C" ){
            //&& this.tipoDependente.id === this.CONJUGE_COMPANHEIRO){

            this.beneficiarioService.consultarTitularPorCPF(somenteNumeros(this.dadoDependente.cpf))
                                    .subscribe( res =>{

                if (res!==null && res.motivocancelamento === null) {
                    let mensagem = "Proposto(a) dependente é empregado(a) CAIXA ativo(a). Selecione o tipo de beneficiário específico para formação de Casal CAIXA.";
                    this.messageService.addMsgDanger(mensagem);

                    retorno = true;
                }else{
                    if(this.idTipoProcesso === this.TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE){
                        this.isDependenteCadastradoOutraFamiliaAlteracao();
                    }else{
                        this.isDependenteCadastradoOutraFamilia();
                    }
                }
                return retorno;
            }, (err) => {
                console.log("err.error");
                console.log(err.error);
                this.messageService.addMsgDanger(err.error);
                retorno = false;
                return retorno;
            });
        }else{
            if(this.idTipoProcesso === this.TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE){
                this.isDependenteCadastradoOutraFamiliaAlteracao();
            }else{
                this.isDependenteCadastradoOutraFamilia();
            }
            return retorno;
        }
        return retorno;
    }

    isDependenteNaFamilia():boolean{

        if(this.recuperarDependentePorCPF(somenteNumeros(this.dadoDependente.cpf))){
            let mensagem = "Dependente já cadastrado. Para renovação, utilize o menu [Novo pedido > Beneficiário > Renovação]."
            this.messageService.addMsgDanger(mensagem);
            // console.log(mensagem);

            return true;
        }else{

            return false;
        }
    }

    isMenorIdade(limiteIdade:number){
        // console.log("isMenorIdade(idade:number){ ");
        // - validação se o proposto dependente do tipo cônjuge/companheiro(a)
        // (coluna CO_LEGADO_DEPENDENCIA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "C" ou "D")
        // é menor de 14 anos;

        if((this.tipoDependente.codigoLegadoDependencia.toUpperCase() === "C"
            || this.tipoDependente.codigoLegadoDependencia.toUpperCase() === "D" ) ){
            let idade = this.getAge(this.dadoDependente.dataNascimento);


            if(idade < limiteIdade){
                let mensagem ="";
                if(this.idTipoProcesso === this.TIPO_PROCESSO_ATUALIZACAO_DEPENDENTE){
                    mensagem = "Dependente do tipo cônjuge/companheiro(a) é menor de 14 anos";
                }else{
                    mensagem = "Proposto(a) dependente do tipo cônjuge/companheiro(a) é menor de 14 anos.";
                }
                this.messageService.addMsgDanger(mensagem);
                // console.log(mensagem);
                return true;
            }
        }
        return false;
    }

    getAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    idadeIncompativel():boolean{
        //console.log("idadeIncompativel():boolean{  ");
        //- validação de compatibilidade entre o tipo de beneficiário
        //	(colunas NU_IDADE_MINIMA e NU_IDADE_MAXIMA da tabela SSCTB068_TIPO_BENEFICIARIO)
        //e a idade do beneficiário;
        if(this.dadoDependente.dataNascimento == null){
            return false;
        }

        //let idade = this.calculaIdade(this.dadoDependente.dataNascimento);
        let idade = this.getAge(this.dadoDependente.dataNascimento);

        if(this.erroIdades(idade)){
            return true;
        }

        return false;
    }

    erroIdades(idade:number):boolean{
        if(this.tipoDependente.idadeMinima  && this.tipoDependente.idadeMaxima){
            if(idade < this.tipoDependente.idadeMinima  || idade > this.tipoDependente.idadeMaxima){
                let mensagem = "Idade incompatível com o tipo de beneficiário selecionado.";
                this.messageService.addMsgDanger(mensagem);
                // console.log(mensagem);
                return true;
            }
        }else if(this.tipoDependente.idadeMinima){
            if(idade < this.tipoDependente.idadeMinima){
                let mensagem = "Idade incompatível com o tipo de beneficiário selecionado.";
                this.messageService.addMsgDanger(mensagem);
                // console.log(mensagem);
                return true;
            }
        }else if(this.tipoDependente.idadeMaxima){
            if(idade > this.tipoDependente.idadeMaxima){
                let mensagem = "Idade incompatível com o tipo de beneficiário selecionado.";
                this.messageService.addMsgDanger(mensagem);console.log(mensagem);
                return true;
            }
        }

        return false;
    }

    isDependenteCadastradoOutraFamilia(){
        /* ---------------------- [ INCLUSAO ] ----------------------
            - validação se o proposto dependente do tipo casal CAIXA (coluna IC_CASAL_CAIXA
            da tabela SSCTB068_TIPO_BENEFICIARIO igual a "1") já é casal CAIXA
            em outra família (buscar pelo CPF);
        ------------------------------------------------------------------*/
        //console.log(" isDependenteCadastradoOutraFamilia(){ ---");
        if(this.tipoDependente.casalCaixa){
            this.beneficiarioService.consultarDependentePorCPF(somenteNumeros(this.dadoDependente.cpf))
                                    .subscribe( (beneficiario: Beneficiario) =>{
                                        this.submeter();
            }, error => {
                console.log("[ERRO] isDependenteCadastradoOutraFamilia() " + error.error);
                this.messageService.showDangerMsg(error.error);
            });
        }else{
            // console.log("if(this.tipoDependente.casalCaixa){ -> isDependenteCadastradoOutraFamilia - submeter");
            this.submeter();
        }

    }

    isDependenteCadastradoOutraFamiliaAlteracao(){
        // console.log(" isDependenteCadastradoOutraFamiliaAlteracao(){ ---");
        /* ---------------------- [ ATUALIZACAO ] ----------------------
        validação se o tipo de beneficiário atual não é casal CAIXA
        (coluna IC_CASAL_CAIXA da tabela SSCTB068_TIPO_BENEFICIARIO igual a "0"),
        o novo tipo é casal CAIXA (coluna IC_CASAL_CAIXA igual a "1")
        e o dependente já é casal CAIXA em outra família (buscar pelo CPF);
        mensagem: "Proposto casal CAIXA já cadastrado em outra família.";
        ------------------------------------------------------------------*/
        //!this.tipoDependenteCompleto.casalCaixa
        //&& this.tipoDependenteNovoCompleto.casalCaixa
        if(!this.tipoDependenteOriginal.casalCaixa && this.tipoDependente.casalCaixa){

            this.beneficiarioService.consultarDependentePorCPF(somenteNumeros(this.dadoDependente.cpf))
                                    .subscribe( (beneficiario: Beneficiario) =>{
                                        this.isCPFUsado();
            }, error => {
                console.log("[ERRO] isDependenteCadastradoOutraFamiliaAlteracao() " + error.error);
                this.messageService.showDangerMsg(error.error);
            });
        }else{
            // console.log("if(this.tipoDependente.casalCaixa){ -> isDependenteCadastradoOutraFamiliaAlteracao - submeter");
            this.isCPFUsado();
        }

    }

    isCPFUsado(){
        // console.log("isCPFUsado(){ ----------------- CPF = " + somenteNumeros(this.dadoDependente.cpf));
        /*-----------------------------------------------------------
        validação se o CPF informado pertence a outro beneficiário do Saúde CAIXA
        (comparar data de nascimento e nome da mãe);
        mensagem: "CPF informado pertence a outro beneficiário do Saúde CAIXA.";
        -----------------------------------------------------------*/
        this.beneficiarioService.consultarPorCPF(somenteNumeros(this.dadoDependente.cpf))
        .subscribe( (beneficiario: Beneficiario) =>{
            // console.log("isCPFUsado -  beneficiario: "+somenteNumeros(this.beneficiarioDependenteFormModel.cpf)+" === "+somenteNumeros(this.dadoDependente.cpf));
            // console.log(beneficiario);

            if ( (somenteNumeros(this.beneficiarioDependenteFormModel.cpf) !== somenteNumeros(this.dadoDependente.cpf)) && beneficiario!==null) {
                const dataNascimento = beneficiario.matricula.dataNascimento;
                const dataBD = this.formatarData(this.formularioDadosDependente.get('dataNascimento').value);
                // console.log("beneficiario.matricula.dataNascimento = " + dataNascimento);
                // console.log("this.formularioDadosDependente.get('dataNascimento').value = " + dataBD );
                // console.log("beneficiario.matricula.nomeMae = " + beneficiario.matricula.nomeMae);
                // console.log("this.formularioDadosDependente.get('nomeMae').value = " + this.formularioDadosDependente.get('nomeMae').value);

                // console.log("COMPARAR = "+(dataNascimento === dataBD) );
                if(dataNascimento === dataBD
                    && beneficiario.matricula.nomeMae === this.formularioDadosDependente.get('nomeMae').value){
                    let mensagem = "CPF informado pertence a outro beneficiário do Saúde CAIXA.";
                    this.messageService.addMsgDanger(mensagem);
                    // console.log(mensagem);
                }else{
                    // console.log("isCPFUsado() - submeter - if (beneficiario!==null) { ");
                    this.submeter();
                }
            }else{
                this.submeter();
            }
        }, error => {
            console.log("[ERRO] isCPFUsado() " + error.error);
            this.messageService.showDangerMsg(error.error);
        });
    }

    formatarData(data:Date):string{
        const ano = data.getFullYear();
        const mes = data.getMonth() + 1;
        const dia = data.getDate();

        const mesAjustado = mes < 10? `0${mes}`: mes;
        const diaAjustado = dia < 10? `0${dia}`: dia;

        const dataFormatada = `${ano}-${mesAjustado}-${diaAjustado}`;
        return dataFormatada;
    }


    calculaIdade(dataNascimento: Date):number{
        const dataAtual:Date = new Date();

        const diferencaEmMiliSegundos = dataAtual.getTime() - dataNascimento.getTime();
        const idadeEmAnos = diferencaEmMiliSegundos/(1000*60*60*24*365);

        return idadeEmAnos;
    }

    recuperarDependentePorCPF(cpf: string): Beneficiario{
        let beneficiario = null;
        beneficiario = this.listaBeneficiarios.find(bene=>String(bene.matricula.cpf) === cpf);
        // console.log(this.listaBeneficiarios);
        this.listaBeneficiarios.forEach(elemento => {
           // console.log(String(elemento.matricula.cpf)+" -- String(elemento.matricula.cpf) === cpf)"+(String(elemento.matricula.cpf) === cpf));
        });
        return beneficiario;
    }

    private submeter():void{
      // console.log("ETAPA-DADOS-DEPENDENTE - private submeter():void{  - ");
        this.validDataNascimento()
        if (this.formularioDadosDependente && this.formularioDadosDependente.valid) {

            const dadoDependente = this.formularioDadosDependente.getRawValue() as BeneficiarioDependenteFormModel;

            this.showProgress = true;
            this.dadoDependenteModel.emit({
                ...dadoDependente,
                sexo: this.formularioDadosDependente.get('sexo').value
            });
            this.showProgress = false;
            this.stepper.next();
        }
    }

    verificarCpfEmOutraFamilia(): Observable<boolean> {
        // console.log("verificarCpfEmOutraFamilia() ---");

        const cpfDependente = somenteNumeros(this.dadoDependente.cpf);
        // console.log("CPF do Dependente:", cpfDependente);

        const matricula = AtendimentoService.matricula;

        if (!matricula) {
            // console.error("Matrícula não disponível no atendimento atual.");
            return of(false);
        }

        return this.beneficiarioService.consultarBeneficiarioPorMatricula(matricula).pipe(
            mergeMap((beneficiario: Beneficiario) => {
                if (beneficiario && beneficiario.matricula && beneficiario.matricula.cpf) {
                    const cpfTitular = somenteNumeros(beneficiario.matricula.cpf);
                    // console.log("CPF do Titular:", cpfTitular);

                    if (!cpfTitular) {
                        // console.error("CPF do titular não encontrado ou inválido.");
                        return of(false);
                    }

                    return this.beneficiarioService.verificarCpfFamiliaDiferente(cpfDependente, cpfTitular);
                } else {
                    // console.error("Dados do titular incompletos ou inválidos.");
                    return of(false);
                }
            }),
            map(isDiferente => {
                if (isDiferente) {
                    const mensagem = "Proposto dependente já cadastrado em outra família.";
                    this.messageService.addMsgDanger(mensagem);
                    // console.log(mensagem);
                }
                return isDiferente;
            }),
            catchError(error => {
                console.log("[ERRO] verificarCpfEmOutraFamilia()", error);
                this.messageService.showDangerMsg(error.message);
                return of(false);
            })
        );
    }


    private confirmaRegraInclusao(filtro: FiltroPedidoRegrasInclusao): void {
        // console.log("private confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):void{ ----");
        this.processoService.consultarPedidosRegrasInclusao(filtro).subscribe(respri => {
            // console.log("confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):boolean{ [retorno] = " + respri);

            this.verificarCpfEmOutraFamilia().subscribe(cpfEmOutraFamilia => {
                if (respri === null || !respri) {
                    // console.log("if(!this.isDependenteNaFamilia() && !this.isMenorIdade(14) && !this.idadeIncompativel()){ ---");
                    if (!this.isDependenteNaFamilia() && !cpfEmOutraFamilia
                        && !this.isMenorIdade(14) && !this.idadeIncompativel()) {
                        this.isConjugeEmpregadoCaixaAtivo();
                    }
                } else {
                    this.showDangerMsg("Tipo de pedido já cadastrado e em aberto para a(o) beneficiária(o).");
                }
                // console.log("confirmaRegraInclusao = " + respri);
            });
        }, err => {
            console.log("ERRO confirmaRegraInclusao(filtro:FiltroPedidoRegrasInclusao):boolean{ [retorno] = ");
            this.showDangerMsg(err.error);
        });
    }


    estadoCivilSelecionado(estadoCivil: EstadoCivil) {
        this.estadoCivilModel.emit(estadoCivil);
    }

    previousStep(_: MouseEvent) {
        this.stepper.previous();
    }

    isDateAfterOrEqualComparison(): boolean {
        const comparisonDate: Date = new Date(2010, 0, 1); // 01/01/2010
        try {
            const dtNascimento = format(this.formularioDadosDependente.get('dataNascimento').value, 'yyyy-MM-dd')

            const inputDate = parseISO(dtNascimento);

            // Verificação se a data informada é maior ou igual à data de comparação
            return isAfter(inputDate, comparisonDate) || isEqual(inputDate, comparisonDate);
        } catch (error) {
            return false
        }
      }

      private toUpperCaseDependente(dependente: BeneficiarioDependenteFormModel): BeneficiarioDependenteFormModel {
        const upperCaseDependente: BeneficiarioDependenteFormModel = { ...dependente };
        for (const key in upperCaseDependente) {
            if (typeof upperCaseDependente[key] === 'string') {
                upperCaseDependente[key] = upperCaseDependente[key].toUpperCase();
            }
        }
        return upperCaseDependente;
    }

}
