import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-datalist',
	templateUrl: './datalist.component.html',
	styleUrls: ['./datalist.component.scss']
})
export class DatalistComponent {
	@Input() titulo = 'Lista';
	@Input() tituloSelecionados = 'Selecionados';
	@Input() idList = 'datalist';
	@Input() mensagemErro: string;

	/**
	 * Flags para colocar o required na classe dos labels e aprersentar mensagem de erro
	 * @type {boolean}
	 */
	@Input() required = false;

	private _itens: any[] = [];
	private _selecionados: any[] = [];
	private _itensOriginais: any[] = [];
	public itensSelecionados: any[] = [];
	public validator = false;

	get itens(): any[] {
		return this._itens
	}

	// Itens da lista
	@Input()
	set itens(itens: any[]) {
		const me = this;
		this._itens = itens;
		if (itens) {
			itens.forEach(function (item) {
				me._itensOriginais.push(item);
			});
		}
	}

	get selecionados(): any[] {
		return this._selecionados
	}

	@Input()
	set selecionados(itens: any[]) {
		this._selecionados = itens;
		this.itensSelecionados = this._selecionados;
		this.validator = !this._selecionados;

		if (this._selecionados && this._itens) {
			this.removerItensSelecionados(this._selecionados, this._itens);
		}
	}

	private removerItensSelecionados(selecionados: any[], todosItens: any[]) {
		selecionados.forEach(itemSelecionado => {
			const itemLocal = this.normalizarId(itemSelecionado);
			todosItens.forEach(naoSelecionado => {
				const itemNaoSelecionado = this.normalizarId(naoSelecionado);
				this.removerItem(itemNaoSelecionado, itemLocal, todosItens);
			});
		});
	}

	private normalizarId(item: any) {
		if (typeof item.id === 'string') {
			item.id = parseInt(item.id, 10);
		}
		return item;
	}

	private removerItem(naoSelecionado: any, itemSelecionado: any, todosItens: any[]) {
		if (naoSelecionado.id === itemSelecionado.id) {
			const index = todosItens.indexOf(naoSelecionado);
			if (index >= 0) {
				todosItens.splice(index, 1);
			}
		}
	}

	getId() {
		return this.idList;
	}

	/**
	 * Adiciona um item na lista de selecionados
	 * @param item
	 */
	adicionarSelecionado(item: any) {
		let indexSelecionado: number;
		const me = this;

		if (!this.itensSelecionados) {
			this.itensSelecionados = [];
		}

		// Adiciona no array de selecionados
		this.itensSelecionados.push(item);

		this.itens.some((value, index) => {
			// verifica a posição do item atual
			if (item.id === value.id) {
				// remove do array de itens
				indexSelecionado = index;
				me.itens.splice(index, 1);

				/**
				 * Ordenação em ASC dos itens selecinados.
				 * Thiago Mariano <thiagodamasceno@castgroup.com.br>
				 * Data 22/09/2017
				 */
				this.itensSelecionados.sort((a, b) => {
					if (a.nome < b.nome) {
						return -1;
					}
					if (a.nome > b.nome) {
						return 1;
					}
					return 0;
				});

				return true;
			}else {return false}
		});
		// Valida se há itens selecionados
		this.validator = !this.itensSelecionados.length;
	}

	retirarSelecionado(item: any) {
		let indexSelecionado: number;
		const me = this;

		// adiciona no inicio do array
		this._itens.unshift(item);
		this.itensSelecionados.some((value, index) => {

			/**
			 * Ordenação em ASC dos itens selecinados.
			 * Thiago Mariano <thiagodamasceno@castgroup.com.br>
			 * Data 22/09/2017
			 */
			this.itens.sort((a, b) => {
				if (a.nome < b.nome) {
					return -1;
				}
				if (a.nome > b.nome) {
					return 1;
				}
				return 0;
			});

			// verifica a posição do item atual
			if (item.id === value.id) {
				// remove do array de itens
				indexSelecionado = index;
				me.itensSelecionados.splice(index, 1);
				return true;
			}else{return false}
		});
		// Valida se há itens selecionados
		this.validator = !this.itensSelecionados.length;
	}

	/**
	 * Retira todos os itens da seleção
	 */
	retirarTodos() {
		this.itensSelecionados = [];
		this._itens = this._itensOriginais.slice();
		// Valida se há itens selecionados
		this.validator = !this.itensSelecionados.length;
	}

	/**
	 * Seleciona todos os itens
	 */
	selecionarTodos() {
		this._itens = [];
		this.itensSelecionados = this._itensOriginais.slice();
		// Valida se há itens selecionados
		this.validator = !this.itensSelecionados.length;
	}

	getItensSelecionados() {
		return this.itensSelecionados;
	}
}
