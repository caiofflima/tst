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

type TipoAcaoDePesquisa = TipoAcaoService<MedicamentoService, TipoAcaoDoService<AscSelectMedicamentoParam, Medicamento>>;

@Component({
  selector: 'asc-select-medicamento',
  templateUrl: './asc-select-medicamento.component.html',
  styleUrls: ['./asc-select-medicamento.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AscSelectMedicamentoComponent),
    multi: true,
  }],
})
export class AscSelectMedicamentoComponent extends BaseSelectControlValueAcessor<Medicamento, AscSelectMedicamentoParam, TipoAcaoDePesquisa> {

  @Input()
  selectId: string;

  constructor(
    protected override readonly messageService: MessageService,
    private readonly medicamentoService: MedicamentoService
  ) {
    super(messageService)
  }

  override definirServico(): (p: AscSelectMedicamentoParam) => Observable<Medicamento[]> {
    return (param: AscSelectMedicamentoParam) => {
      return this.medicamentoService.carregarPor(param.laboratorioId, param.idPatologia, this.innerValue);
    };
  }

  transformarObjetosParaSelectItems(medicamentos: Medicamento[]): SelectItem[] {
    return medicamentos.map(medicamento => ({
      value: medicamento.id,
      label: medicamento.nome
    }));
  }

}
