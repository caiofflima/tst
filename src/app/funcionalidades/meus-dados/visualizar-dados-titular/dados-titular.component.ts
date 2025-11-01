import { Component, AfterViewInit } from '@angular/core';

import { MessageService } from 'app/shared/components/messages/message.service';
import { MeusDadosService } from 'app/shared/services/meus-dados/meus-dados.service';
import { Beneficiario } from 'app/shared/models/comum/beneficiario';
import { BaseComponent } from 'app/shared/components/base.component';
import ModalUtil from 'app/shared/util/modal';
import { SiascTable } from 'app/shared/models/siasc-table/siasc-table';
import { SiascTableCreator } from 'app/shared/models/siasc-table/siasc-table-creator';
import { SiascCol } from 'app/shared/models/siasc-table/siasc-col';
import {Util} from "../../../arquitetura/shared/util/util";

const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

@Component({
	selector: 'app-dados-titular',
	templateUrl: './dados-titular.component.html',
	styleUrls: ['./dados-titular.component.scss']
})
export class DadosTitularComponent extends BaseComponent implements AfterViewInit {

	titular: Beneficiario;
	selecionado: Beneficiario;
	selecionadoEmail: Beneficiario;
	idModalDetalhar = 'modalBeneficiarioDetalhe';
	idModalEmail = 'emailModal';
	matricula: string;
	dataListPrincipal: SiascTable;
	dataListCasalCaixa: SiascTable;
	dataListPensaoGerada: SiascTable;
	dataListMatriculaOriginaria: SiascTable;

	constructor(
		 protected override messageService: MessageService,
		protected meusDadosService: MeusDadosService
	) {
		super(messageService);
		this.titular = new Beneficiario();
		this.selecionadoEmail = new Beneficiario();
		this.carregarTitular();
	}

	ngAfterViewInit() {
		ModalUtil.hiddenModal(this.idModalEmail, () => {
			this.selecionadoEmail = new Beneficiario();
		})
	}

	carregarTitular() {
		this.matricula = '12654-3'; // mock para teste de exibição
		this.meusDadosService.carregarTitular(this.matricula).subscribe(titular => {
			this.titular = titular;
			this.atualizarDataList();
		}, error => {
			this.messageService.addMsgDanger(error.error);
		})
	}

	verificarDataCartao(dataFimCartao: Date): number {
		const dataAtual = new Date();
		const dataDiff = dataFimCartao.getTime() - dataAtual.getTime();
		return Math.ceil(dataDiff / (1000 * 3600 * 24));
	}

	getCartaoExpirado(dataFimCartao: Date): boolean {
		if (dataFimCartao !== null) {
			const dt = Util.getDate(dataFimCartao);
			const data = this.verificarDataCartao(dt);
			return data < 0;
		}
		return false;
	}

	getCartaoAExpirar(dataFimCartao: Date): boolean {
		if (dataFimCartao !== null) {
			const dt = Util.getDate(dataFimCartao);
			const data = this.verificarDataCartao(dt);
			return data > -1 && data < 31;
		}
		return false;
	}

	detalhar(beneficiario: Beneficiario): void {
		this.selecionado = beneficiario;
	}

	getIdModal() {
		return ModalUtil.idHashtag(this.idModalDetalhar);
	}

	getClass(beneficiario: Beneficiario): string {
		if (beneficiario.situacao === 'CANCELADO') {
			return 'bg-danger';
		}
		if (this.getCartaoExpirado(beneficiario.dtFimCartao) || this.getCartaoAExpirar(beneficiario.dtFimCartao)) {
			return 'bg-warning';
		}

		return ''
	}

	emitirDeclaracao(beneficiario: Beneficiario) {
		this.meusDadosService.exportarPDF(beneficiario).subscribe(fileByteArray => {
			const blob = new Blob([fileByteArray], {type: 'application/pdf'});
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = URL.createObjectURL(blob);
			document.body.appendChild(iframe);
			iframe.contentWindow.print();
		}, error => {
				this.messageService.addMsgDanger('MA00A');
		});
	}

