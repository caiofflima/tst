import { CoparticipacaoDTO } from './../../../shared/models/comum/coparticipacao-dto.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';
import { ReembolsoSaudeCaixaService } from 'app/shared/services/comum/reembolso-saude-caixa.service';
import { LancamentoDTO } from 'app/shared/models/comum/lancamento-dto.model';
import { SelectItem } from 'primeng/api';
import { Beneficiario } from 'app/shared/models/entidades';
import { ReembolsoAGSService } from 'app/shared/services/comum/reembolso-ags.service';
import { ReembolsoAGS } from 'app/shared/models/comum/reembolso-ags';
import { ExtratoLancamentoDTO } from 'app/shared/models/comum/extrato-lancamento-dto.model';
import { ReembolsoDTO } from "app/shared/models/comum/reembolso-dto.model";
import { ReembolsoResumoDTO } from "app/shared/models/comum/reembolso-resumo-dto.model";
import {
    AscModalCoparticipacaoComponent
} from "app/shared/playground/asc-modal-coparticipacao/asc-modal-coparticipacao.component";

import {MensagemPedidoService} from "app/shared/services/comum/mensagem-enviada.service";
import { HandleBeneficiariosDTO } from 'app/shared/models/comum/handle-beneficiarios-dto.model';
import { Option } from 'sidsc-components/dsc-select';

@Component({
    selector: 'app-reembolso',
    templateUrl: './reembolso-detail.component.html',
    styleUrls: ['./reembolso-detail.component.scss']
})
export class ReembolsoDetailComponent implements OnInit {

    lancamentos: LancamentoDTO[] = [];
    lancamentoSelecionando: LancamentoDTO = null;
    lancamentosReembolso: LancamentoDTO[] = [];
    reembolsosAGS: ReembolsoAGS[] = [];

    extratos: ExtratoLancamentoDTO[] = [];
    extratosBase: ExtratoLancamentoDTO[] = [];

    anos: SelectItem[] = [];

    anoLancamento = null;
    anoReembolso = null;
    anoCorrente = null;
    cpfUsuario = null;
    limiteAnos: number = 4;
    optionsAnos: Option[] = [];

    listaReembolsos: ReembolsoDTO[] = [];
    listaReembolsosResumo: ReembolsoResumoDTO[] = [];

    beneficiarioRelatorio: Beneficiario = null;
    beneficiariosComboReembolso: Beneficiario[] = [];
    beneficiariosComboLancamento: Beneficiario[] = [];

    handle: HandleBeneficiariosDTO = null;

    meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    reembolsoResumo: ReembolsoResumoDTO = null;

    mensalidadeExtrato: ExtratoLancamentoDTO;
    coparticipacaoExtrato: ExtratoLancamentoDTO

    NAO_DEBITADO = "Não Debitado";
    DEBITADO_PARCIALMENTE = "Pendente";
    PREVIA = "Prévia";
    EFETUADO = "Debitado";

    APIindisponivel:boolean = false;
    messageErro = "Ocorreu um erro na comunicação com a API";
    alertErro = "Serviço temporariamente indisponível. Tente mais tarde.";

    readonly formularioSolicitacao = new FormGroup({

        dependente: new FormControl(null, Validators.required)
    });

    exibirReembolso: boolean = false;

