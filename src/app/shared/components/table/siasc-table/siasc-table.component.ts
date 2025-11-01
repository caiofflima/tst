import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginationInstance} from 'ngx-pagination';

import {BaseComponent} from '../../base.component';
import {MessageService} from '../../messages/message.service';
import {Util} from '../../../../../app/arquitetura/shared/util/util';
import {SiascTable} from '../../../../../app/shared/models/siasc-table/siasc-table';
import {SiascTableCreator} from '../../../../../app/shared/models/siasc-table/siasc-table-creator';
import {SiascCol} from '../../../../../app/shared/models/siasc-table/siasc-col';
import {SiascRow} from '../../../../../app/shared/models/siasc-table/siasc-row';

@Component({
  selector: 'app-siasc-table',
  templateUrl: './siasc-table.component.html',
  styleUrls: ['./siasc-table.component.css']
})
export class SiascTableComponent extends BaseComponent {

  @Input('dataList') dataList: SiascTable;
  @Output() emitEdit = new EventEmitter();
  @Output() emitDelete = new EventEmitter();
  @Output() emitDetail = new EventEmitter();
  @Output() emitSelect = new EventEmitter();
  @Output() emitPdf = new EventEmitter();
  @Output() emitEmail = new EventEmitter();

  hintEdit = 'Alterar';
  hintDelete = 'Excluir';
  hintDetail = 'Detalhar';
  hintSelect = 'Selecionar';
  hintPdf = 'Emitir declaração de permanência';
  hintEmail = 'Enviar cartão de identificação';
  mgnDelete = 'Deseja realmente excluir?';
  idTableDefault = 'idTableDefault';

  constructor(
    protected override messageService: MessageService,
  ) {
    super(messageService);
    this.dataList = new SiascTableCreator().newDefaultSiascTable('defaultTable', [], [], null, null, []);
  }

  public edit(objectRow: any): void {
    this.emitEdit.emit(this.getClone(objectRow));
  }

  public delete(objectRow: any): void {
    this.messageService.addConfirmYesNo(this.mgnDelete, () => {
      this.emitDelete.emit(this.getClone(objectRow));
    }, null, null, 'Sim', 'Não');
  }

  public detail(objectRow: any): void {
    this.emitDetail.emit(this.getClone(objectRow));
  }

  public email(objectRow: any): void {
    this.emitEmail.emit(this.getClone(objectRow));
  }

  public pdf(objectRow: any): void {
    this.emitPdf.emit(this.getClone(objectRow));
  }

  public select(objectRow: any, idModal: string): void {
    this.emitSelect.emit(this.getClone(objectRow));
    this.hideModal(idModal);
  }

  // Validações para não estourar a tela
  idTable(): string {
    return this.dataList ? (this.dataList.id ? this.dataList.id : this.idTableDefault) : this.idTableDefault;
  }

  callbackCol(col: SiascCol): void {
    if (col && col.callback) {
      col.callback(col, col.thiz);
    }
  }

  showAlertIcon(col: SiascCol): boolean {
    return col ? col.showAlertIcon : false;
  }

  classAlertIcon(col: SiascCol): string {
    return col ? (col.classAlerIcon ? col.classAlerIcon : '') : '';
  }

  classIcon(col: SiascCol): string {
    return col ? (col.classIcon ? col.classIcon : '') : '';
  }

  titleAlertIcon(col: SiascCol): string {
    return col ? (col.titleAlertIcon ? col.titleAlertIcon : '') : '';
  }

  textAlert(col: SiascCol): boolean {
    return col ? (!!col.textAlert) : false;
  }

  disabledEmail(row: SiascRow): boolean {
    return row ? (row.disabledEmail ? row.disabledEmail : false) : row.disabledEmail;
  }

  title(): string {
    return this.dataList ? (!Util.isEmpty(this.dataList.title) ? this.dataList.title : '') : '';
  }

  headers(): SiascCol[] {
    return this.dataList ? (this.dataList.headers ? this.dataList.headers : []) : [];
  }

  rows(): SiascRow[] {
    return this.dataList ? (this.dataList.rows ? this.dataList.rows : []) : [];
  }

  numberItems(): number {
    if (!this.showPaginationList()) {
      return this.listObject().length;
    }
    return this.dataList ? (this.dataList.numberItems ? this.dataList.numberItems : 5) : 5;
  }

  numberPage(): number {
    return this.dataList ? (this.dataList.numberPage ? this.dataList.numberPage : 1) : 1;
  }

  fieldId(field: string): string {
    return this.idTable() + '_' + field;
  }

  rowClass(row: SiascRow): string {
    return row ? (row.showHover ? 'bg-row ' + row.clazz : row.clazz) : row.clazz;
  }

  showTitle(): boolean {
    return this.dataList ? !Util.isEmpty(this.dataList.title) : false;
  }

  showAction(row: SiascRow): boolean {
    return row ? (row.showEdit || row.showDelete || row.showDetail || row.showSelect || row.showEmail || row.showPdf) : false;
  }

  showEdit(row: SiascRow): boolean {
    return row ? row.showEdit : false;
  }

  showDelete(row: SiascRow): boolean {
    return row ? row.showDelete : false;
  }

  showDetail(row: SiascRow): boolean {
    return row ? row.showDetail : false;
  }

  showEmail(row: SiascRow): boolean {
    return row ? row.showEmail : false;
  }

  showPdf(row: SiascRow): boolean {
    return row ? row.showPdf : false;
  }

  showSelect(row: SiascRow): boolean {
    return row ? row.showSelect : false;
  }

  showLinkModal(row: SiascRow): boolean {
    return row ? !Util.isEmpty(row.idModal) : false;
  }

  showPagination(): boolean {
    return this.showPaginationList() && this.showPaginacao(this.listObject());
  }

  showPaginationList(): boolean {
    return this.dataList ? this.dataList.showPagination : false;
  }

  getIdModal(row: SiascRow): string {
    return row ? '#' + row.idModal : '';
  }

  getIdModalEmail(row: SiascRow): string {
    return row ? '#' + row.idModalEmail : '';
  }

  getIdPagination(): string {
    return this.idField(['pagination', this.idTable()]);
  }

  listObject(): any[] {
    return this.dataList ? (this.dataList.listObject ? this.dataList.listObject : []) : [];
  }

  style(col: any): any {
    return col ? col.style : '';
  }

  configPagination(): PaginationInstance {
    return {
      id: this.getIdPagination(),
      currentPage: this.numberPage(),
      itemsPerPage: this.numberItems()
    };
  }


  handleSelectElemChange(evento:Event){
    const valor = +(evento.target as HTMLSelectElement).value
    this.dataList.numberItems = valor

  }
}