	openCloseEmailModal(selecinado: Beneficiario): void {
		this.selecionadoEmail = selecinado;
	}
	
	get emailVazio(){
		return this.selecionadoEmail.contato.email === null || this.selecionadoEmail.contato.email.trim() === '';
	}

	get emailInvalido(){
		return regexp.test(this.selecionadoEmail.contato.email);
	}

	enviarCartaoPorEmail(): void {

		if (this.selecionadoEmail.contato.email === null || this.selecionadoEmail.contato.email.trim() === '') {
			return;
		}

		if (regexp.test(this.selecionadoEmail.contato.email)) {
			this.meusDadosService.enviarCartaoEmail(this.selecionadoEmail).subscribe(response => {
				this.messageService.addMsgSuccess('MA00B');
			}, error => {
					this.messageService.addMsgDanger('MA00C');
			});
		} else {
			return;
		}
	}

	atualizarDataList() {
		this.dataListPrincipal = this.createPrincipalSiascTable(this.titular.beneficiarios);
		this.dataListPensaoGerada = this.createExtraSiascTable(Array(this.titular.beneficiarios[1]));
		this.dataListCasalCaixa = this.createExtraSiascTable(Array(this.titular.beneficiarios[1]));
		this.dataListMatriculaOriginaria = this.createExtraSiascTable(Array(this.titular));
	}

