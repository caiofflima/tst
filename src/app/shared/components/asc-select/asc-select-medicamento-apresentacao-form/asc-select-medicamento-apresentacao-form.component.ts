import {Component, forwardRef, Input} from '@angular/core';
import {MessageService} from "../../messages/message.service";
import {BaseSelectControlValueAcessor} from "../models/base-select-control-value-acessor";
import {TipoAcaoService} from "../models/tipo-acao-service";
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {SelectItem} from "primeng/api";
import {Observable} from "rxjs";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {isNotUndefinedNullOrEmpty} from "../../../constantes";
import {Medicamento} from "../../../models/comum/medicamento";
import {AscSelectMedicamentoParam} from "../models/asc-select-medicamento.param";
import {MedicamentoService} from "../../../services/comum/pedido/medicamento.service";
import {debounceTime} from "rxjs/operators";

type TipoAcaoDePesquisa = TipoAcaoService<MedicamentoService, TipoAcaoDoService<AscSelectMedicamentoParam, Medicamento>>;

@Component({
  selector: 'asc-select-medicamento-apresentacao-form',
  templateUrl: './asc-select-medicamento-apresentacao-form.component.html',
  styleUrls: ['./asc-select-medicamento-apresentacao-form.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AscSelectMedicamentoApresentacaoFormComponent),
    multi: true,
  }],
})
export class AscSelectMedicamentoApresentacaoFormComponent extends BaseSelectControlValueAcessor<Medicamento, AscSelectMedicamentoParam, TipoAcaoDePesquisa> {

  @Input()
  selectId: string;

  override updateValue(value: any) {
    const normalizedValue = value && typeof value === 'object' && 'value' in value
      ? (value as any).value
      : value;
    super.updateValue(normalizedValue);
  }

  constructor(
    protected override readonly messageService: MessageService,
    private readonly medicamentoService: MedicamentoService
  ) {
    super(messageService)
  }

  override definirServico(): (p: AscSelectMedicamentoParam) => Observable<Medicamento[]> {
    return (param: AscSelectMedicamentoParam) => {
      return this.medicamentoService.carregarApresentacao(param.medicamentoId, param.idPatologia).pipe(debounceTime(200));
    };
  }

  override filtrarPor(param: AscSelectMedicamentoParam): boolean {
    return isNotUndefinedNullOrEmpty(param) && isNotUndefinedNullOrEmpty(param.medicamentoId);
  }

  transformarObjetosParaSelectItems(medicamentos: Medicamento[]): SelectItem[] {
    return medicamentos.map(medicamento => ({
      value: medicamento.id,
      label: medicamento.descricaoApresentacao
    }));
  }

  protected override predicateToFindItemSelected(): (data: Medicamento) => boolean {
    return (data) => this.innerValue === data.id
  }
}