    constructor(private messageService: MessageService,
        private reembolsoSaudeCaixaService: ReembolsoSaudeCaixaService,
        private reembolsoAGSService: ReembolsoAGSService,
        private beneficiarioService: BeneficiarioService,
        private readonly sessaoService: SessaoService,
        private readonly service: MensagemPedidoService) {
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    voltar(): void {
        window.history.back();
    }

    stylePropsModal = {
        width: '90vw',
        maxWidth: '1200px'
    };

    ngOnInit() {
        this.anoCorrente = new Date().getFullYear();
        this.carregarComboAno();
        this.consultarBeneficiarioPorMatricula(this.matricula);
    }
    public hasEventos(coparticipacao: CoparticipacaoDTO):boolean{
        if(coparticipacao && coparticipacao.eventosDtos && coparticipacao.eventosDtos.length > 0)
            return true;
        else
            return false;    
    }

    clickDetalharCoparticipacao(modalCoparticipacao: AscModalCoparticipacaoComponent, coparticipacao: CoparticipacaoDTO) {
        console.log("==== [INI] clickDetalharCoparticipacao -> modalCoparticipacao = ============");
        console.log(modalCoparticipacao);
        console.log(coparticipacao);
        console.log("==== [FIM] clickDetalharCoparticipacao -> modalCoparticipacao = ===========");
        const lista:any[] = [];
        lista.push(modalCoparticipacao.coparticipacao);

        modalCoparticipacao.infoExibicao = {
            itens: lista,
            index: 0,
            item: lista[0],
            msgItemVazio: "Não existem mensagens."
        };
    }

    carregarComboAno() {
        this.anos.push({ value: this.anoCorrente, label: String(this.anoCorrente) });
        // Lista os [5] ultimos anos (variavel this.limiteAnos)
        for (let i = 1; i <= this.limiteAnos; i++) {
            this.anos.push({ value: this.anoCorrente - i, label: String(this.anoCorrente - i) });
        }
        this.anoLancamento = this.anos.find(obj => obj.value === this.anoCorrente);
        this.anoReembolso = this.anos.find(obj => obj.value === this.anoCorrente);
        
        this.optionsAnos = this.anos.map(ano => {
            return {
            value: ano.value, label: ano.label
        }})
    }

    consultarBeneficiarioPorMatricula(matricula: string) {
        this.anoCorrente = this.anoLancamento.value;
        //console.log("matricula = "+matricula);
        this.beneficiarioService.consultarTitularPorMatricula(matricula).subscribe((beneficiario: Beneficiario) => {
            if (beneficiario) {

                this.beneficiarioRelatorio = beneficiario;
                this.cpfUsuario = beneficiario.matricula.cpf;
                //console.log(beneficiario.matricula.cpf);
                this.buscarLancamentosByAno(this.anoCorrente);
                this.buscarReembolsosResumoPorAno(this.anoCorrente);
            }
        }, (err) => {
            //console.log("[ERRO: sem beneficiario] consultarBeneficiarioPorMatricula(" + matricula + ") this.anoCorrente: " + this.anoCorrente);
            console.log(err.message);
            console.log(err);
            this.messageService.addMsgDanger(err.error);
        });
    }

    extrairLancamentosReembolso(reembolsosResumo:ReembolsoResumoDTO[]):LancamentoDTO[]{
        console.log('reembolsos');
        console.log(reembolsosResumo);
       if (reembolsosResumo != null && reembolsosResumo.length > 0) {
            return reembolsosResumo.map(reembolso => {
                const strMes = this.obterNomeMes(reembolso.mesCompetencia);
                return {
                    mes: reembolso.mesCompetencia,
                    ano: reembolso.ano,
                    strMes: strMes,
                    valor: reembolso.totalReembolso,
                    valorCoparticipacao: 0.0,
                    valorMensalidade: 0.0,
                    status: "",
                    codigosBeneficiarios: reembolso.reembolsos ? reembolso.reembolsos.map(r => r.codigoBeneficiario) : []
                };
            });
       }
       return [];
    }
    lancamentosReembolsoMockado:LancamentoDTO[] = [
        {
        strMes:'Novembro',
        status:'Prévia',
        valor:823.12,
        valorMensalidade:128.1,
        ano:2024,
        codigosBeneficiarios:[123,234],
        mes:11,
        valorCoparticipacao:123.234
        },
        {
        strMes:'Outubro',
        status:'Não Debitado',
        valor:823.12,
        valorMensalidade:128.1,
        ano:2024,
        codigosBeneficiarios:[123,234],
        mes:11,
        valorCoparticipacao:123.234
        },
        {
        strMes:'Setembro',
        status:'Efetuado',
        valor:823.12,
        valorMensalidade:128.1,
        ano:2024,
        codigosBeneficiarios:[123,234],
        mes:11,
        valorCoparticipacao:123.234
        },

    ]
    buscarReembolsosResumoPorAno(ano: number) {
        this.lancamentoSelecionando = null;
        this.anoCorrente = ano;
        if (this.cpfUsuario) {
            this.reembolsoSaudeCaixaService.getReembolsosResumoPorAno(this.cpfUsuario, ano).subscribe(res => {
                //console.log('Reembolso resumo');
                //console.log(res);
                this.listaReembolsosResumo = res;
                this.lancamentosReembolso = this.extrairLancamentosReembolso(res);
                this.avisoIndisponibilidadeAPI(null);
            }, (err) => {
                //console.log("[ERRO: this.cpfUsuario] buscarReembolsosResumoPorAno(" + ano + ") - getReembolsosResumoPorAno(this.cpfUsuario, ano) - this.cpfUsuario: " + this.cpfUsuario);
                console.log(err.message);
                this.messageService.addMsgDanger(err.message);
                this.avisoIndisponibilidadeAPI(err);
            });
        } else {
            //console.log("[ERRO:this.cpfUsuario] buscarReembolsosResumoPorAno(" + ano + ") - getReembolsosResumoPorAno- this.cpfUsuario: " + this.cpfUsuario);
        }
    }

    buscarLancamentosByAno(ano: number) {
        this.lancamentoSelecionando = null;
        this.anoLancamento = ano;

        if (this.cpfUsuario) {
            this.reembolsoSaudeCaixaService.getLancamentosDoAnoPorCPF(this.cpfUsuario, ano).subscribe(res => {
                this.lancamentos = res;
                //console.log("buscarLancamentosByAno("+ano+") ============" );
                //console.log(res);
                this.avisoIndisponibilidadeAPI(null);
            }, (err) => {
                //console.log("[ERRO: this.cpfUsuario] buscarLancamentosByAno("+ano+")" );
                //console.log(err.message);
                //console.log(err.error);
                if(this.APIindisponivel){
                    let mensagemErro = this.messageErro+"\r\n"+this.alertErro;
                    this.messageService.addMsgDanger(mensagemErro);
                }else{
                    this.messageService.addMsgDanger(err.error);
                }
                this.avisoIndisponibilidadeAPI(err);
            });
        } else {
            this.consultarBeneficiarioPorMatricula(this.matricula);
        }
    }

    avisoIndisponibilidadeAPI(err: any){
        if(err === null || err === undefined){
            this.APIindisponivel = false;
        }else if((err.status !== 500 && err.status !== 400 && err.status !== 404) 
            || (err.message.includes(this.messageErro) || err.error.includes(this.messageErro) || err.status === 524 ) ){
            console.log(this.alertErro);
            this.APIindisponivel = true;
        }
    }

    detalharLancamento(lancamento: LancamentoDTO) {
        this.limparPainelReembolso();
        this.limparPainelLancamento();
        this.formularioSolicitacao.reset();
        console.log("[ANTES] detalharLancamento(lancamento: LancamentoDTO) {");
        console.log(this.lancamentoSelecionando);
        this.lancamentoSelecionando = lancamento;
        console.log("[Depois] detalharLancamento(lancamento: LancamentoDTO) {");
        console.log(this.lancamentoSelecionando);
        this.exibirReembolso = false;
        const handleBeneficiario: HandleBeneficiariosDTO = {
            ids: this.lancamentoSelecionando.codigosBeneficiarios
        };

        this.handle = handleBeneficiario;
        //console.log("detalharLancamento - this.cpfUsuario = " + this.cpfUsuario + ",  matricula.cpf = " + this.beneficiarioRelatorio.matricula.cpf);
        //console.log("this.lancamentoSelecionando +++ ");
        //console.log(this.lancamentoSelecionando);
    }

    detalharLancamentoReembolso(lancamento: LancamentoDTO) {
        console.log("[ANTES] detalharLancamentoReembolso(lancamento: LancamentoDTO) {");
        console.log(this.lancamentoSelecionando);
        this.limparPainelReembolso();
        this.formularioSolicitacao.reset();
        this.lancamentoSelecionando = lancamento;
        this.exibirReembolso = true;
        console.log("[DEPOIS] detalharLancamentoReembolso(lancamento: LancamentoDTO) {");
        console.log(this.lancamentoSelecionando);
        const handleBeneficiario: HandleBeneficiariosDTO = {
            ids: this.lancamentoSelecionando.codigosBeneficiarios
        };

        this.handle = handleBeneficiario;
    }
     
    buscarReembolsoResumo(mesBusca: number): ReembolsoResumoDTO { 
        const reembolsoResumoEncontrado = this.listaReembolsosResumo.find(reembolsoResumo => 
            Number(reembolsoResumo.mesCompetencia) === mesBusca
        ); 
        return reembolsoResumoEncontrado;
    } 

    extrairReembolsos(cpf: string, mes: number, ano: number):ReembolsoAGS[]{
         let reembolsoResumo = this.buscarReembolsoResumo(mes);
        if(!reembolsoResumo)
            return null;

        return reembolsoResumo.reembolsos.map(reembolso => {
            return {
                 id: reembolso.codigoBeneficiario,
                 nomeBeneficiario: reembolso.nomeBeneficiario,
                 competencia: this.converteStringToDate(reembolso.dataPagamento),
                 handlePrestador: reembolso.codigoPrestador,
                 nomePrestador: reembolso.nomePrestador,
                 cpfCnpj: reembolso.cpfCnpjPrestador,
                 dataAtendimento: this.converteStringToDate(reembolso.dataAtendimento),
                 dataCredito: this.converteStringToDate(reembolso.dataPagamento),
                 status: "",
                 valorPagto: reembolso.valorPagamento,
                 valorNaoReembolsado: reembolso.valorNaoReembolsado,
                 valorReembolso: reembolso.valorReembolso,
                 valorApresentado: reembolso.valorApresentado,
                 cpf: reembolso.cpfCnpjPrestador
            };
        });
    }

    converteStringToDate(data:string):Date{
        if(data === null || data === undefined){
            return null;
        }
        let parts = data.split('-');
        return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); 
    }
    getReembolsoPorCPFMesAno(cpf: string, mes: number, ano: number) {
        this.reembolsoAGSService.getReembolsoPorCPFMesAno(cpf, mes, ano).subscribe(res => {
            this.reembolsosAGS = res;
        }, (err) => {
            console.log("[ERRO] getReembolsoPorCPFMesAno(" + cpf + ", " + mes + ", " + ano + ") {");
            console.log(err.message);
            this.messageService.addMsgDanger(err.message);
        });
    }