	createExtraSiascTable(list: Beneficiario[]): SiascTable {
		const idTable = 'exibeBeneficiarios';
		const creator: SiascTableCreator<Beneficiario> = new SiascTableCreator();

		// Cabeçalhos
		// Id - Texto - largura(%) - Class - Style
		const headers = [
			creator.addHeader('matricula', 'Matrícula', 10, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('nome', 'Nome', 25, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('tipo_dependente', 'Tipo de Dependente', 25, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('situacao', 'Situação', 10, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('cod_beneficiario', 'Cód. Beneficiário', 10, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('termino_cartao', 'Término Cartão', 10, 'text-left', { 'vertical-align': 'middle' }),
			//creator.addHeader('acao', 'Ações', 10, 'text-center', { 'vertical-align': 'middle' })
		];

		// Linhas
		// Id (composto por idTable, index e um texto)- Valor - Class - Style - Objeto
		const rows = [];
		for (let index = 0; index < list.length; index++) {
			const object = list[index];
			const classe = this.getClass(object);
			const dataFimCartao = object.situacao === 'CANCELADO' ? '' : this.dateToString(object.dtFimCartao);
			const showAlertIcon = this.getDetailsShowAlertIcon(object);

			const cols = [
				creator.addColFunction(idTable, index, 'matricula', object.matricula, 'btn btn-link', null, object, this.callbackCol, this),
				creator.addCol(idTable, index, 'nome', object.nome, 'text-left', null, object),
				creator.addCol(idTable, index, 'tipoDependente', object.tipo, 'text-left', null, object),
				creator.addCol(idTable, index, 'situacao', object.situacao, 'text-left', null, object),
				creator.addCol(idTable, index, 'codBeneficiario', object.codBeneficiario, 'text-left', null, object),
				creator.addColAlertIcon(idTable, index, 'terminoCartao', dataFimCartao, 'text-left', null, object,
						showAlertIcon['show'], null, showAlertIcon['classAlertIcon'],
						showAlertIcon['classIcon'], showAlertIcon['titleAlertIcon'])
			];
			rows.push(creator.addRowNone(idTable, index, cols, classe, null, list[index]));
		}

		// Table
		// Id - Cabeçalhos - Linhas - Class - Style - Lista
		return creator.newSiascTableNoPagination(idTable, headers, rows, null, null, list);
	}

	createPrincipalSiascTable(list: Beneficiario[]): SiascTable {
		const idTable = 'exibeBeneficiarios';
		const creator: SiascTableCreator<Beneficiario> = new SiascTableCreator();

		// Cabeçalhos
		// Id - Texto - largura(%) - Class - Style
		const headers = [
			creator.addHeader('nome', 'Nome', 25, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('tipo_dependente', 'Tipo de Dependente', 25, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('situacao', 'Situação', 10, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('cod_beneficiario', 'Cód. Beneficiário', 12, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('termino_cartao', 'Término Cartão', 13, 'text-left', { 'vertical-align': 'middle' }),
			creator.addHeader('acao', 'Ações', 15, 'text-center', { 'vertical-align': 'middle' })
		];

		// Linhas
		// Id (composto por idTable, index e um texto)- Valor - Class - Style - Objeto
		const rows = [];
		for (let index = 0; index < list.length; index++) {
			const object = list[index];
			const classe = this.getClass(object);
			const dataFimCartao = object.situacao === 'CANCELADO' ? '' : this.dateToString(object.dtFimCartao);
			const showAlertIcon = this.getDetailsShowAlertIcon(object);
			const showRestrito = object.restrito === 'S' ? null : false;
			const disabledEmail = object.situacao === 'CANCELADO';

			const cols = [
				creator.addColAlertIcon(idTable, index, 'nome', object.nome, 'text-left', null, object, showRestrito, 'Restrito'),
				creator.addCol(idTable, index, 'tipoDependente', object.tipo, 'text-left', null, object),
				creator.addCol(idTable, index, 'situacao', object.situacao, 'text-left', null, object),
				creator.addCol(idTable, index, 'codBeneficiario', object.codBeneficiario, 'text-left', null, object),
				creator.addColAlertIcon(idTable, index, 'terminoCartao', dataFimCartao, 'text-left', null, object,
						showAlertIcon['show'], null, showAlertIcon['classAlertIcon'],
						showAlertIcon['classIcon'], showAlertIcon['titleAlertIcon'])
			];
			rows.push(creator.addRowDetailPdfEmail(idTable, index, cols, classe, null, this.idModalEmail, this.idModalDetalhar, list[index], disabledEmail));
		}

		// Table
		// Id - Cabeçalhos - Linhas - Class - Style - Lista
		return creator.newSiascTableNoPagination(idTable, headers, rows, null, null, list);
	}

	getDetailsShowAlertIcon(objeto: Beneficiario): Object[] {

		const obj = [{show: false, classAlertIcon: '', classIcon: '', titleAlertIcon: ''}];

		if (objeto.situacao !== 'CANCELADO') {
			if (this.getCartaoAExpirar(objeto.dtFimCartao)) {
				obj['show'] = null;
				obj['classAlertIcon'] = 'msg label label-warning';
				obj['titleAlertIcon'] = 'Cartão a expirar em até 30 dias';
				obj['classIcon'] = 'fa fa-warning';

			} else if (this.getCartaoExpirado(objeto.dtFimCartao)) {
				obj['show'] = null;
				obj['classAlertIcon'] = 'msg label label-danger';
				obj['titleAlertIcon'] = 'Cartão expirado';
				obj['classIcon'] = 'fa fa-warning';
			}
		}
		return obj;
	}

	callbackCol(obj: SiascCol, thiz: any): void {
		const novoTitular = thiz.titular.beneficiarios[1];
		novoTitular.tipo = 'Titular';
		novoTitular.beneficiarios = thiz.titular.beneficiarios;
		novoTitular.vinculoFuncional = thiz.titular.vinculoFuncional;
		novoTitular.endereco = thiz.titular.endereco;
		const novoDepe = thiz.titular;
		novoDepe.beneficiarios = [];
		novoDepe.tipo = 'Conjugue/Companheiro(a) Casal CAIXA - Direto';
		novoTitular.beneficiarios[0] = novoTitular;
		novoTitular.beneficiarios[1] = novoDepe;
		thiz.titular = novoTitular;
		thiz.atualizarDataList();
	}

}
