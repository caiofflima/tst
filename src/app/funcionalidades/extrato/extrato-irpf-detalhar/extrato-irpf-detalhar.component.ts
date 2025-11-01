import { Component, ElementRef, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subscription, take } from "rxjs";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import {Loading} from "app/shared/components/loading/loading-modal.component";

import { MessageService } from "../../../shared/components/messages/message.service";
import { SessaoService, BeneficiarioService } from 'app/shared/services/services';
import { BaseComponent } from "../../../shared/components/base.component";
import { ReembolsoSaudeCaixaService } from 'app/shared/services/comum/reembolso-saude-caixa.service';
import { ReembolsoAGS } from 'app/shared/models/comum/reembolso-ags';
import { ReembolsoAGSService } from 'app/shared/services/comum/reembolso-ags.service';
import { AtendimentoService } from "../../../shared/services/comum/atendimento.service";
import { Atendimento } from "../../../shared/models/comum/atendimento";
import { somenteNumeros } from "../../../shared/constantes";
import * as constantes from '../../../shared/constantes';

import { Beneficiario } from 'app/shared/models/entidades';
import { LancamentoDTO } from 'app/shared/models/comum/lancamento-dto.model';
import { DadosCartaoDTO } from "app/shared/models/comum/dados-cartao-dto.model";



@Component({
    selector: 'asc-extrato-irpf-detalhar',
    templateUrl: './extrato-irpf-detalhar.component.html',
    styleUrls: ['./extrato-irpf-detalhar.component.scss']
})

export class ExtratoIRPFDetalharComponent extends BaseComponent implements OnInit {

    anoBase: number;
    cpf: string = "";
    titular = false;
    matricula: string;
    nome: string = "";
    private documentDefinition: any;

    mostrarReembolsos = false;
    mostrarTitularPagamento = false;

    beneficiarioTitular: Beneficiario;
    beneficiarios: Beneficiario[];
    cartoes: DadosCartaoDTO[];

    titularPagamentosEfetuados: PessoaPagamentoEfetuadoDTO;
    titularReembolso: PessoaReembolsoDTO;

    beneficiariosPagamentosEfetuados: PessoaPagamentoEfetuadoDTO[] = [];

    beneficiariosReembolsos: PessoaReembolsoDTO[] = [];

    private atendimentoSubject: Subscription;

    private _isExpanded = false;

    APIindisponivel:boolean = false;

    @ViewChild('print') printSection: ElementRef;
    dados: any;
    messageErro = "Ocorreu um erro na comunicação com a API";
    alertErro = "Serviço temporariamente indisponível. Tente mais tarde.";


    constructor(
        override readonly messageService: MessageService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly location: Location,
        private reembolsoSaudeCaixaService: ReembolsoSaudeCaixaService,
        private readonly sessaoService: SessaoService,
        private readonly beneficiarioService: BeneficiarioService,
        private reembolsoAGSService: ReembolsoAGSService,
        private readonly atendimentoService: AtendimentoService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(messageService);
    }

    ngOnInit(): void {
        this.anoBase = parseInt(this.activatedRoute.snapshot.queryParams['anoBase']);
        this.matricula = somenteNumeros(this.activatedRoute.snapshot.queryParams['mtr']);

        this.carregarBeneficiario(this.matricula);
    }

    onTabChange(event:any){
            this.mostrarReembolsos = true;
    }

    public get isExpanded() {
        return this._isExpanded;
    }

    public set isExpanded(value: boolean) {
        this._isExpanded = value;
    }

    get matriculaFuncional(): string {
        if (this.matricula && this.matricula.length > 0)
            return this.matricula

        return SessaoService.getMatriculaFuncional();
    }

    get cpfUsuarioLogado() {
        if (this.cpf && this.cpf.length > 0)
            this.cpf

        return this.sessaoService.getUsuario().cpf;
    }

    get nomeLogado() {
        return this.nome ?  this.nome.toUpperCase() : this.sessaoService.getUsuario().nome.toUpperCase();
    }

