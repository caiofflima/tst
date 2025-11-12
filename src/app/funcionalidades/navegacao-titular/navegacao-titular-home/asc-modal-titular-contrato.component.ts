import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import ModalUtil from 'app/shared/util/modal';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ContratoDTO } from '../../../shared/models/dto/contrato';

@Component({
  selector: 'asc-modal-titular-contrato',
  templateUrl: './asc-modal-titular-contrato.component.html',
  styleUrls: ['./asc-modal-titular-contrato.component.scss'],
  providers: [DatePipe]
})

export class AscModalTitularContratoComponent implements OnInit {

  @Input() idBase: string = 'navegacaoTitular';
  @Output() onConfirmar = new EventEmitter<string>();
  @Output() onFechar = new EventEmitter<void>();
  @Input() contratoSelecionado: string;

  _listaContratos: SelectItem[];
  _contratos: ContratoDTO[];

  @Input() set contratos(valor: ContratoDTO[]) {
    this._contratos = valor;
    this._listaContratos = valor.map(v =>
    ({
      value: v.familia,
      label: `${v.codigoBeneficiario} - ${v.dataCancelamento ?
        this.datePipe.transform(new Date(v.dataCancelamento), 'dd/MM/yyyy') : 'Vigente'}`
    }));
  };

  titularContratoForm: FormGroup = new FormGroup({
    contrato: new FormControl(null)
  });

  idModal: string;

  contrato: ContratoDTO;

  atendimento = false;

  constructor(
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.idModal = ModalUtil.idModal(this.idBase, 'titularContrato', []);
    this.changeDetector;
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  abrirModal(contratos: ContratoDTO[]) {
    this.contratos = contratos || [];
    ModalUtil.showModal(this.idModal);
  }

  fecharModal() {
    this._contratos = [];
    this._listaContratos = [];
    ModalUtil.hideModal(this.idModal);
    this.onFechar.emit();
  }

  confirmar() {
    if (this.titularContratoForm.valid) {
      const contratoControl = this.titularContratoForm.get('contrato');
      const contratoSelecionado = contratoControl ? contratoControl.value : null;
      this.onConfirmar.emit(contratoSelecionado);
      this.fecharModal();
    }
  }

  getContratos(): ContratoDTO[] {
    return this.contratos;
  }

  get matricula(): string {
    return this.contratoSelecionado;
  }

  habilitarBtnConfirmar(): boolean {
    return this.titularContratoForm.get('contrato').value !== null ? false : true;
  }

}
