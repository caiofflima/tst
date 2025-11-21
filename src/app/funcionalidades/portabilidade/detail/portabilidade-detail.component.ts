
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Beneficiario } from 'app/shared/models/entidades';
import {Location} from "@angular/common";
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "assets/fonts/vfs_fonts";
import { ActivatedRoute } from '@angular/router';
import { PortabilidadeDTO } from 'app/shared/models/comum/portabilidade-dto.model';
import { Option } from 'sidsc-components/dsc-select';
import { HttpUtil } from 'app/shared/util/http-util';
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-list-portabilidade',
    templateUrl: './portabilidade-detail.component.html',
    styleUrls: ['./portabilidade-detail.component.scss']
})
export class PortabilidadeDetailComponent implements OnInit {

    beneficiario: Beneficiario;
    beneficiarios: Beneficiario[] = []
    options: Option[] = [];
    dadosPortabilidade: PortabilidadeDTO = null;
    tituloCarta: string;
    textoCarta: string;
    dataPorExtenso: string;

    @ViewChild('print') printSection: ElementRef;

    readonly formularioSolicitacao = new FormGroup({

        dependente: new FormControl(null, Validators.required)
    });

    idBeneficiario: number = null;

    constructor(
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute,
        private service: BeneficiarioService) {

    }

    ngOnInit() {
      this.idBeneficiario = this.route.snapshot.params['idBeneficiario'];
      if (this.idBeneficiario) {
        this.service.consultarBeneficiarioPorId(this.idBeneficiario).subscribe( (beneficiario: Beneficiario) => {
          if (beneficiario) {
              this.beneficiarioSelecionado(beneficiario);
              this.formularioSolicitacao.controls['dependente'].setValue(beneficiario.id);
              window.scrollTo(0, 0);
          }
        }, (err) => {

          this.messageService.addMsgDanger(err.error);
        });
      }
      this.tituloCarta = 'DECLARAÇÃO DE PORTABILIDADE/ PERMANÊNCIA';
      this.textoCarta = '';
      this.dataPorExtenso = '';
      this.carregarListOperator()

      this.formularioSolicitacao.get('dependente').valueChanges.subscribe(v=> {
          this.beneficiario = this.beneficiarios.find(b => b.id === v)
          this.beneficiarioSelecionado(this.beneficiario)
        })
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiario = beneficiario;
        this.service.getDadosCartaPortabilidadeBeneficiario(this.beneficiario.id)
            .subscribe(res => {

                this.dadosPortabilidade = res;
                this.gerarTextoCarta();
                this.dataPorExtenso = 'Brasília, '+this.getData(new Date(), 'dia')+' de '+this.getData(new Date(), 'mes')+
                ' de '+this.getData(new Date(), 'ano')+'.'

            }, (err) => {

                this.messageService.addMsgDanger(err.error);
        });
    }