    carregarAtendimento() {
        if (SessaoService.usuario.menu.map(m => m.label).filter(m => m.includes('Atendimento'))) {

            this.atendimentoService.get().pipe(take(1)).subscribe((atendimento: Atendimento) => {
                if (atendimento) {
                    AtendimentoService.atendimento = atendimento;
                    AtendimentoService.changed.next(atendimento);
                }
            }, (error) => {
                this.messageService.addMsgDanger(error.error);
            });

            this.atendimentoSubject = AtendimentoService.changed.subscribe((atendimento: Atendimento) => {

                this.matricula = null;
                this.nome = null;

                if (atendimento) {
                    this.matricula = somenteNumeros(atendimento.matricula);
                    this.nome = atendimento.nome.toUpperCase();

                }

                this.gerarExtrato();
            }, (error) => {
                this.messageService.addMsgDanger(error.error);
                console.log(error.error);
                console.log(error.message);
            });
        }

    }

    comprovanteIRPFByAno(cpf: string, ano: number) {
        Loading.start();
        this.reembolsoSaudeCaixaService.getComprovanteIRPFPorCPF(cpf, ano).subscribe(res => {
            if (res) {
                this.dados = res;
                Loading.stop();
                this.avisoIndisponibilidadeAPI(null);
            }
        }, (err) => {
            this.avisoIndisponibilidadeAPI(err);
            if(this.APIindisponivel){
                let mensagemErro = this.messageErro+"\r\n"+this.alertErro;
                this.messageService.addMsgDanger(mensagemErro);
    
            }else{
                this.messageService.addMsgDanger(err.error);
            }
            
            console.log(err.error);
            console.log(err.message);
            Loading.stop();
        });
    }

    avisoIndisponibilidadeAPI(err: any){

        if(err === null || err === undefined){
            this.APIindisponivel = false;
        }else if((err.status !== 500 && err.status !== 400 && err.status !== 404) 
            || (err.message.includes(this.messageErro) || err.error.includes(this.messageErro)  || err.status === 524 ) ){
            console.log(this.alertErro);
            this.APIindisponivel = true;
        }
    }
    extrairPagamentosEBeneficiarios(dados: any): any {
        this.titularPagamentosEfetuados = new PessoaPagamentoEfetuadoDTO();
        this.titularReembolso = new PessoaReembolsoDTO();
        this.beneficiariosPagamentosEfetuados = [];
        this.beneficiariosReembolsos = [];
    
        const titularNome = dados.noBeneficiario.toUpperCase();
        const titularCpf = dados.cpf;
        const titularMensalidade = this.getMensalidade(0, titularCpf); // Adicionado CPF na busca
        const titularCoparticipacao = this.getCoparticipacao(0, titularCpf); // Adicionado CPF na busca
    
        this.titularPagamentosEfetuados = new PessoaPagamentoEfetuadoDTO();
        this.titularPagamentosEfetuados.titulo = "Titular";
        this.titularPagamentosEfetuados.cpf = titularCpf;
        this.titularPagamentosEfetuados.nome = titularNome;
        this.titularPagamentosEfetuados.pagamentoEfetuado = new LancamentoDTO(
            0,
            "0",
            this.anoBase,
            titularMensalidade + titularCoparticipacao,
            titularCoparticipacao,
            titularMensalidade,
            "", 
            null
        );
    
        if (this.temMensalidadeComValor(titularMensalidade, titularCoparticipacao)) {
            this.mostrarTitularPagamento = true;
        }
    
        const beneficiarios = [];
        for (const beneficiario of dados.mensalidade) {
            if (Number(beneficiario.nuBeneficiario) !== 0) {
                beneficiarios.push({
                    nome: beneficiario.noBeneficiario.toUpperCase(),
                    mensalidade: this.getMensalidade(Number(beneficiario.nuBeneficiario), beneficiario.cpfBeneficiario), // Adicionado CPF
                    coparticipacao: this.getCoparticipacao(Number(beneficiario.nuBeneficiario), beneficiario.cpfBeneficiario) // Adicionado CPF
                });
    
                let pessoa: PessoaPagamentoEfetuadoDTO;
                pessoa = new PessoaPagamentoEfetuadoDTO();
                pessoa.nome = beneficiario.noBeneficiario.toUpperCase();
                pessoa.titulo = "Dependente";
                pessoa.cpf = beneficiario.cpfBeneficiario;
                let mensalidade = this.getMensalidade(Number(beneficiario.nuBeneficiario), beneficiario.cpfBeneficiario); // Adicionado CPF
                let coparticipacao = this.getCoparticipacao(Number(beneficiario.nuBeneficiario), beneficiario.cpfBeneficiario); // Adicionado CPF
    
                pessoa.pagamentoEfetuado = new LancamentoDTO(
                    0,
                    "0",
                    this.anoBase,
                    mensalidade + coparticipacao,
                    coparticipacao,
                    mensalidade,
                    "",
                    null
                );
    
                this.beneficiariosPagamentosEfetuados.push(pessoa);
            }
        }
    
        return {
            titular: {
                nome: titularNome,
                mensalidade: titularMensalidade > 0 ? titularMensalidade : 0,
                coparticipacao: titularCoparticipacao > 0 ? titularCoparticipacao : 0
            },
            beneficiarios: beneficiarios
        };
    }    

