import { SiascCol } from './siasc-col';
import { SiascRow } from './siasc-row';
import { SiascTable } from './siasc-table';

export class SiascTableCreator<T> {

	// INICIO - Funções para geração da tabela
	/**
	 * adiciona o header da coluna
	 * @param id string
	 * @param text string
	 * @param width number
	 * @param clazz any
	 * @param style any
	 */
	public addHeader(id: string, text: string, width: number, clazz: any, style: any): SiascCol {
		return this.newSiascHeader(id, text, width, clazz, style);
	}

	/**
	 * adiciona coluna normal
	 * @param idTable string
	 * @param index number
	 * @param idCol string
	 * @param text any
	 * @param clazz any
	 * @param style any
	 * @param object any
	 */
	public addCol(idTable: string, index: number, idCol: string, text: any, clazz: any, style: any, object: any) {
		return this.newDefaultSiascCol(this.getIdColTable(idTable, index, idCol), text, clazz, style, object);
	}

	/**
	 * Adiciona uma coluna que permite a execução de uma ação passada por parâmetro como callback
	 * @param idTable string
	 * @param index number
	 * @param idCol string
	 * @param text any
	 * @param clazz any
	 * @param style any
	 * @param object any
	 * @param callback (object?: SiascCol, thiz?: any) => void
	 * @param thiz this
	 */
	public addColFunction(idTable: string, index: number, idCol: string, text: any, clazz: any, style: any,
			object: any, callback: (object?: SiascCol, thiz?: any) => void, thiz?: any) {
		return this.newSiascColFunction(this.getIdColTable(idTable, index, idCol), text, clazz, style, object, callback, thiz);
	}

	/**
	 * Adiciona uma coluna que possibilita a exibição de um sinalizador na frente do dado exibido.
	 * O sinalizador pode receber como parâmetro um texto, uma classe Css para o fundo, um Title e um glyphicon
	 * @param idTable string
	 * @param index number
	 * @param idCol string
	 * @param text any
	 * @param clazz any
	 * @param style any
	 * @param object any
	 * @param showAlertIcon boolean
	 * @param textAlert string
	 * @param classAlertIcon string
	 * @param classIcon string
	 * @param titleAlertIcon string
	 */
	public addColAlertIcon(idTable: string, index: number, idCol: string, text: any, clazz: any, style: any,
			object: any, showAlertIcon: boolean, textAlert?: string, classAlertIcon?: string, classIcon?: string,
			titleAlertIcon?: string) {

		return this.newSiascColAlertIcon(this.getIdColTable(idTable, index, idCol), text, clazz, style, object,
			showAlertIcon, textAlert, classAlertIcon, classIcon, titleAlertIcon);
	}