    getCartaDePermanencia_Titular(nomeBeneficiario: string, cpfBeneficiario: string, dtNascBeneficiario: string, sexoBeneficiario: string,
      dtAdesao: Date, dtValidadeCartao: Date, dtValidadePlano: Date): string {
        const texto = 'Declaramos para os devidos fins que '+nomeBeneficiario.toUpperCase()+', CPF '+this.formatarCPF(cpfBeneficiario)+', '+
        this.formatarTextoCartaPorSexo(sexoBeneficiario, 'nascido(a)')+' em ' +this.formatarDataNascimento(dtNascBeneficiario)+', ' + ' é '+
      'titular do plano de saúde oferecido pela CAIXA ECONÔMICA FEDERAL, denominado Saúde CAIXA, plano coletivo '+
      'por adesão, registrado na Agência Nacional de Saúde Suplementar - ANS, sob o nº 31.292-4, ativo com '+
      'comercialização suspensa, plano antigo cadastrado sob número de produto único nº 31.292-4, adaptado '+
      'à Lei dos Planos de Saúde (Lei 9.656/1998), com abrangência nacional e cobertura '+
      'Médica/Ambulatorial/Hospitalar com Obstetrícia; Fonoaudiologia; Terapia Ocupacional; Serviço Social; '+
      'Odontologia; Fisioterapia, Psicologia e Home Care, com acomodação em apartamento individual '+
      'com banheiro privativo. Não foi exigido o cumprimento do período de carência ou cobertura parcial '+
      'temporária. Declaramos ainda que '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'o(a)') +'  '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+' '+
      'está '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'vinculado(a)') +' ao Saúde CAIXA desde '+
       this.formatarData(dtAdesao)+', último cartão vigente até '+this.formatarData(dtValidadeCartao)+', '+
      'não sendo possível sua manutenção junto ao plano de saúde por perda da condição de titularidade no plano em ' +this.formatarData(dtValidadePlano)+ '.\n'+
      'Declaramos para os devidos fins que até a presente data, não há registro de internação '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)')+' '+
       this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+ '.\n' +this.formatarTextoCartaPorSexo(sexoBeneficiario, 'O(A)')+
      ' titular do plano Saúde CAIXA tem mensalidade calculada de 3,5% sobre sua Remuneração Base (RB), '+
      'inclusive sobre o 13º salário, bem como cobrança de R$ 480,00 por dependente direto e indireto '+
      'cadastrado, sendo que a soma da mensalidade '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)')+' titular com a(s) mensalidade(s) do(s) dependente(s) '+
      'direto(s) não pode ultrapassar, no mês de referência, o teto de 7% da RB '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)')+' titular, não havendo '+
      'teto de cobrança no mês de referência, no caso de mensalidade de dependente indireto. Ademais, há '+
      'coparticipação de 30% sobre as despesas com utilização, limitada ao valor total anual de '+
      'R$ 3.600,00 (três mil e seiscentos reais) para titular e seus dependentes. \n'+
      'O Saúde CAIXA declara que as contribuições mensais devidas até a data de exclusão '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)')+' titular e '+
      'dependentes constam adimplidas.';
      return texto;
    }

    getCartaDePermanencia_Dependente(nomeBeneficiario: string, cpfBeneficiario: string, dtNascBeneficiario: string,
      nomeTitular: string, cpfTitular: string, sexoTitular: string, sexoBeneficiario: string, dtAdesao: Date, dtValidadeCartao: Date, dtValidadePlano: Date): string {
        const texto = 'Declaramos para os devidos fins que '+nomeBeneficiario.toUpperCase()+', CPF '+this.formatarCPF(cpfBeneficiario)+', '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'nascido(a)')+' em '+this.formatarDataNascimento(dtNascBeneficiario)+' '+
        'é '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+' dependente '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)')+' '+
        'titular '+nomeTitular.toUpperCase()+', CPF '+this.formatarCPF(cpfTitular)+', do plano de saúde oferecido '+
        'pela CAIXA ECONÔMICA FEDERAL,  denominado Saúde CAIXA, plano coletivo por adesão, registrado sob '+
      'o nº 31.292-4 na ANS - Agência Nacional de Saúde Suplementar, ativo com comercialização suspensa, '+
      'plano antigo cadastrado sob o número de produto único nº 31.292-4, adaptado à Lei dos Planos de '+
      'Saúde (Lei 9.656/1998), com abrangência nacional e cobertura Médica/Ambulatorial/Hospitalar com '+
      'Obstetrícia; Fonoaudiologia; Terapia Ocupacional; Serviço Social; Odontologia; Fisioterapia, '+
      'Psicologia e Home Care, com acomodação em apartamento individual com banheiro privativo. '+
      'Não foi exigido o cumprimento do período de carência ou de cobertura parcial temporária. '+
      'Declaramos ainda que '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'o(a)') +' '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+' '+
      'está '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'vinculado(a)') +' ao Saúde CAIXA desde '+this.formatarData(dtAdesao)+', último cartão '+
      'vigente até '+this.formatarData(dtValidadeCartao)+', não sendo possível sua renovação junto ao plano de saúde por perda da '+
      'condição de dependência.\n '+this.formatarTextoCartaPorSexo(sexoTitular, 'O(A)')+ ' titular do plano Saúde CAIXA tem mensalidade calculada de 3,5% sobre '+
      'sua Remuneração Base (RB), inclusive sobre o 13º salário, bem como cobrança de R$ 480,00 por dependente '+
      'direto e indireto cadastrado, sendo que a soma da mensalidade '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular com a(s) mensalidade(s) do(s) '+
      'dependente(s) direto(s) não pode ultrapassar, no mês de referência, o teto de 7% da RB '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular, não havendo '+
      'teto de cobrança no mês de referência, no caso de mensalidade de dependente indireto. Ademais, há '+
      'coparticipação de 30% sobre as despesas com utilização, limitada ao valor total anual de R$ 3.600,00 '+
      '(três mil e seiscentos reais) para titular e seus dependentes.\n O Saúde CAIXA declara que as '+
      'contribuições mensais devidas até a data de exclusão '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular e dependentes constam adimplidas.';
      return texto;
    }

    getCusteioIntegralCartaDePermanencia_Dependente(nomeBeneficiario: string, cpfBeneficiario: string, dtNascBeneficiario: string,
      nomeTitular: string, cpfTitular: string, sexoTitular: string, sexoBeneficiario: string, dtAdesao: Date, dtValidadeCartao: Date, dtValidadePlano: Date): string {
        const texto = 'Declaramos para os devidos fins que '+nomeBeneficiario.toUpperCase()+', CPF '+this.formatarCPF(cpfBeneficiario)+', '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'nascido(a)')+' em '+this.formatarDataNascimento(dtNascBeneficiario)+', '+
        'é '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)') +' dependente '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular '+nomeTitular.toUpperCase()+', CPF '+this.formatarCPF(cpfTitular)+', do plano de saúde oferecido '+
         'pela CAIXA ECONÔMICA FEDERAL,  denominado Saúde CAIXA, plano coletivo por adesão, registrado sob o '+
      'nº 31.292-4 na ANS - Agência Nacional de Saúde Suplementar, ativo com comercialização suspensa, '+
      'plano antigo cadastrado sob o número de produto único nº 31.292-4, adaptado à Lei dos Planos de '+
      'Saúde (Lei 9.656/1998), com abrangência nacional e cobertura Médica/Ambulatorial/Hospitalar com '+
      'Obstetrícia; Fonoaudiologia; Terapia Ocupacional; Serviço Social; Odontologia; Fisioterapia, Psicologia '+
      'e Home Care, com acomodação em apartamento individual com banheiro privativo. Não foi exigido o '+
      'cumprimento do período de carência ou de cobertura parcial temporária. Declaramos ainda que ' +this.formatarTextoCartaPorSexo(sexoBeneficiario, 'o(a)') +' '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)') +' '+
      'está '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'vinculado(a)') +' ao Saúde CAIXA desde '+this.formatarData(dtAdesao)+', último cartão vigente até '+this.formatarData(dtValidadeCartao)+', '+
      'não sendo possível sua renovação junto ao plano de saúde por perda da condição de dependência.\n '+
      'Declaramos para os devidos fins que até a presente data, não há registro de internação '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)') +' '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+'.\n '
      +this.formatarTextoCartaPorSexo(sexoTitular, 'O(A)')+ ' titular do plano Saúde CAIXA tem mensalidade calculada de 11,67% sobre sua Remuneração Base (RB), '+
      'inclusive sobre o 13º salário, bem como cobrança de R$ 480,00 por dependente direto e indireto '+
      'cadastrado, sendo que a soma da mensalidade '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular com a(s) mensalidade(s) do(s) dependente(s) '+
      'direto(s) não pode ultrapassar, no mês de referência, o teto de 23,33% da RB '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular, não havendo '+
      'teto de cobrança no mês de referência, no caso de mensalidade de dependente indireto. Ademais, há '+
      'coparticipação de 30% sobre as despesas com utilização, limitada ao valor total anual de '+
      'R$ 12.000,00 (doze mil reais) para titular e seus dependentes.\n '+
      'O Saúde CAIXA declara que as contribuições mensais devidas até a data de exclusão '+this.formatarTextoCartaPorSexo(sexoTitular, 'do(a)') +' titular e '+
      'dependentes constam adimplidas. ';
      return texto;
    }

    getCusteioIntegralCartaDePermanencia_Titular(nomeBeneficiario: string, cpfBeneficiario: string, dtNascBeneficiario: string,
       sexoBeneficiario: string, dtAdesao: Date, dtValidadeCartao: Date, dtValidadePlano: Date): string {
        const texto = 'Declaramos para os devidos fins que '+nomeBeneficiario.toUpperCase()+', CPF '+this.formatarCPF(cpfBeneficiario)+', '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'nascido(a)')+' em '+this.formatarDataNascimento(dtNascBeneficiario)+', '+
        'é titular do plano de saúde oferecido pela CAIXA ECONÔMICA FEDERAL, denominado Saúde CAIXA, plano '+
      'coletivo por adesão, registrado na Agência Nacional de Saúde Suplementar - ANS, sob o nº 31.292-4, '+
      'ativo com comercialização suspensa, plano antigo cadastrado sob número de produto único nº 31.292-4, '+
      'adaptado à Lei dos Planos de Saúde (Lei 9.656/1998), com abrangência nacional e cobertura '+
      'Médica/Ambulatorial/Hospitalar com Obstetrícia; Fonoaudiologia; Terapia Ocupacional; Serviço Social; '+
      'Odontologia; Fisioterapia, Psicologia e Home Care, com acomodação em apartamento individual com banheiro '+
      'privativo. Não foi exigido o cumprimento do período de carência ou cobertura parcial temporária. '+
      'Declaramos ainda que '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'o(a)')+ ' '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+ ' está ' +
       this.formatarTextoCartaPorSexo(sexoBeneficiario, 'vinculado(a)')+' ao Saúde CAIXA desde '+this.formatarData(dtAdesao)+', último cartão vigente até '+this.formatarData(dtValidadeCartao)+', '+
      'não sendo possível sua manutenção junto ao plano de saúde por perda da condição de titularidade no plano em '+this.formatarData(dtValidadePlano)+'.\n' +
      'Declaramos para os devidos fins que até a presente data, não há registro de internação '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)') +' ' +
       this.formatarTextoCartaPorSexo(sexoBeneficiario, 'beneficiário(a)')+'.\n O titular do plano Saúde CAIXA tem mensalidade calculada de 11,67% sobre sua Remuneração Base (RB), '+
      'inclusive sobre o 13º salário, bem como cobrança de R$ 480,00 por dependente direto e indireto '+
      'cadastrado, sendo que a soma da mensalidade '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)') +' titular com a(s) mensalidade(s) do(s) dependente(s) '+
      'direto(s) não pode ultrapassar, no mês de referência, o teto de 23,33% da RB '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)') +' titular, não havendo '+
      'teto de cobrança no mês de referência, no caso de mensalidade de dependente indireto. Ademais, há '+
      'coparticipação de 30% sobre as despesas com utilização, limitada ao valor total anual de '+
      'R$ 12.000,00 (doze mil reais) para titular e seus dependentes. \n'+
      'O Saúde CAIXA declara que as contribuições mensais devidas até a data de exclusão '+this.formatarTextoCartaPorSexo(sexoBeneficiario, 'do(a)') +' titular e '+
      'dependentes constam adimplidas.';
      return texto;
    }

    formatarTextoCartaPorSexo(sexo: string, texto: string): string  {
      let textoPorSexo = '';

      switch(sexo != null) {
        case texto == 'nascido(a)': {
          sexo == 'F' ? textoPorSexo = 'nascida' : textoPorSexo = 'nascido';
          break;
        }
        case texto == 'beneficiário(a)': {
          sexo == 'F' ? textoPorSexo = 'beneficiária' : textoPorSexo = 'beneficiário';
          break;
        }
        case texto == 'do(a)': {
          sexo == 'F' ? textoPorSexo = 'da' : textoPorSexo = 'do';
          break;
        }
        case texto == 'o(a)': {
          sexo == 'F' ? textoPorSexo = 'a' : textoPorSexo = 'o';
          break;
        }
        case texto == 'vinculado(a)': {
          sexo == 'F' ? textoPorSexo = 'vinculada' : textoPorSexo = 'vinculado';
          break;
        }
        case texto == 'este(a)': {
          sexo == 'F' ? textoPorSexo = 'esta' : textoPorSexo = 'este';
          break;
        }
        case texto == 'O(A)': {
          sexo == 'F' ? textoPorSexo = 'A' : textoPorSexo = 'O';
          break;
        }
        default: {
          break;
        }
      }
      return textoPorSexo;
    }

    formatarTextoNascimentoPorSexo(sexo: string): string  {
      return sexo == 'M' ? 'nascido' : 'nascida';
    }

    formatarTextoBeneficiarioVinculado(dataCancelamento: Date): string {
      return dataCancelamento !== null ? 'está' : 'esteve';
    }

    formatarData(data:Date):string{
      let dataFormatada = '';

      const textoValido = " (data não informada)";

      if(data) {

        const strData = data.toString();
        const dataArray = strData.split("-");

        const ano = parseInt(dataArray[0]);
        const mes = parseInt(dataArray[1]);
        const dia = parseInt(dataArray[2]);

        const mesAjustado = mes < 10? `0${mes}`: mes;
        const diaAjustado = dia < 10? `0${dia}`: dia;

        dataFormatada = `${diaAjustado}/${mesAjustado}/${ano}`;
      }

      if(dataFormatada == "01/01/2000") {
        return textoValido;
      }
      return  dataFormatada;
    }

    formatarDataNascimento(strData:string):string{
      let dataFormatada = '';
      const dataArray = strData.split("-");

      const textoValido = " (data não informada)";

      const strAno = parseInt(dataArray[0]);
      const strMes = parseInt(dataArray[1])-1;
      const srtDia = parseInt(dataArray[2]);

      const dataValida: Date = new Date(strAno, strMes, srtDia);

      if(dataValida) {
        const ano = dataValida.getFullYear();
        const mes = dataValida.getMonth() + 1;
        const dia = dataValida.getDate();

        const mesAjustado = mes < 10? `0${mes}`: mes;
        const diaAjustado = dia < 10? `0${dia}`: dia;

        dataFormatada = `${diaAjustado}/${mesAjustado}/${ano}`;
      }

      if(dataFormatada == "01/01/2000") {
      return textoValido;
      }
      return dataFormatada;
    }

    formatarTextoAnosDeBeneficio(dtValidadeCartao: Date): string  {
      const hoje = new Date().toDateString();
      let dtComparacao: any;

      if(dtValidadeCartao !== null) {
        dtComparacao = new Date(dtValidadeCartao).toDateString();
      }
      return dtComparacao < hoje  ? 'completou' : 'completará';
    }

    calcularAnosDeBeneficio(dtAdesao: Date, dtValidadePlano: Date): number{
      let dtInicial: any;
      let dtFinal: any;

      if(dtAdesao !== null && dtValidadePlano !== null) {
        dtInicial = new Date(dtValidadePlano);
        dtFinal = new Date(dtAdesao);
      }

      let anos = dtInicial.getFullYear() - dtFinal.getFullYear();
      const mesAtual = dtInicial.getMonth();
      const mesComparacao = dtFinal.getMonth();

      if(mesComparacao > mesAtual || mesComparacao === mesAtual &&
        dtInicial.getDate() < dtFinal.getDate()) {
          anos--;
      }
      return anos;
    }

    getData(data:Date, formatoDesejado: string): any{
      let dataValida: any;

      if(dataValida !== null) {
        dataValida = new Date(data);
      }

      switch(dataValida != null) {
        case formatoDesejado == 'dia': {
          const dia = dataValida.getDate();
          const diaAjustado = dia < 10? `0${dia}`: dia;
          return diaAjustado;
        }
        case formatoDesejado == 'mes': {
          const mes = dataValida.getMonth() + 1;
          const meses = ['janeiro', 'fevereiro', 'março', 'abril',
                         'maio', 'junho', 'julho', 'agosto',
                         'setembro', 'outubro', 'novembro', 'dezembro'];
          const mesAjustado = meses[mes - 1];

          return mesAjustado;
        }
        case formatoDesejado == 'ano': {
          const ano = dataValida.getFullYear();
          return ano;
        }
        default: {
          break;
        }
      }
    }

    formatarCPF(cpf: string): any{
      let cpfFormatado: any;
      if(cpf) {
        let cpfRegExp = (''+ cpf.replace(/\D/g,''));
        let cpfRegExpFormatado = cpfRegExp.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
        cpfFormatado = cpfRegExpFormatado[1]+'.'+cpfRegExpFormatado[2]+'.'+cpfRegExpFormatado[3]+'-'+cpfRegExpFormatado[4];
      }
      return cpfFormatado;
    }

    public gerarTextoCarta() {
        const tipoContrato = 20;

        let nomebeneficiario = this.nomeBeneficiarioTextoCartaSetter()
        let cpfBeneficiario = this.cpfBeneficiarioTextoCartaSetter()
        let dtNascBeneficiario = this.dtNascimentoBeneficiarioTextoCartaSetter()
        let sexoBeneficiario = this.sexoBeneficiarioTextoCartaSetter()
        let nomeTitular = this.nomeTitularTextoCartaSetter()
        let cpfTitular =  this.cpfTitularTextoCartaSetter()
        let sexoTitular = this.sexoTitularTextoCartaSetter()
        let tipoContratoTitular = this.tipoContratoTitularTextoCartaSetter()
        let beneficiarioEhTitular = this.beneficiarioEhTitularTextoCartaSetter()
        let dtAdesao = this.dtAdesaoTextoCartaSetter()
        let dtValidadeCartao = this.dadosPortabilidade.dtValidadeCartao;
        let dtValidadePlano = this.dadosPortabilidade.dtValidadePlano;

        if(tipoContrato == tipoContratoTitular) {
          if (beneficiarioEhTitular == 'Sim') {
            this.textoCarta = this.getCusteioIntegralCartaDePermanencia_Titular(nomebeneficiario, cpfBeneficiario,
              dtNascBeneficiario, sexoBeneficiario, dtAdesao, dtValidadeCartao, dtValidadePlano);
          } else {
            this.textoCarta = this.getCusteioIntegralCartaDePermanencia_Dependente(nomebeneficiario, cpfBeneficiario,
              dtNascBeneficiario, nomeTitular, cpfTitular, sexoTitular, sexoBeneficiario, dtAdesao, dtValidadeCartao, dtValidadePlano);
          }
        } else {
          if (beneficiarioEhTitular == 'Sim') {
            this.textoCarta = this.getCartaDePermanencia_Titular(nomebeneficiario, cpfBeneficiario,
              dtNascBeneficiario, sexoBeneficiario, dtAdesao, dtValidadeCartao, dtValidadePlano);
          } else {
          this.textoCarta = this.getCartaDePermanencia_Dependente(nomebeneficiario, cpfBeneficiario,
              dtNascBeneficiario, nomeTitular, cpfTitular, sexoTitular, sexoBeneficiario, dtAdesao, dtValidadeCartao, dtValidadePlano);
          }
        }

      }

      nomeBeneficiarioTextoCartaSetter(){
        return this.dadosPortabilidade.nomeBeneficiario !== null || this.dadosPortabilidade.nomeBeneficiario !== undefined ? this.dadosPortabilidade.nomeBeneficiario : "";
      }
      cpfBeneficiarioTextoCartaSetter(){
        return this.dadosPortabilidade.cpfBeneficiario !== null || this.dadosPortabilidade.cpfBeneficiario !== undefined ? this.dadosPortabilidade.cpfBeneficiario : "";
      }
      dtNascimentoBeneficiarioTextoCartaSetter(){
        return this.beneficiario.matricula.dataNascimento !== null || this.beneficiario.matricula.dataNascimento !== undefined ? this.beneficiario.matricula.dataNascimento : "";
      }
      sexoBeneficiarioTextoCartaSetter(){
        return this.dadosPortabilidade.sexoBeneficiario !== null || this.dadosPortabilidade.sexoBeneficiario !== undefined ? this.dadosPortabilidade.sexoBeneficiario : "";
      }
      nomeTitularTextoCartaSetter(){
        return this.dadosPortabilidade.nomeTitular !== null || this.dadosPortabilidade.nomeTitular !== undefined ? this.dadosPortabilidade.nomeTitular : "";
      }
      cpfTitularTextoCartaSetter(){
        return this.dadosPortabilidade.cpfTitular !== null || this.dadosPortabilidade.cpfTitular !== undefined ? this.dadosPortabilidade.cpfTitular : "";
      }
     sexoTitularTextoCartaSetter(){
        return this.dadosPortabilidade.sexoTitular !== null || this.dadosPortabilidade.sexoTitular !== undefined ? this.dadosPortabilidade.sexoTitular : "";
      }
     tipoContratoTitularTextoCartaSetter(){
        return this.beneficiario.contrato.id !== null || this.beneficiario.contrato.id !== undefined ? this.beneficiario.contrato.id : "";
      }
     beneficiarioEhTitularTextoCartaSetter(){
        return this.dadosPortabilidade.beneficiarioEhTitular !== null || this.dadosPortabilidade.beneficiarioEhTitular !== undefined ? this.dadosPortabilidade.beneficiarioEhTitular : "";
      }
     dtAdesaoTextoCartaSetter(){
        return this.dadosPortabilidade.dtAdesao !== null || this.dadosPortabilidade.dtAdesao !== undefined ? this.dadosPortabilidade.dtAdesao : new Date();
      }

    async gerarPDF() {
      this.gerarTextoCarta();

        pdfMake.fonts = {
          Roboto: {
            normal: 'roboto.regular.ttf',
            bold:'CAIXAStd-Book.ttf',
            italics: 'CAIXAStd-Book.ttf',
            bolditalics: 'CAIXAStd-Book.ttf'
          },

          Inter: {
            normal: 'Inter-Bold.ttf',
            bold:'Inter-Bold.ttf',
            italics: 'Inter-Bold.ttf',
            bolditalics: 'Inter-Bold.ttf.ttf'
          },

          CAIXAStd: {
            normal: 'CAIXAStd-Book.ttf',
            bold:'CAIXAStd-Regular.ttf',
            italics: 'CAIXAStd-Regular.ttf',
            bolditalics: 'CAIXAStd-Regular.ttf'
          }

        }

        const documentDefinition = { content: [
            {
              image: await this.getBase64ImageFromURL("../assets/images/cabecalho-carta.png"),
              width: 450,
              height: 70,
              absolutePosition: {x:65, y:10}
             },

             { text: 'DECLARAÇÃO DE PORTABILIDADE/ PERMANÊNCIA',
               aligment: 'center',
               style: 'p2',
               tocItem: true,
               absolutePosition: {x:153, y:110},
               color: '#000000'
              },

              { text: this.textoCarta,
                alignment: 'justify',
                style: 'p1',
                tocItem: true,
                absolutePosition: {x:40, y:150},
                color: '#000000',
                lineHeight:1.5
              },

              { text: this.dataPorExtenso,
                style: 'p1',
                tocItem: true,
                absolutePosition: {x:40, y:665},
                color: '#000000'
              },

              {
                image: await this.getBase64ImageFromURL("../assets/images/assinatura.png"),
                width: 110,
                height: 90,
                absolutePosition: {x:240, y:650}
               },

               {
                image: await this.getBase64ImageFromURL("../assets/images/rodape-carta.png"),
                width: 440,
                height: 55,
                absolutePosition: {x:65, y:750}
               },

            ],
            styles: {

              p1:{
                fontSize: 12,
                font: 'Roboto',
                bold: false
              },

              p2: {
                fontSize: 12,
                font: 'Inter',
                bold: true
              },

            }
        };

        pdfMake.createPdf(documentDefinition, null, null,  pdfFonts.pdfMake.vfs).download("declaracao_de_portabilidade.pdf");

    }

    voltar() {
        this.location.back();
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

    carregarListOperator(){
           this.service.consultarBeneficiarioETitularContratoPorMatricula(this.matricula).pipe(
                    HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error')
                ).subscribe((beneficiarios: Beneficiario[]) => {
                    this.beneficiarios = beneficiarios
                    this.options = beneficiarios.map(b => ({label: b.nome, value: b.id }));

            })
          }
}