      getMensalidade(nuBeneficiario: number, cpfBeneficiario: string): number {
        let valor = 0;
    
        if (this.dados.mensalidade) {
            const mensalidade = this.dados.mensalidade.find(item =>
                Number(item.nuBeneficiario) === nuBeneficiario &&
                item.cpfBeneficiario === cpfBeneficiario
            );
    
            if (mensalidade !== undefined && mensalidade !== null && !isNaN(mensalidade.totMensalidade)) {
                valor = mensalidade.totMensalidade;
            }
        }
    
        return valor;
    }    

      public getCoparticipacaoByBeneficiario(comparador:string):number{
        const coparticipacao = this.dados.escolhaDirigida.find(
            coparticipacao => coparticipacao.nuBeneficiario === comparador);
        let valor = 0 ;

        if(coparticipacao !==undefined && coparticipacao !== null && !isNaN(coparticipacao.totEscolhaDirigida)){
            valor = coparticipacao.totEscolhaDirigida;
        }

        return valor;
      }

      getCoparticipacao(nuBeneficiario: number, cpfBeneficiario: string): number {
        const coparticipacao = this.dados.escolhaDirigida.find(item =>
            Number(item.nuBeneficiario) === nuBeneficiario &&
            item.cpfBeneficiario === cpfBeneficiario
        );
        let valor = 0;
    
        if (coparticipacao !== undefined && coparticipacao !== null && !isNaN(coparticipacao.totEscolhaDirigida)) {
            valor = coparticipacao.totEscolhaDirigida;
        }
    
        return valor;
    }    
     extrairReembolsos(dados: any): any{
        if(!dados || dados === undefined || ! dados.livreEscolha ||  dados.livreEscolha === undefined || dados.livreEscolha.length == 0)     
        {
            return
        }

        this.mostrarReembolsos = true;
        const titularNome = dados.noBeneficiario.toUpperCase();
        const titularCpf = dados.cpf;
        const titularReembolsoResultado = dados.livreEscolha.find(reembolso => reembolso.cpfBeneficiario === dados.cpf);


        this.titularReembolso = new PessoaReembolsoDTO();
        this.titularReembolso.titulo = "Titular";  
        this.titularReembolso.nome = titularNome.toUpperCase();
        this.titularReembolso.cpf = titularCpf;

        if( this.temReembolsoComValor(titularReembolsoResultado) ){
            let valorApresentado = titularReembolsoResultado.totLivreEscolha;
            let valorReembolso = titularReembolsoResultado.totReembolsado;
            let valorNaoReembolsado = titularReembolsoResultado.totDeducao;
           
            this.titularReembolso.reembolsos.push(new ReembolsoAGS(0, titularNome, null, 0, titularNome, 
            titularCpf, null, null, "", 0, valorNaoReembolsado, valorReembolso, valorApresentado, titularCpf));
        }else{
            this.mostrarReembolsos = false;
        }

        const beneficiariosReembolso = dados.livreEscolha
        .filter(reembolso => reembolso.cpfBeneficiario !== dados.cpf)
        .map(reembolso=> {
            const reembolsoAux = new PessoaReembolsoDTO();
            reembolsoAux.titulo = "Dependente";
            reembolsoAux.nome = reembolso.noBeneficiario.toUpperCase();
            reembolsoAux.cpf = reembolso.cpfBeneficiario;

            if( this.temReembolsoComValor(reembolso) ){
                let valorApresentado = reembolso.totLivreEscolha;
                let valorReembolso = reembolso.totReembolsado;
                let valorNaoReembolsado = reembolso.totDeducao;
                reembolsoAux.reembolsos.push(new ReembolsoAGS(0, reembolso.noBeneficiario.toUpperCase(), null, 0, 
                reembolso.noPrestador, reembolso.nuCPFCNPJ, null, null, "", 0, valorNaoReembolsado, 
                valorReembolso, valorApresentado, reembolso.cpfBeneficiario));
        }

            return reembolsoAux;
        });


        this.beneficiariosReembolsos = beneficiariosReembolso;

        return {
          titular: { ...titularReembolsoResultado },
          beneficiarios: beneficiariosReembolso
        };
      }