	/**
	 * Adiciona uma linha na talela com os botões de 'Editar' e 'Excluir' embutidos
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param object any
	 */
	public addRow(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, object: any) {
		return this.newDefaultSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, object);
	}

	/**
	 * Adiciona uma linha com os botões 'Exibir dados em modal', 'Gerar Pdf' e 'Enviar e-mail' embutidos
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param idModalEmail string
	 * @param idModal string
	 * @param object any
	 * @param disabledEmail boolean
	 */
	public addRowDetailPdfEmail(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, idModalEmail: string,
			idModal: string, object: any, disabledEmail: boolean) {
		return this.newSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, false, false, null, false,
			false, null, null, disabledEmail, idModalEmail, idModal, object);
	}

	/**
	 * Adiciona linha sem botões de ação
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param object any
	 */
	public addRowNone(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, object: any) {
		return this.newSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, false, false, false, false,
			false, false, false, null, null, null, object);
	}

	/**
	 * Adiciona linha com os botões 'Editar', 'Excluir' e 'Exibir dados' embutidos. O botão 'Exibir dados não chama modal
	  * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param object any
	 */
	public addRowAllCrud(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, object: any) {
		return this.newDefaultAllSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, object);
	}

	/**
	 * Adiciona linha com os botões 'Editar', 'Excluir' e 'Exibir dados' embutidos. O botão 'Exibir dados' chama modal cujo ID
	 * for passado como parâmetro
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param idModal string
	 * @param object any
	 */
	public addRowAllCrudModal(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newDefaultAllSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, object, idModal);
	}

	/**
	 * Adiciona linha com o botão 'Exibir dados' embutido. Caso queira exibir os dados em uma modal, passar Id da modal como parâmetro
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param idModal string
	 * @param object any
	 */
	public addRowDetail(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, object: any, idModal?: string) {
		return this.newDefaultDetailSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, object, idModal);
	}

	/**
	 * Adiciona linha com od botões 'Exibir dados' e 'Selecionar' embutidos.
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param idModal string
	 * @param object any
	 */
	public addRowDetailSelectModal(idTable: string, index: number, coluns: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newDefaultDetailSelectSiascRow(this.getIdRowTable(idTable, index), coluns, clazz, style, idModal, object);
	}

	/**
	 * Adiciona linha com o botão 'Selecionar' embutido.
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param idModal string
	 * @param object any
	 */
	public addRowSelect(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newDefaultSelectSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, idModal, object);
	}

	/**
	 * Adiciona linha com o botão 'Excluir' embutido.
	 * @param idTable string
	 * @param index number
	 * @param cols SiascCol[]
	 * @param clazz any
	 * @param style any
	 * @param object any
	 */
	public addRowDelete(idTable: string, index: number, cols: SiascCol[], clazz: any, style: any, object: any) {
		return this.newDefaultDeleteSiascRow(this.getIdRowTable(idTable, index), cols, clazz, style, object);
	}

	/**
	 * Função para criar tabela sem Título e com paginação
	 * @param id string
	 * @param headers SiascCol[]
	 * @param rows  SiascRow[]
	 * @param clazz any
	 * @param style any
	 * @param listObject any[]
	 */
	public newDefaultSiascTable(id: string, headers: SiascCol[], rows: SiascRow[], clazz: any, style: any,
		listObject: any[]): SiascTable {
		return this.newSiascTable(id, null, headers, rows, clazz, style, null, null, null, null, listObject);
	}

	/**
	 * Função para criar tabela sem paginação e sem Título
	 * @param id string
	 * @param headers SiascCol[]
	 * @param rows  SiascRow[]
	 * @param clazz any
	 * @param style any
	 * @param listObject any[]
	 */
	public newSiascTableNoPagination(id: string, headers: SiascCol[], rows: SiascRow[], clazz: any, style: any,
		listObject: any[]): SiascTable {
		return this.newSiascTable(id, null, headers, rows, clazz, style, false, null, null, null, listObject);
	}

	/**
	 * Função para criar tabela com paginação e com Título
	 * @param id string
	 * @param title string
	 * @param headers SiascCol[]
	 * @param rows  SiascRow[]
	 * @param clazz any
	 * @param style any
	 * @param listObject any[]
	 */
	public newSiascTableTitle(id: string, title: string, headers: SiascCol[], rows: SiascRow[], clazz: any, style: any,
		listObject: any[]): SiascTable {
		return this.newSiascTable(id, title, headers, rows, clazz, style, null, null, null, null, listObject);
	}


	// Fim dos métodos públicos para geração da tabela

	private newSiascHeader(id: string, text: string, width: number, clazz: any, style: any): SiascCol {
		return this.newSiascCol(id, text, width, clazz, style, null, false);
	}

	private newDefaultSiascCol(id: string, text: string, clazz: any, style: any, object: any): SiascCol {
		return this.newSiascCol(id, text, null, clazz, style, object, false);
	}

	private newSiascColFunction(id: string, text: string, clazz: any, style: any, object: any,
		callback: (object?: SiascCol, thiz?: any) => void, thiz?: any): SiascCol {
		return this.newSiascCol(id, text, null, clazz, style, object, false, callback, thiz);
	}

	private newSiascColAlertIcon(id: string, text: string, clazz: any, style: any, object: any, showAlertIcon: boolean,
		textAlert?: string, classAlertIcon?: string, classIcon?: string, titleAlertIcon?: string): SiascCol {
		return this.newSiascCol(id, text, null, clazz, style, object, showAlertIcon, null, null, classAlertIcon,
			titleAlertIcon, textAlert, classIcon);
	}

	private newSiascCol(id: string, text: string, width: number, clazz: any, style: any, object: any, showAlertIcon: boolean,
			callback?: (object?: SiascCol, thiz?: any) => void, thiz?: any, classAlertIcon?: string,
			titleAlertIcon?: string, textAlert?: string, classIcon?: string): SiascCol {

		width = !width ? 100 : width;
		clazz = clazz === null ? '' : clazz;
		style = style === null ? '' : style;
		text = text + '';
		showAlertIcon = showAlertIcon === null ? true : false;

		return new SiascCol(id, text, width, clazz, style, object, showAlertIcon, textAlert, classAlertIcon,
			classIcon, titleAlertIcon, callback, thiz);
	}

	private newDefaultSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, object: any) {
		return this.newSiascRow(id, coluns, clazz, style, null, null, false, false, null, false, false, null, null, null, object);
	}

	private newDefaultDetailSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newSiascRow(id, coluns, clazz, style, false, false, null, false, null, false, false, null, null, idModal, object);
	}

	private newDefaultDetailSelectSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newSiascRow(id, coluns, clazz, style, false, false, null, null, null, false, false, null, null, idModal, object);
	}

	private newDefaultSelectSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, idModal: string, object: any) {
		return this.newSiascRow(id, coluns, clazz, style, false, false, false, null, null, false, false, null, null, idModal, object);
	}

	private newDefaultDeleteSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, object: any) {
		return this.newSiascRow(id, coluns, clazz, style, false, null, false, false, null, false, false, null, null, null, object);
	}

	private newDefaultAllSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, object: any, idModal?: string) {
		return this.newSiascRow(id, coluns, clazz, style, null, null, null, false, null, false, false, null, null, idModal, object);
	}

	private newSiascRow(id: string, coluns: SiascCol[], clazz: any, style: any, showEdit: boolean,
			showDelete: boolean, showDetail: boolean, showSelect: boolean, showHover: boolean, showPdf: boolean,
			showEmail: boolean, disabledEmail: boolean, idModalEmail: string, idModal: string, object: any) {

		showEdit = showEdit === null ? true : showEdit;
		showDelete = showDelete === null ? true : showDelete;
		showDetail = showDetail === null ? true : showDetail;
		showSelect = showSelect === null ? true : showSelect;
		showHover = showHover === null ? true : showHover;
		showEmail = showEmail === null ? true : showEmail;
		showPdf = showPdf === null ? true : showSelect;
		clazz = clazz === null ? '' : clazz;
		style = style === null ? '' : style;

		return new SiascRow(id, coluns, clazz, style, showEdit, showDelete, showDetail, showSelect, showHover,
			showPdf, showEmail, disabledEmail, idModalEmail, idModal, object);
	}

	private newSiascTable(id: string, title: string, headers: SiascCol[], rows: SiascRow[], clazz: any, style: any, showPagination: boolean,
		numberPage: number, numberItems: number, total: number, listObject: any[]): SiascTable {
		numberPage = !numberPage ? 1 : numberPage;
		numberItems = !numberItems ? 5 : numberItems;
		total = !total ? listObject.length : total;
		clazz = clazz === null ? '' : clazz;
		style = style === null ? '' : style;
		showPagination = showPagination === null ? true : showPagination;
		return new SiascTable(id, title, headers, rows, clazz, style, showPagination, numberPage, numberItems, total, listObject);
	}

	private getIdRowTable(idTable: string, index: number): string {
		return idTable + '_row_' + index;
	}

	private getIdColTable(idTable: string, index: number, idCol: string): string {
		return this.getIdRowTable(idTable, index) + '_col_' + idCol;
	}
	// FIM - Funções para geração da tabela

}
