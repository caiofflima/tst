import { Component, Output, ViewChild, ElementRef, AfterViewInit, EventEmitter, Input } from '@angular/core';

import { BaseComponent } from 'app/shared/components/base.component';
import { MessageService } from 'app/shared/components/messages/message.service';
import { Beneficiario } from 'app/shared/models/comum/beneficiario';
import ModalUtil from 'app/shared/util/modal';
import {Util} from "../../../arquitetura/shared/util/util";

@Component({
	selector: 'app-beneficiario-detalhe',
	templateUrl: './dados-beneficiario.component.html',
	styleUrls: ['./dados-beneficiario.component.scss']
})

export class DadosBeneficiarioComponent extends BaseComponent implements AfterViewInit {

	modalId = 'modalBeneficiarioDetalhe';
	carregado = false;
	detalhes: any = [];
	detalhesPessoais: any = [];
	titulo: string;

	@Input('selecionado') selecionado: Beneficiario;

	constructor(
		protected override messageService: MessageService,
	) {
		super(messageService);
	}

	ngAfterViewInit() {
		ModalUtil.hiddenModal(this.modalId, () => {
			this.limpar();
		})
	}

	limpar() {
		this.selecionado = null;
		this.carregado = false;
	}

	getTitulo(): string {
		return this.titulo;
	}

	getTipoBeneficiario(): string {
		return this.selecionado ? this.selecionado.tipo : '';
	}

	getText(atributo: string): string {
		return atributo ? atributo : '__';
	}

	getDetalhes(): any[] {
		if (this.selecionado && !this.carregado) {
			this.titulo = this.selecionado.nome;

			this.detalhes = [
				{ titulo: 'Beneficiário Judicial', value: null },
				{ titulo: 'Cód. beneficiário', value: this.selecionado.codBeneficiario },
				{ titulo: 'Data cancelamento', value: this.selecionado.contrato.labelDtCancelamento },
				{ titulo: 'Motivo cancelamento', value: this.selecionado.contrato.motivoCancelamento },
				{ titulo: 'Cartão', value: this.selecionado.nuCartao },
				{ titulo: 'Data início', value: this.dateToString(this.selecionado.dtInicioCartao) },
				{ titulo: 'Data fim', value: this.dateToString(this.selecionado.dtFimCartao) },
				{ titulo: 'Cartão legado', value: null },
				{ titulo: 'Cartão legado anterior', value: null },
				{ titulo: 'Cartão Nacional de Saúde', value: this.selecionado.cns },
				{ titulo: 'Tipo de Deficiência', value: null },
				{ titulo: 'Declaração de Nascido Vivo', value: null },
				{ titulo: ' ', value: ' ' }
			];

			this.detalhesPessoais = [
				{ titulo: 'Data de nascimento', value: this.dateToString(this.selecionado.dtNascimento) },
				{ titulo: 'Idade', value: this.getIdade(this.selecionado.dtNascimento) },
				{ titulo: 'CPF', value: this.selecionado.cpf },
				{ titulo: 'Nome da mãe', value: this.selecionado.nomeMae },
				{ titulo: 'Nome do pai', value: this.selecionado.nomePai },
				{ titulo: 'Município Naturalidade', value: null },
				{ titulo: 'Número Documento de Identidade', value: null },
				{ titulo: 'Órgão Emissor', value: null },
				{ titulo: 'Data de expedição', value: null },
				{ titulo: 'Estado Civil', value: this.selecionado.estadoCivil },
				{ titulo: 'Sexo', value: this.selecionado.sexo },
				{ titulo: 'E-mail', value: this.selecionado.contato.email }
			];
			this.carregado = true;
		}
		return this.detalhes;
	}

	getDetalhesPessoais(): any[] {
		return this.detalhesPessoais;
	}

	getIdade(dtNascimento: Date): number {
		const dataAtual = new Date();
		const dt = Util.getDate(dtNascimento);
		const dataDiff = dataAtual.getTime() - dt.getTime();
		return Math.ceil(dataDiff / (1000 * 3600 * 24 * 365));
	}
}