      temReembolsoComValor(reembolso:any):boolean{
        if(reembolso && reembolso.totLivreEscolha && reembolso.totReembolsado && reembolso.totDeducao){
            if(reembolso.totLivreEscolha>0 || reembolso.totReembolsado>0 || reembolso.totDeducao>0)
                return true;
        }
        return false;
      }

      temMensalidadeComValor(mensalidade:number, coparticipacao:number):boolean{
        if(mensalidade && coparticipacao){
            if(mensalidade>0 || coparticipacao>0)
                return true;
        }
        return false;
      }

    carregarBeneficiario(matricula: string) {

        this.beneficiarioService.consultarPorMatricula(matricula).subscribe(res => {
            this.beneficiarioTitular = res;
            this.cpf = this.beneficiarioTitular.matricula.cpf;
            this.nome = this.beneficiarioTitular.nome.toUpperCase();

            if (this.matricula === SessaoService.getMatriculaFuncional()) {
                this.carregarAtendimento();
            } else {
                this.gerarExtrato();
            }

        }, (err) => {
            console.log("Matricula: carregarBeneficiario( " + matricula+" )");
            console.log(err.error);
            console.log(err.message);
            this.messageService.addMsgDanger(err.error);
            if (this.matricula === SessaoService.getMatriculaFuncional()) {
                this.carregarAtendimento();
            } else {
                this.gerarExtrato();
            }
        });
    }

    
    gerarExtrato() {

        if(this.cpf && this.cpf.length > 0){
            this.comprovanteIRPFByAno(this.cpf, this.anoBase);
        }else{
            this.comprovanteIRPFByAno(this.cpfUsuarioLogado, this.anoBase);
        }
    }
   
    carregarCartoes(cpf:string) {

        this.reembolsoSaudeCaixaService.getDadosCartaoPorCPF(cpf).subscribe(res => {
            this.cartoes = res;

            this.comprovanteIRPFByAno(cpf, this.anoBase);
        }, (err) => {
            console.log("getDadosCartaoPorCPF : " + cpf);
            console.log(err.error);
            console.log(err.message);
            this.messageService.addMsgDanger(err.error);
        });
    }

    getCpfCartao(chave:string):string{
        let cpf = "";

        if(this.cartoes){
            let encontrado =  this.cartoes.find(b=>b.codigoTipoDependente === chave);
            if(encontrado){
                cpf = encontrado.cpf;
            }
        }

        return cpf;
    }

    printObject(obj:any){
        for(const p in obj){
            console.log(p, obj[p]);
        }
    }

    getBeneficiarioByCpf(chave:string):any{
        if(this.beneficiarios){
            return this.beneficiarios.find(b=>b.cpf === chave);
        }
        return null;
    }

    voltar(): void {
        this.router.navigate(['meus-dados/financeiro/extrato-irpf']);
    }