    getLancamentoPorCpfMesAno(cpf: string, mes: number, ano: number, matricula: string, id: number) {
        this.reembolsoSaudeCaixaService.getExtratoDetalhado(cpf, mes, ano, matricula, id).subscribe(res => {
            this.extratosBase = res;
            this.extratos = res;

            this.mensalidadeExtrato = this.extratos.find(extrato=>extrato.tipoLancamento ==="MENSALIDADE");
            this.coparticipacaoExtrato = this.extratos.find(extrato=>extrato.tipoLancamento ==="COPARTICIPACAO");

            this.reembolsoSaudeCaixaService.getCoparticipacoes(cpf, id, ano, mes, matricula).subscribe(res => {

                if (res && res.length > 0) {
                    if(this.coparticipacaoExtrato){ 
                        this.coparticipacaoExtrato.coparticipacoes = res;
                        //console.log("this.coparticipacaoExtrato.coparticipacoes --------------");
                        //console.log(res);
                    }else{ 
                        this.coparticipacaoExtrato = new ExtratoLancamentoDTO(0,0,0,"",null,null,"COPARTICIPACAO",0,0,0,"",[]);
                        this.coparticipacaoExtrato.coparticipacoes = res;
                        //console.log("[CORRECAO COPARTICIPACAO] this.coparticipacaoExtrato.coparticipacoes --------------");
                        //console.log(res);
                    }
                }
            }, (err) => {
                console.log("[ERRO] getCoparticipacoes(" + cpf+ ", "+ id + ", " + ano + ", " + mes+ ", " + matricula + ") {");
                console.log(err.message);
                this.messageService.addMsgDanger(err.message);
            });
            //-------------------------
           
            // console.log(this.mensalidadeExtrato);
            // console.log(this.coparticipacaoExtrato);
             console.log("getLancamentoPorCpfMesAno(" + cpf + ", " + mes + ", " + ano + ") { [ extratos ] ");
             console.log(this.extratos);
             console.log("[ FIM ] this.extratos ++++++++++++++++++++");
        }, (err) => {
            console.log("[ERRO] getLancamentoPorCpfMesAno(" + cpf + ", " + mes + ", " + ano + ") {");
            console.log(err.message);
            this.messageService.addMsgDanger(err.message);
        });
    }

