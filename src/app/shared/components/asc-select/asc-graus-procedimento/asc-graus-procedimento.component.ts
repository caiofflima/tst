import {Component, forwardRef, Input} from '@angular/core';
import {BaseSelectControlValueAcessor} from '../models/base-select-control-value-acessor';
import {GrauProcedimento} from '../../../models/comum/grau-procedimento';
import {AscSelectGrausProcedimentoParams} from '../models/asc-select-graus-procedimento.params';
import {GrauProcedimentoService} from '../../../services/comum/grau-procedimento.service';
import {SelectItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNotUndefinedNullOrEmpty} from '../../../constantes';
import {of} from 'rxjs';
import {MessageService} from "../../messages/message.service";

@Component({
  selector: 'asc-graus-procedimento',
  templateUrl: './asc-graus-procedimento.component.html',
  styleUrls: ['./asc-graus-procedimento.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AscGrausProcedimentoComponent),
    multi: true,
  }],
})
export class AscGrausProcedimentoComponent extends BaseSelectControlValueAcessor<GrauProcedimento, AscSelectGrausProcedimentoParams, Object> {

  @Input()
  selectId: string;

  constructor(
    private readonly grausProcedimentoService: GrauProcedimentoService,
    protected override readonly messageService: MessageService,
  ) {
    super(messageService);
  }

  override definirServico(): (params: AscSelectGrausProcedimentoParams) => Observable<GrauProcedimento[]> {
    return (params: AscSelectGrausProcedimentoParams) => {
      if (isNotUndefinedNullOrEmpty(params) && isNotUndefinedNullOrEmpty(params.idProcedimento)) {
        return this.grausProcedimentoService.consultarPorProcedimento(params.idProcedimento) as Observable<GrauProcedimento[]>;
      }
      return of([]);
    };
  }

  override filtrarPor(param: AscSelectGrausProcedimentoParams): boolean {
    return isNotUndefinedNullOrEmpty(param);
  }

  transformarObjetosParaSelectItems(grausProcedimentos: GrauProcedimento[]): SelectItem[] {
    if (isNotUndefinedNullOrEmpty(grausProcedimentos)) {
      return grausProcedimentos.map(grauProcedimento => ({
        label: grauProcedimento.nome,
        value: grauProcedimento.id,
        filtering: `${grauProcedimento.id} ${grauProcedimento.nome}`,
      })) as SelectItem[];
    }
    return []
  }

}