    timeToWait(): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                this.funcaoImprimir();
                resolve();
            }, 2000);
        });
    }

    stopTimeToWait(): Promise<void> {
        return new Promise<void>(resolve => {
            setTimeout(() => {
                Loading.stop()
                resolve();
            }, 2000);
        });
    }

    imprimir() {
        if (this.isExpanded) {
            this.funcaoImprimir();
        } else {
            this.isExpanded = true;
            this.timeToWait().then(() => {
                console.log("Aguardando ajuste para impressão.")
            });
        }
    }

    funcaoImprimir() {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <style type="text/css" media="print">
              #noprint {
                display: none;
                }
                body {
                    font-family: Caixa Std Book, "Helvetica Neue", sans-serif;

                }
                h3 {
                    color: #005DA8;
                    border-left: 6px solid #f59300;
                    font-size: 24px;
                    line-height: 34px;
                    margin-bottom: 5px;
                    padding: 0px 0px 0px 16px;
                    width: 100%;
                }
                #cabecalho {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .blocks-work {
                    margin-top: 10px;
                    border-left: 6px solid #54BBAB;
                    padding-left: 16px;
                    margin-bottom: 20px;
                }
                .blocks-work p span:first-child {
                    color: #54BBAB;
                    font-weight: bold;
                    font-size: 20px;
                }
                .blocks-work p span {
                    font-weight: bold !important;
                }

                .blocks-info {
                    background-color: aliceblue;
                    padding: 1.5em 1em 0.5em;
                    border-radius: 4px;
                    border: 1px solid #005da8;
                    margin-bottom: 20px;
                }

                .blocks-info table {
                    border-spacing: 0 !important;
                }

                .blocks-info table th, .blocks-info table td {
                    font-size: 11px;
                }

                .blocks-info table th, .blocks-info table td {
                    border: 1px solid #000;
                    padding: 0.2em 0.5em;
                }

                .form-columns, .form-row {
                    margin-bottom: 30px;
                }

                .form-columns div {
                    margin-bottom: 20px;
                }

                .blocks-title {
                    color: #005DA8;
                    font-size: 20px;
                    border-radius: 4px;
                    margin: 0 0 10px!important;
                }
                </style>
            </head>
            <body onload="window.print();window.close()">
            ${printContents}
            </body>
          </html>`
        );
        popupWin.document.close();
    }

    carregarDados(){
        const pagamentosEBeneficiarios = this.extrairPagamentosEBeneficiarios(this.dados);
        const reembolsos = this.extrairReembolsos(this.dados);
    }

    async gerarPDF(isImprimir: boolean) {
        this.carregarDados();

        let tituloImagem = "Comprovante de Rendimento Pagos e de\n";
        tituloImagem += " Imposto sobre a Renda Retido na Fonte\n";
        tituloImagem += "       Ano calendário de " + (this.anoBase - 1) + "\n";
        tituloImagem += "         Exercicio de " + this.anoBase;

        this.documentDefinition = {
            content: [
                {
                    table: {
                        widths: ['*', '*'],
                        body: [
                            [
                                {
                                    image: await this.getBase64ImageFromURL("../assets/images/logo-saude.png"),
                                    width: 140,
                                    height: 70,
                                    alignment: 'center',
                                    valign: 'middle'
                                },
                                {
                                    text: tituloImagem, // texto com quebras de linha
                                    style: 'cellTextTitulo',
                                },
                            ],
                            [
                                {
                                    text: 'Fonte pagadora pessoa jurídica ou pessoa física',
                                    style: 'cellTextStrong',
                                    colSpan: 2,
                                    border: [false, true, false, true]
                                }
                            ],
                            [
                                {
                                    text: 'NOME/CNPJ: CAIXA ECONÔMICA FEDERAL  00.360.305/0001-04',
                                    style: 'cellTextStrong',
                                    colSpan: 2,
                                }
                            ],
                            [
                                {
                                    text: 'Pessoa física beneficiária dos rendimentos',
                                    style: 'cellTextStrong',
                                    colSpan: 2,
                                    border: [false, true, false, true]
                                }
                            ],
                            [
                                {
                                    text: 'CPF:\n' + constantes.cpfCnpjUtil.configurarMascara(this.cpf),
                                    style: 'cellText',
                                },
                                {
                                    text: 'NOME:\n' + this.nomeLogado.toUpperCase(),
                                    style: 'cellText',
                                }
                            ],
                        ]
                    }
                },
                { text: '\n' }
            ],
            styles: {
                cellTextTitulo: {
                    fontSize: 12,
                    valign: 'middle',
                    alignment: 'center',
                    bold: true
                },
                cellText: {
                    fontSize: 12,
                },
                cellTextStrong: {
                    fontSize: 12,
                    bold: true
                },
                title: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'left'
                },
                subtitle: {
                    fontSize: 14,
                    alignment: 'left'
                },
                tableHeaderTitulo: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    fillColor: '#f7f7f7',
                    alignment: 'left',
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    fillColor: '#f7f7f7',
                    alignment: 'center',
                },
                tableHeaderLeft: {
                    bold: true,
                    fontSize: 12,
                    color: 'black',
                    fillColor: '#f7f7f7',
                    alignment: 'left',
                },
                tableCell: {
                    fontSize: 12,
                    color: 'black',
                    alignment: 'left'
                },
                tableCellStrong: {
                    fontSize: 12,
                    color: 'black',
                    alignment: 'left',
                    bold: true
                },
                tableCellCenter: {
                    fontSize: 12,
                    color: 'black',
                    alignment: 'center'
                },
                tableCellCenterStrong: {
                    fontSize: 12,
                    color: 'black',
                    alignment: 'center',
                    bold: true
                }
            }
        };

        let listaBeneficiariosPagamentosEfetuados;
        let listaBeneficiariosReembolsos;
        
        if(this.mostrarTitularPagamento)
            listaBeneficiariosPagamentosEfetuados = [].concat(this.titularPagamentosEfetuados, this.beneficiariosPagamentosEfetuados);
        else
            listaBeneficiariosPagamentosEfetuados = this.beneficiariosPagamentosEfetuados;

        if(this.mostrarReembolsos)
             listaBeneficiariosReembolsos = [].concat(this.titularReembolso, this.beneficiariosReembolsos);
        else
             listaBeneficiariosReembolsos = this.beneficiariosReembolsos;

        this.documentDefinition.content.push({ text: 'Pagamentos Efetuados', bold: true });
        listaBeneficiariosPagamentosEfetuados.map(p => {

            const tableColumnsPagamentos = [
                p.titulo + "\n" + p.nome + "   " + constantes.cpfCnpjUtil.configurarMascara(p.cpf), ''
            ];

            const tableDataPagamentos = [
                ['Mensalidade', p.pagamentoEfetuado.valorMensalidade.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })],
                ['Coparticipação', p.pagamentoEfetuado.valorCoparticipacao.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })],
                ['Total', p.pagamentoEfetuado.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })]
            ];

            this.documentDefinition.content.push(
                this.generateTable(
                    tableColumnsPagamentos,
                    tableDataPagamentos
                ),
                { text: '\n\n' }
            );
        });

        const tableColumnsReembolso = [
            'Profissional\nCPF/CNPJ',
            'Valor\nApresentado',
            'Valor\nReembolsado',
            'Valor Não\nReembolsado'
        ];

        if(this.mostrarReembolsos){

                
            this.documentDefinition.content.push({ text: 'Reembolsos', bold: true });

            listaBeneficiariosReembolsos.forEach(b => {

                const tableDataReembolsos = b.reembolsos.map(r => [
                    r.nomeBeneficiario + "\n" + constantes.cpfCnpjUtil.configurarMascara(r.cpf),
                    r.valorApresentado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    r.valorReembolso.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    r.valorNaoReembolsado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                ]);

                tableDataReembolsos.push([
                    "Total",
                    this.somarValores(b.reembolsos, 'valorApresentado').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    this.somarValores(b.reembolsos, 'valorReembolso').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
                    this.somarValores(b.reembolsos, 'valorNaoReembolsado').toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                ]);

                this.documentDefinition.content.push(
                    this.generateTableComTitulo(
                        b.titulo + "\n" + b.nome,
                        tableColumnsReembolso,
                        tableDataReembolsos
                    )
                );


                this.documentDefinition.content.push({ text: '\n' });

            });
        }

        this.documentDefinition.content.push(this.generateRodape());

        if (isImprimir) {

            this.printPDF();
        } else {

            this.generatePDF();
        }

    }

    generatePDF() {
        const pdfDocGenerator = pdfMake.createPdf(this.documentDefinition);
        pdfDocGenerator.download('extrato_' + this.cpf + '_' + this.anoBase + '.pdf');
    }

    printPDF() {
        pdfMake.createPdf(this.documentDefinition).print();
    }

    openPDFBrowser() {
        const pdfDocGenerator = pdfMake.createPdf(this.documentDefinition);
        pdfMake.createPdf(this.documentDefinition).open();
    }

    generateTable(headers: string[], rows: any): any {
        return {
            table: {
                headerRows: 1,
                widths: ['auto', '*'],
                body: [
                    headers.map(header => ({ text: header, style: 'tableHeaderTitulo', colSpan: headers.length })),
                    ...rows.map((row, indice) => {
                        return (indice === (rows.length - 1))
                            ? [{ text: row[0], bold: true }, { text: row[1], alignment: 'right', bold: true }]
                            : [{ text: row[0], bold: true }, { text: row[1], alignment: 'right' }];

                    })
                ],
            },
            layout: {
                vLineWidth: () => 0,
                vLineColor: () => 'transparent',
            }
        };
    }

    generateTableComTitulo(title: string, headers: string[], rows: any): any {
        return {
            table: {
                headerRows: 2,
                widths: ['auto', '*', '*', '*'],
                body: [
                    [{ text: title, style: 'tableHeaderTitulo', colSpan: headers.length }, '', '', ''],
                    headers.map((header, indice) => {
                        return (indice === 0) ? ({ text: header, style: 'tableHeaderLeft' }) : ({ text: header, style: 'tableHeader' });
                    }),
                    ...(rows && rows.length > 0 ? [
                        ...rows.map(
                            (row, indice) => {
                                if(indice===(rows.length-1)){
                                    return row.map(
                                        (cell, celIndex) =>{
                                            if(celIndex === 0)
                                                return { text: cell, style: "tableCellStrong"};
                                            else
                                                return { text: cell, style: "tableCellCenterStrong" };
                                        } 
                                    );
                                }

                                return row.map(
                                           (cell, celIndex) =>{
                                            return this.handleReturnCell(cell,celIndex)
                                        } 
                                );
                            }
                        )
                    ] : []),
                ],
            },
            layout: {
                vLineWidth: () => 0,
                vLineColor: () => 'transparent',
                hAlign: (i) => (i===0) ? 'left' : 'right',
            }
        };
    }

    handleReturnCell(cell:any, celIndex:any){
        if(celIndex === 0)
        return { text: cell, style: "tableCell"};
    else
        return { text: cell, style: "tableCellCenter"};
    }

    generateRodape(): any {

        return {
            table: {
                widths: ['*', '*'],
                body: [
                    [
                        {
                            text: 'Responsável pelas informações',
                            style: 'cellTextStrong',
                            colSpan: 2,
                            border: [false, false, false, true]
                        },
                        {}
                    ],
                    [
                        {
                            text: 'NOME: CAIXA ECONÔMICA FEDERAL',
                            style: 'cellTextStrong'
                        },
                        {
                            text: 'DATA: ' + new Date().toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
                            style: 'cellTextStrong'
                        }
                    ],
                ]
            }
        };
    }

    getBase64ImageFromURL(url: string) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.setAttribute("crossOrigin", "anonymous");

            img.onload = () => {
                let canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                let ctx = canvas.getContext("2d");
                ctx!.drawImage(img, 0, 0);

                let dataURL = canvas.toDataURL("image/png");

                resolve(dataURL);
            };

            img.onerror = error => {
                reject(error);
            };

            img.src = url;
        });
    }

    somarValores(array: any[], propriedade: string): number {
        if (array != null)
            return array.reduce((total, item) => total + item[propriedade], 0);

        return 0;
    }
}

class PessoaPagamentoEfetuadoDTO {
    titulo: string;
    nome: string;
    cpf: string;
    pagamentoEfetuado: LancamentoDTO;
}

class PessoaReembolsoDTO {
    titulo: string;
    nome: string;
    cpf: string;
    reembolsos: ReembolsoAGS[] = [];
}  
