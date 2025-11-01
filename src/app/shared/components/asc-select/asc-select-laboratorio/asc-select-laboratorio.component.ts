import {Component, forwardRef, Input} from '@angular/core';
import {MessageService} from "../../messages/message.service";
import {BaseSelectControlValueAcessor} from "../models/base-select-control-value-acessor";
import {Laboratorio} from "../../../models/credenciados/laboratorio";
import {TipoAcaoService} from "../models/tipo-acao-service";
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {LaboratorioService} from "../../../services/comum/laboratorio.service";
import {SelectItem} from "primeng/api";
import {Observable} from "rxjs";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {isNotUndefinedNullOrEmpty} from "../../../constantes";
import {Patologia} from "../../../models/entidades";

type TipoAcaoDePesquisa = TipoAcaoService<LaboratorioService, TipoAcaoDoService<Patologia, Laboratorio>>;

@Component({
  selector: 'asc-select-laboratorio',
  templateUrl: './asc-select-laboratorio.component.html',
  styleUrls: ['./asc-select-laboratorio.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AscSelectLaboratorioComponent),
    multi: true,
  }],
})
export class AscSelectLaboratorioComponent extends BaseSelectControlValueAcessor<Laboratorio, Patologia, TipoAcaoDePesquisa> {

  @Input()
  selectId: string;

  constructor(
    protected override readonly messageService: MessageService,
    private readonly laboratorioService: LaboratorioService
  ) {
    super(messageService)
  }

  override definirServico(): (patologia: Patologia) => Observable<Laboratorio[]> {
    return (patologia: Patologia) => {
      const idPatologia = patologia ? patologia.id : null;
      return this.laboratorioService.carregarPorPatologia(idPatologia);
    };
  }

  transformarObjetosParaSelectItems(laboratorios: Laboratorio[]): SelectItem[] {
    return laboratorios.map(laboratorio => ({ value: laboratorio.id, label: laboratorio.nome }));
  }

}
