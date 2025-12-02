
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Beneficiario } from 'app/shared/models/entidades';
import { Location } from "@angular/common";
import { BeneficiarioService, MessageService, SessaoService } from 'app/shared/services/services';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "assets/fonts/vfs_fonts";
import { CartaoDTO } from 'app/shared/models/comum/cartao-dto.model';
import { relativeTimeRounding } from 'moment';
import { Util } from 'app/arquitetura/shared/util/util';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { HttpUtil } from 'app/shared/util/http-util';
import { Option } from 'sidsc-components/dsc-select';

const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
    selector: 'app-list-cartoes',
    templateUrl: './cartoes-detail.component.html',
    styleUrls: ['./cartoes-detail.component.scss']
})
export class CartoesDetailComponent implements OnInit {

    beneficiario: Beneficiario;
    beneficiarios: Beneficiario[] = []
    cartao: CartaoDTO = {} as CartaoDTO;
    options: Option[] = [];
    @Input()
        titular = true;


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
      this.carregarListOperator();

        this.idBeneficiario = this.route.snapshot.params['idBeneficiario'];
        if (this.idBeneficiario) {
            this.service.consultarBeneficiarioPorId(this.idBeneficiario).subscribe((beneficiario: Beneficiario) => {

                if (beneficiario) {
                    this.beneficiarioSelecionado(beneficiario);
                    this.formularioSolicitacao.controls['dependente'].setValue(beneficiario.id);
                    window.scrollTo(0, 0);
                }
            }, (err) => {

                this.messageService.addMsgDanger(err.error);
            });

          }
        this.formularioSolicitacao.get('dependente').valueChanges.subscribe(v=> {
          this.beneficiario = this.beneficiarios.find(b => b.id === v)
          this.beneficiarioSelecionado(this.beneficiario)
        })
    }

    get matricula(): string {
        return SessaoService.getMatriculaFuncional();
    }

    quebraLinha(texto, limite) {
        if (texto.length > limite) {
            // Encontrar o primeiro espaço antes do limite
            let posEspaco = texto.lastIndexOf(' ', limite);

            // Se não houver espaço antes do limite, quebrar a linha exatamente no limite
            if (posEspaco === -1) {
                posEspaco = limite;
            }

            return texto.substring(0, posEspaco) + '\n' + texto.substring(posEspaco + 1);
        }
        return texto;
    }


    beneficiarioSelecionado(beneficiario: Beneficiario) {
        this.beneficiario = beneficiario;

        if (this.beneficiario && this.beneficiario.id) {
            this.service.getDadosCartaoBeneficiario(this.beneficiario.id)
                .subscribe(res => {
                    this.cartao = res;
                }, (err) => {
                    this.messageService.addMsgDanger(err.error);
                });
        }

    }

    public formatarNrCartao(valor: string): string {
        if (valor && valor.length >= 4) {
            const parte1 = valor.substr(0, valor.length - 2);
            const parte2 = valor.substr(valor.length - 2);
            return `${parte1}-${parte2}`;
        } else {
            return valor; // Retorna o valor original se não for possível formatar
        }
    }

    async gerarPDF(restrito: string) {

        if(!this.cartao || this.cartao && !this.cartao.nomeBeneficiario)
        return
        let xNome = 0;

        xNome = this.setXnomeValue()



        if (restrito === 'S') {
            pdfMake.fonts = {
                Roboto: {
                    normal: 'CAIXAStd-SemiBold.ttf',
                    bold: 'CAIXAStd-SemiBold.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                },

                Inter: {
                    normal: 'CAIXAStd-Regular.ttf',
                    bold: 'CAIXAStd-Regular.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                },

                CAIXAStd: {
                    normal: 'CAIXAStd-Book.ttf',
                    bold: 'CAIXAStd-Book.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                }


            }

            const documentDefinition = {
                pageSize: { width: 841.89, height: 1190.55 },
                content: [
                    {
                        image: await this.getBase64ImageFromURL("../assets/images/CARDIMPRESSAORESTRITO.png"),
                        width: 618,
                        height: 538,
                        absolutePosition: { x: 80, y: 135 }
                    },

                    {
                        text: 'Número do Cartão de Saúde',
                        style: 'p1',
                        tocItem: true,
                        absolutePosition: { x: 75 + 80, y: 200 },
                        color: '#005CA9'
                    },

                    {
                        text: this.formatarNrCartao(this.cartao.nrCartao),
                        style: 'p2',
                        absolutePosition: { x: 30 + 80, y: 220 },
                        color: '#005CA9'

                    },

                    {
                        text: 'Beneficiário',
                        style: 'p3',
                        absolutePosition: { x: 125 + 80, y: 260 },
                        color: '#005CA9'
                    },

                    {
                        //text: this.cartao.nomeBeneficiario,
                        text: this.quebraLinha(this.cartao.nomeBeneficiario, 35),
                        style: 'p4',
                        absolutePosition: { x: xNome  + 80, y: 280 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Válido até',
                        style: 'p5',
                        absolutePosition: { x: 130 + 80, y: 330 },
                        color: '#005CA9'
                    },

                    {
                        text: Util.dateToStringBr(this.cartao.dtValidade),
                        style: 'p6',
                        absolutePosition: { x: 114 + 80, y: 350 },
                        color: '#005CA9'
                    },


                    {
                        text: 'RESTRITO',
                        style: 'p4r',
                        absolutePosition: { x: 125 + 80, y: 370 },
                        color: '#F39200'
                    },

                    {
                        text: 'Nascimento',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 425 },
                        color: '#005CA9'
                    },


                    {
                        text: Util.dateToStringBr(this.cartao.dtNascimento),
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 440 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Titular',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 460 },
                        color: '#005CA9'
                    },

                    {
                        text: this.quebraLinha(this.cartao.noTitular, 35),
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 475 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Código Beneficiário',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 510 },
                        color: '#005CA9'
                    },

                    {
                        text: this.cartao.coBeneficiario,
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 525 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Data de Adesão',
                        style: 'p11',
                        absolutePosition: { x: 197 + 80, y: 510 },
                        color: '#005CA9'
                    },

                    {
                        text: Util.dateToStringBr(this.cartao.dtAdesao),
                        style: 'p12',
                        absolutePosition: { x: 202 + 80, y: 525 },
                        color: '#005CA9'
                    },


                    {
                        text: 'Contrato',
                        style: 'p13',
                        absolutePosition: { x: 20 + 80, y: 545 },
                        color: '#005CA9'
                    },


                    {
                        text: this.quebraLinha(this.cartao.noContrato, 26),
                        style: 'p14',
                        absolutePosition: { x: 20 + 80, y: 560 },
                        color: '#005CA9'
                    },


                    {
                        columns: [
                            {
                                text: 'O  beneficiário   acima  está  autorizado   a  submeter-se',
                                style: 'p15',
                                color: '#005CA9',
                                alignment: 'justify',
                                width: 300
                            }
                        ],
                        margin: [- 20 + 80, 560, 50, 0]  // Define a margem esquerda e topo
                    },
                    {
                        columns: [
                            {
                                text: 'SOMENTE a consultas médicas e exames de diagnóstico.',
                                style: 'p15',
                                color: '#005CA9',
                                alignment: 'justify',
                                width: 800
                            }
                        ],
                        margin: [- 20 + 80, 0, 0, 0]  // Define a margem esquerda e uma margem superior pequena
                    },
                    {
                        columns: [
                            {
                                text: 'Demais   procedimentos   devem   ser  negociados   entre',
                                style: 'p15',
                                color: '#005CA9',
                                alignment: 'justify',
                                width: 800
                            }
                        ],
                        margin: [- 20 + 80, 0, 0, 0]  // Define a margem esquerda e uma margem superior pequena
                    },
                    {
                        columns: [
                            {
                                text: 'profissional  e  paciente  e  pagos  diretamente  por  este.',
                                style: 'p15',
                                color: '#005CA9',
                                alignment: 'justify',
                                width: 800
                            }
                        ],
                        margin: [-  20 + 80, 0, 0, 0]  // Define a margem esquerda e uma margem superior pequena
                    },


                    {
                        text: 'Programa de Assistência',
                        style: 'p1C',
                        tocItem: true,
                        absolutePosition: { x: 375 + 80, y: 155 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Médica Supletiva',
                        style: 'p1C',
                        absolutePosition: { x: 400 + 80, y: 175 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Saúde CAIXA',
                        style: 'p1C',
                        absolutePosition: { x: 415 + 80, y: 195 },
                        color: '#4E6178'
                    },

                    {
                        text: 'VÁLIDA SOMENTE MEDIANTE A',
                        style: 'p2C',
                        absolutePosition: { x: 365 + 80, y: 235 },
                        color: '#4E6178'
                    },

                    {
                        text: 'APRESENTAÇÃO DE DOCUMENTOS DE',
                        style: 'p2C',
                        absolutePosition: { x: 340 + 80, y: 255 },
                        color: '#4E6178'
                    },

                    {
                        text: 'IDENTIDADE',
                        style: 'p2C',
                        absolutePosition: { x: 425 + 80, y: 275 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Central de Atendimento',
                        style: 'p3C',
                        absolutePosition: { x: 390 + 80, y: 305 },
                        color: '#F39200'
                    },

                    {
                        text: '0800 095 60 94',
                        style: 'p4C',
                        absolutePosition: { x: 385 + 80, y: 320 },
                        color: '#005CA9'
                    },

                    {
                        text: 'saude.caixa.gov.br',
                        style: 'p5C',
                        absolutePosition: { x: 397 + 80, y: 345 },
                        color: '#005CA9'

                    },

                    {
                        text: 'Operadora',
                        style: 'p6C',
                        color: '#005CA9',
                        absolutePosition: { x: 330 + 80, y: 495 },
                    },

                    {
                        text: 'Caixa Econômica Federal',
                        style: 'p7C',
                        color: '#005CA9',
                        absolutePosition: { x: 330 + 80, y: 510 },
                    },

                    {
                        text: 'Plano',
                        style: 'p8C',
                        color: '#005CA9',
                        absolutePosition: { x: 330 + 80, y: 545 },
                    },

                    {
                        text: 'Abrangência',
                        style: 'p8C',
                        color: '#005CA9',
                        absolutePosition: { x: 520 + 80, y: 545 },
                    },

                    {
                        text: 'Saúde CAIXA',
                        style: 'p9C',
                        color: '#005CA9',
                        absolutePosition: { x: 330 + 80, y: 560 },
                    },

                    {
                        text: 'Nacional',
                        style: 'p9C',
                        color: '#005CA9',
                        absolutePosition: { x: 535 + 80, y: 560 },
                    },

                    {
                        text: 'Carência',
                        style: 'p10C',
                        color: '#005CA9',
                        absolutePosition: { x: 330 + 80, y: 590 },
                    },

                    {
                        text: 'Conforme RH 222',
                        style: 'p11C',
                        absolutePosition: { x: 330 + 80, y: 605 },
                        color: '#005CA9'
                    },


                ],
                styles: {

                    p1: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p2: {
                        fontSize: 26,
                        font: 'Roboto',
                        bold: true
                    },
                    p3: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p4: {
                        fontSize: 14,
                        font: 'CAIXAStd',
                        width: 200
                    },
                    p4r: {
                        fontSize: 18,
                        font: 'Roboto',
                        bold: true
                    },
                    p5: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p6: {
                        fontSize: 16,
                        font: 'Inter',
                        bold: true
                    },
                    p11: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p12: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p13: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p14: {
                        fontSize: 14,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p15: {
                        fontSize: 10.8,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p1C: {
                        fontSize: 16,
                        font: 'CAIXAStd',
                        bold: true
                    },
                    p2C: {
                        fontSize: 13.5,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p3C: {
                        fontSize: 14.5,
                        font: 'Inter',
                        normal: true
                    },
                    p4C: {
                        fontSize: 20,
                        font: 'Roboto',
                        bold: true
                    },
                    p5C: {
                        fontSize: 16,
                        font: 'Roboto',
                        bold: true
                    },
                    p6C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p7C: {
                        fontSize: 15,
                        font: 'CAIXAStd'
                    },
                    p8C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p9C: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p10C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p11C: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    }


                }
            };
            pdfMake.createPdf(documentDefinition, null, null, pdfFonts.pdfMake.vfs).download("cartao_nr_" + this.cartao.nrCartao + ".pdf");
        } else {
            pdfMake.fonts = {

                Roboto: {
                    normal: 'CAIXAStd-SemiBold.ttf',
                    bold: 'CAIXAStd-SemiBold.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                },

                Inter: {
                    normal: 'CAIXAStd-Regular.ttf',
                    bold: 'CAIXAStd-Regular.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                },

                CAIXAStd: {
                    normal: 'CAIXAStd-Book.ttf',
                    bold: 'CAIXAStd-Book.ttf',
                    italics: 'CAIXAStd-Regular.ttf',
                    bolditalics: 'CAIXAStd-Regular.ttf'
                }


            }

            const documentDefinition = {
                pageSize: { width: 841.89, height: 1190.55 },
                content: [
                    {
                        image: await this.getBase64ImageFromURL("../assets/images/CARDIMPRESSAO.png"),
                        width: 618,
                        height: 538,
                        absolutePosition: { x: 80, y: 135 }
                    },

                    {
                        text: 'Número do Cartão de Saúde',
                        style: 'p1',
                        tocItem: true,
                        absolutePosition: { x: 75 + 80, y: 200 },
                        color: '#005CA9'
                    },

                    {
                        text: this.formatarNrCartao(this.cartao.nrCartao),
                        style: 'p2',
                        absolutePosition: { x: 30 + 80, y: 220 },
                        color: '#005CA9'

                    },

                    {
                        text: 'Beneficiário',
                        style: 'p3',
                        absolutePosition: { x: 125 + 80, y: 260 },
                        color: '#005CA9'
                    },

                    {
                        //text: this.cartao.nomeBeneficiario,
                        text: this.quebraLinha(this.cartao.nomeBeneficiario, 35),
                        style: 'p4',
                        absolutePosition: { x: xNome  + 80, y: 280 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Válido até',
                        style: 'p5',
                        absolutePosition: { x: 130 + 80, y: 330 },
                        color: '#005CA9'
                    },

                    {
                        text: Util.dateToStringBr(this.cartao.dtValidade),
                        style: 'p6',
                        absolutePosition: { x: 114 + 80, y: 350 },
                        color: '#005CA9'
                    },

                    {
                        text: 'Nascimento',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 425 },
                        color: '#FFFFFF'
                    },


                    {
                        text: Util.dateToStringBr(this.cartao.dtNascimento),
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 440 },
                        color: '#FFFFFF'
                    },

                    {
                        text: 'Titular',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 460 },
                        color: '#FFFFFF'
                    },

                    {
                        text: this.quebraLinha(this.cartao.noTitular, 35),
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 475 },
                        color: '#FFFFFF'
                    },

                    {
                        text: 'Código Beneficiário',
                        style: 'p11',
                        absolutePosition: { x: 20 + 80, y: 510 },
                        color: '#FFFFFF'
                    },

                    {
                        text: this.cartao.coBeneficiario,
                        style: 'p12',
                        absolutePosition: { x: 20 + 80, y: 525 },
                        color: '#FFFFFF'
                    },

                    {
                        text: 'Data de Adesão',
                        style: 'p11',
                        absolutePosition: { x: 197 + 80, y: 510 },
                        color: '#FFFFFF'
                    },

                    {
                        text: Util.dateToStringBr(this.cartao.dtAdesao),
                        style: 'p12',
                        absolutePosition: { x: 202 + 80, y: 525 },
                        color: '#FFFFFF'
                    },


                    {
                        text: 'Contrato',
                        style: 'p13',
                        absolutePosition: { x: 20 + 80, y: 545 },
                        color: '#FFFFFF'
                    },


                    {
                        text: this.quebraLinha(this.cartao.noContrato, 26),
                        style: 'p14',
                        absolutePosition: { x: 20 + 80, y: 560 },
                        color: '#FFFFFF'
                    },


                    {
                        text: 'O beneficiário  acima  está  autorizado  a  utilizar-se  do',
                        style: 'p15',
                        absolutePosition: { x: 20 + 80, y: 620 },
                        color: '#FFFFFF',
                        alignment: 'justify'
                    },

                    {
                        text: 'Saúde CAIXA, conforme suas normas.',
                        style: 'p15',
                        absolutePosition: { x: 20 + 80, y: 635 },
                        color: '#FFFFFF'
                    },

                    {
                        text: 'Programa de Assistência',
                        style: 'p1C',
                        tocItem: true,
                        absolutePosition: { x: 375 + 80, y: 155 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Médica Supletiva',
                        style: 'p1C',
                        absolutePosition: { x: 400 + 80, y: 175 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Saúde CAIXA',
                        style: 'p1C',
                        absolutePosition: { x: 415 + 80, y: 195 },
                        color: '#4E6178'
                    },

                    {
                        text: 'VÁLIDA SOMENTE MEDIANTE A',
                        style: 'p2C',
                        absolutePosition: { x: 365 + 80, y: 235 },
                        color: '#4E6178'
                    },

                    {
                        text: 'APRESENTAÇÃO DE DOCUMENTOS DE',
                        style: 'p2C',
                        absolutePosition: { x: 340 + 80, y: 255 },
                        color: '#4E6178'
                    },

                    {
                        text: 'IDENTIDADE',
                        style: 'p2C',
                        absolutePosition: { x: 425 + 80, y: 275 },
                        color: '#4E6178'
                    },

                    {
                        text: 'Central de Atendimento',
                        style: 'p3C',
                        absolutePosition: { x: 390 + 80, y: 305 },
                        color: '#F39200'
                    },

                    {
                        text: '0800 095 60 94',
                        style: 'p4C',
                        absolutePosition: { x: 385 + 80, y: 320 },
                        color: '#005CA9'
                    },

                    {
                        text: 'saude.caixa.gov.br',
                        style: 'p5C',
                        absolutePosition: { x: 397 + 80, y: 345 },
                        color: '#005CA9'

                    },

                    {
                        text: 'Operadora',
                        style: 'p6C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 330 + 80, y: 495 },
                    },

                    {
                        text: 'Caixa Econômica Federal',
                        style: 'p7C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 330 + 80, y: 510 },
                    },

                    {
                        text: 'Plano',
                        style: 'p8C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 330 + 80, y: 545 },
                    },

                    {
                        text: 'Abrangência',
                        style: 'p8C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 520 + 80, y: 545 },
                    },

                    {
                        text: 'Saúde CAIXA',
                        style: 'p9C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 330 + 80, y: 560 },
                    },

                    {
                        text: 'Nacional',
                        style: 'p9C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 535 + 80, y: 560 },
                    },

                    {
                        text: 'Carência',
                        style: 'p10C',
                        color: '#FFFFFF',
                        absolutePosition: { x: 330 + 80, y: 590 },
                    },

                    {
                        text: 'Conforme RH 222',
                        style: 'p11C',
                        absolutePosition: { x: 330 + 80, y: 605 },
                        color: '#FFFFFF'
                    },


                ],
                styles: {

                    p1: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p2: {
                        fontSize: 26,
                        font: 'Roboto',
                        bold: true
                    },
                    p3: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p4: {
                        fontSize: 14,
                        font: 'CAIXAStd',
                        width: 200
                    },
                    p4r: {
                        fontSize: 18,
                        font: 'Roboto',
                        bold: true
                    },
                    p5: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p6: {
                        fontSize: 16,
                        font: 'Inter',
                        bold: true
                    },
                    p11: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p12: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p13: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p14: {
                        fontSize: 14,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p15: {
                        fontSize: 10.8,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p1C: {
                        fontSize: 16,
                        font: 'CAIXAStd',
                        bold: true
                    },
                    p2C: {
                        fontSize: 13.5,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p3C: {
                        fontSize: 14.5,
                        font: 'Inter',
                        normal: true
                    },
                    p4C: {
                        fontSize: 20,
                        font: 'Roboto',
                        bold: true
                    },
                    p5C: {
                        fontSize: 16,
                        font: 'Roboto',
                        bold: true
                    },
                    p6C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p7C: {
                        fontSize: 15,
                        font: 'CAIXAStd'
                    },
                    p8C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p9C: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    },
                    p10C: {
                        fontSize: 13.5,
                        font: 'Roboto',
                        bold: true
                    },
                    p11C: {
                        fontSize: 15,
                        font: 'CAIXAStd',
                        normal: true
                    }

                }
            };
            pdfMake.createPdf(documentDefinition, null, null, pdfFonts.pdfMake.vfs).download("cartao_nr_" + this.cartao.nrCartao + ".pdf");
        }
    }

    setXnomeValue():number{
        let xNomeValue = 0

        if (this.cartao.nomeBeneficiario.length > 10 && this.cartao.nomeBeneficiario.length < 15) {
            xNomeValue = 110;
        } else if (this.cartao.nomeBeneficiario.length > 14 && this.cartao.nomeBeneficiario.length < 21) {
            xNomeValue = 85;
        } else if (this.cartao.nomeBeneficiario.length > 19 && this.cartao.nomeBeneficiario.length < 25) {
            xNomeValue = 70;
        } else if (this.cartao.nomeBeneficiario.length > 24 && this.cartao.nomeBeneficiario.length < 30) {
            xNomeValue = 45;
        } else if (this.cartao.nomeBeneficiario.length > 29 && this.cartao.nomeBeneficiario.length < 35) {
            xNomeValue = 30;
        } else if (this.cartao.nomeBeneficiario.length > 34 && this.cartao.nomeBeneficiario.length < 45) {
            xNomeValue = 20;
        }
        return xNomeValue
    }

    imprimir(restrito: string) {
        let printContents, popupWin;

        printContents = document.getElementById('print-section').innerHTML;

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        if (restrito === 'S') {
            popupWin.document.write(`
          <html>
            <head>
              <style type="text/css" media="print">
              #noprint {
                display: none;
                }
                body {
                    font-family: Caixa Std Book, Caixa Std Regular, "Helvetica Neue", sans-serif;
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

                    font-size: 20px;
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

                .cartao-saude{
                    box-sizing: border-box;
                    height: 532px;
                   display: flex;
                   justify-content: space-evenly;
                   margin-left: 10%;


                }
                 .form-group{
                    display: flex;
                    justify-content: center;
                    width: 100%;
                 }
                .ng-tns-c11-13{
                    width: 668px;

                }
                 .custom-form-group-input{
                    width: 50%;
                 }

                 .print-card {
                  box-sizing: border-box;
                  height: 532px;
                  display: flex;
                  justify-content: space-evenly;
                  margin-left: 10%;
              }

              .logo-card-impressao{
                  text-align: center;
                  width: 100%;
                  border-radius: 7.31774px 7.31774px 11.7084px 11.7084px;
                  margin-left: auto;
                  margin-right: auto;
                  display: flex;
              }

              .text-card-imp-restrito{
                    position: relative;
                    float: left;
                    width: 300px;
                    top: -30%;
                    margin-left: 7px;
                    margin-top: -71%;
              }

              .p1-print{
                  text-align: center;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 10%;
                  color: #005CA9;
                  margin-top: 10%;
              }

              .p1-2-print{
                  height: 31px;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 24px;
                  line-height: 10%;
                  color: #005CA9;
                  text-align: center;
              }

              .p2-print-restrito{
                  text-align: center;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 12px;
                  line-height: 10%;
                  color: #005CA9;
                  margin-top: -5%;
              }

              .p2-2-print-restrito{
                  height: 14px;
                  font-style: normal;
                  font-weight: 100;
                  font-size: 14px;
                  line-height: 110%;
                  text-align: center;
                  color: #005CA9;
                  width: 100%;
              }

              .p3-print-restrito{
                  text-align: center;
                  height: 17px;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 120%;
                  margin-top: 10%;
                  color: #005CA9;
              }

              .p3-2-print-restrito{
                text-align: center;
                height: 17px;
                font-style: normal;
                font-weight: normal !important;
                font-size: 12px;
                line-height: 10%;
                color: #005CA9;
            }

            .p4-1-print-restrito {
                text-align: center;
                height: 17px;
                font-style: bold;
                font-weight: 700;
                font-size: 18px;
                line-height: 120%;
                color: #F39200;
                margin-top: -5%;
            }

              .p4-11-print-restrito{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 20%;
                  color: #005CA9;
                  margin-left: 10px;
              }

              .p4-12-print-restrito{
                  display: flex;
                  justify-content: space-between;
                  font-size: 16px;
                  color: #005CA9;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -1%;
                  font-weight: normal !important;
              }

              .p4-print-restrito{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 12px;
                  line-height: 125%;
                  color: #005CA9;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -2%;
              }

              .p4-10-print-restrito{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 14px;
                  line-height: 116%;
                  color: #005CA9;
                  margin-right: 15px;
                  margin-left: 10px;
                  width: 100%;
                  margin-top: -3%;
              }

              .p4-9-print{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 120%;
                  color: #005CA9;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: 5%;
              }

              .p4-2-print{
                  font-style: normal;
                  font-weight: normal;
                  font-size: 16px;
                  line-height: 50%;
                  color: #005CA9;
                  display: flex;
                  justify-content: space-between;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -1%;
              }

              .p4-3-print{
                  font-style: normal;
                  font-weight: 100;
                  font-size: 14px;
                  line-height: 90%;
                  color: #005CA9;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -2%;
              }

              .p4-4-print-restrito {
                font-family: 'Caixa Std Regular';
                font-style: normal;
                font-weight: 400;
                font-size: 10px;
                line-height: 120%;
                color: #005CA9;
                margin-right: 15px;
                margin-left: 10px;
                margin-top: -5%;
                text-align: justify;
              }

              .text-card2-imp {
                position: relative;
                float: left;
                width: 280px;
                margin-left: 46%;
                margin-top: -75%;
              }

            .card-costa-p1-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 20%;
                text-align: center;
                color: #4E6178;
                margin-left: auto;
                margin-right: auto;
            }

            .card-costa-p2-print-restrito {

                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 120%;
                text-align: center;
                color: #4E6178;
                margin-top: 7%;
            }

            .card-costa-p3-print {
                font-weight: 400;
                font-size: 16px;
                line-height: 25%;
                text-align: center;
                color: #F39200;
                margin-top:10%
            }

            .card-costa-p4-print-restrito {
                font: 'Caixa Std Bold';
                font-style: normal;
                font-weight: 700;
                font-size: 22px;
                line-height: 25%;
                text-align: center;
                color: #005CA9;
            }

            .card-costa-p5-print-restrito {
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 100%;
                text-align: center;
                color: #005CA9;
                margin-top: -5%;
            }

            .card-costa-p6-print {
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 140%;
                color: #005CA9;
                margin-right: 15px;
                margin-top: 45%;
                margin-left: 2px;
                }

            .card-costa-p7-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 28%;
                color: #005CA9;
                margin-right: 15px;
                width: 100%;
                margin-top: -1%;
                margin-left: 2px;
            }

            .card-costa-p8-print {
                height: 17px;
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 140%;
                color: #005CA9;
                display: flex;
                justify-content: space-between;
                margin-right: 2px;
                margin-top: 6%;
                margin-left: 2px;
            }

            .card-costa-p10-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 14%;
                color: #005CA9;
                display: flex;
                justify-content: space-between;
                margin-right: 2px;
                margin-top: -1%;
                margin-left: 2px;
            }

            .card-costa-p11-print-restrito {
                width: 54px;
                height: 17px;
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 10%;
                color: #005CA9;
                margin-right: 15px;
                display: flex;
                margin-left: 2px;
                margin-top: 10%;
            }

            .card-costa-p12-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 0%;
                color: #005CA9;
                margin-right: 15px;
                margin-left: 2px;
                margin-top: -5%;
            }


                </style>
            </head>
            <body onload="window.print();window.close()">
            ${printContents}
            </body>
          </html>`);
        } else {
            popupWin.document.write(`
          <html>
            <head>
              <style type="text/css" media="print">
              #noprint {
                display: none;
                }
                body {
                    font-family: Caixa Std Book, Caixa Std Regular, "Helvetica Neue", sans-serif;

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
                    color: #FFFFFF;
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


                .cartao-saude{
                    box-sizing: border-box;
                    height: 532px;
                   display: flex;
                   justify-content: space-evenly;
                   margin-left: 10%;


                }
                 .form-group{
                    display: flex;
                    justify-content: center;
                    width: 100%;
                 }
                .ng-tns-c11-13{
                    width: 668px;

                }
                 .custom-form-group-input{
                    width: 50%;
                 }

                 .print-card {
                  box-sizing: border-box;
                  height: 532px;
                  display: flex;
                  justify-content: space-evenly;
                  margin-left: 10%;
              }

              .logo-card-impressao{
                  text-align: center;
                  width: 100%;
                  border-radius: 7.31774px 7.31774px 11.7084px 11.7084px;
                  margin-left: auto;
                  margin-right: auto;
                  display: flex;
              }

              .text-card-imp{
                  position: relative;
                  float: left;
                  width: 300px;
                  top: -103%;
                  margin-left: 7px;
                  margin-top: -65%;
              }

              .p1-print{
                  text-align: center;
                  font-style: normal;
                  font-weight: 100;
                  font-size: 12px;
                  line-height: 10%;
                  color: #005CA9;
              }

              .p1-2-print{
                  height: 31px;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 24px;
                  line-height: 10%;
                  color: #005CA9;
                  text-align: center;
              }

              .p2-print{
                  text-align: center;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 12px;
                  line-height: 10%;
                  color: #005CA9;
                  margin-top: -5%;
              }

              .p2-2-print{
                  height: 14px;
                  font-style: normal;
                  font-weight: 100;
                  font-size: 14px;
                  line-height: 110%;
                  text-align: center;
                  color: #005CA9;
                  width: 100%;
              }

              .p3-print{
                  text-align: center;
                  height: 17px;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 120%;
                  margin-top: 10%;
                  color: #005CA9;
              }

              .p3-2-print{
                  text-align: center;
                  height: 17px;
                  font-style: normal;
                  font-weight: normal !important;
                  font-size: 12px;
                  line-height: 10%;
                  color: #005CA9;
                }

              .p4-11-print{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: bold;
                  font-size: 12px;
                  line-height: 20%;
                  color: #FFFFFF !important;
                  opacity: 1 !important;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: 7%;
              }

              .p4-12-print{
                  display: flex;
                  justify-content: space-between;
                  font-size: 16px;
                  color: #FFFFFF;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -1%;
              }

              .p4-print{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 12px;
                  line-height: 125%;
                  color: #FFFFFF;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: 4%;
              }

              .p4-10-print{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: 700;
                  font-size: 14px;
                  line-height: 116%;
                  color: #FFFFFF;
                  margin-right: 15px;
                  margin-left: 10px;
                  width: 100%;
                  margin-top: -3%;
              }

              .p4-9-print{
                  display: flex;
                  justify-content: space-between;
                  font-style: normal;
                  font-weight: 500;
                  font-size: 12px;
                  line-height: 120%;
                  color: #FFFFFF;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: 5%;
              }

              .p4-2-print{
                  font-style: normal;
                  font-weight: normal;
                  font-size: 16px;
                  line-height: 50%;
                  color: #FFFFFF;
                  display: flex;
                  justify-content: space-between;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -1%;
              }

              .p4-3-print{
                  font-style: normal;
                  font-weight: 100;
                  font-size: 14px;
                  line-height: 90%;
                  color: #FFFFFF;
                  margin-right: 15px;
                  margin-left: 10px;
                  margin-top: -2%;
              }

              .p4-4-print {
                font-family: 'Caixa Std Regular';
                font-style: normal;
                font-weight: 400;
                font-size: 10px;
                line-height: 120%;
                color: #FFFFFF;
                margin-right: 15px;
                margin-left: 10px;
                margin-top: -3%;
                text-align: justify;
              }

              .text-card2-imp {
                position: relative;
                float: left;
                width: 280px;
                margin-left: 46%;
                margin-top: -75%;
              }

            .card-costa-p1-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 20%;
                text-align: center;
                color: #4E6178;
                margin-left: auto;
                margin-right: auto;
            }

            .card-costa-p2-print {
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 120%;
                text-align: center;
                color: #4E6178;
                margin-top: 7%;
            }

            .card-costa-p3-print {
                font-weight: 400 !important;
                font-size: 16px;
                line-height: 25%;
                text-align: center;
                color: #F39200;
                margin-top:10%
            }

            .card-costa-p4-print {
                font: 'Caixa Std Bold';
                font-style: normal;
                font-weight: 700;
                font-size: 22px;
                line-height: 25%;
                text-align: center;
                color: #005CA9;
            }

            .card-costa-p5-print {
                font-style: normal;
                font-weight: 700;
                font-size: 18px;
                line-height: 100%;
                text-align: center;
                color: #005CA9;
                margin-top: -5%;
            }

            .card-costa-p6-print {
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 140%;
                color: #FFFFFF;
                margin-right: 15px;
                margin-top: 45%;
                margin-left: 2px;
                }

            .card-costa-p7-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 28%;
                color: #FFFFFF;
                margin-right: 15px;
                width: 100%;
                margin-top: -1%;
                margin-left: 2px;
            }

            .card-costa-p8-print {
                height: 17px;
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 140%;
                color: #FFFFFF;
                display: flex;
                justify-content: space-between;
                margin-right: 2px;
                margin-top: 6%;
                margin-left: 2px;
            }



            .card-costa-p10-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 14%;
                color: #FFFFFF;
                display: flex;
                justify-content: space-between;
                margin-right: 2px;
                margin-top: -1%;
                margin-left: 2px;
            }

            .card-costa-p11-print {
                width: 54px;
                height: 17px;
                font-style: normal;
                font-weight: 700;
                font-size: 12px;
                line-height: 10%;
                color: #FFFFFF;
                margin-right: 15px;
                display: flex;
                margin-left: 2px;
                margin-top: 10%;
            }

            .card-costa-p12-print {
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 0%;
                color: #FFFFFF;
                margin-right: 15px;
                margin-left: 2px;
                margin-top: -5%;
            }


                </style>
            </head>
            <body onload="window.print();window.close()">
            ${printContents}
            </body>
          </html>`);
        }
        popupWin.document.close();
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
       this.service.consultarFamiliaPorMatricula(this.matricula, this.titular).pipe(
                HttpUtil.catchErrorAndReturnEmptyObservableByKey(this.messageService, 'error')
            ).subscribe((beneficiarios: Beneficiario[]) => {
                this.beneficiarios = beneficiarios
                this.options = beneficiarios.map(b => ({label: b.nome, value: b.id }));
        })
      }
}