    beneficiarioSelecionadoLancamento(beneficiario: Beneficiario, mes: number, ano: number, matricula?: string) {
        if (beneficiario) {
            //console.log('Beneficiario');
            //console.log(beneficiario);

            if(matricula === null || matricula === undefined)
                matricula = beneficiario.matriculaFuncional

            this.getLancamentoPorCpfMesAno(beneficiario.matricula.cpf, mes, ano, matricula, beneficiario.id);
        }
    }

    beneficiarioSelecionadoReembolso(beneficiario: Beneficiario, mes: number, ano: number) {
        if (beneficiario) {
            this.reembolsoResumo = this.buscarReembolsoResumo(mes);
            let reembolsoAux = this.extrairReembolsos(beneficiario.matricula.cpf, mes, ano); 
            //console.log(reembolsoAux);
            this.reembolsosAGS = reembolsoAux.filter(reembolso=> reembolso.id === beneficiario.id);
            //console.log( this.reembolsosAGS);
            //this.getReembolsoPorCPFMesAno(beneficiario.matricula.cpf, mes, ano);
        }
    }

    limparPainelLancamento() {
        this.extratos = [];
        this.mensalidadeExtrato = null;
        this.coparticipacaoExtrato = null;
        this.exibirReembolso = false;
    }

    limparPainelReembolso() {
        this.reembolsosAGS = null;
        this.exibirReembolso = true;
    }

    obterNomeMes(numeroMes: number): string {
        return this.meses[numeroMes - 1] || '';
    }

    tratamentoValor(valor: number):number{
        if (valor !== null && valor !== undefined)
            return valor;

        return 0;
    }

    getClassByStatus(status: string): string{
        if(!status) {
            return "";
        }
        
        switch(status.toUpperCase()){
            case this.NAO_DEBITADO.toUpperCase(): return "#900000"; 
            case this.DEBITADO_PARCIALMENTE.toUpperCase(): return "#8F5500"; 
            case this.PREVIA.toUpperCase(): return "#4E6178"; 
            case this.EFETUADO.toUpperCase(): return "#0077DB"; 
            default: return "";
        }
    }

    prepararDadosReembolso(){
        if(!this.exibirReembolso){
            this.exibirReembolso = true;
            this.lancamentoSelecionando = null;
        }
    }

}
