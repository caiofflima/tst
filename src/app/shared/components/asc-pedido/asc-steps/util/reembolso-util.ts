import { TipoProcesso } from "../../../../models/comum/tipo-processo";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { TipoProcessoEnum } from "../../models/tipo-processo.enum";

export class ReembolsoUtil {

  private constructor() {
    throw new Error('Class cannot be instantiate')
  }

  private static regraParaDesabilitarQuandoForTipoProcessoEspefico(idTipoProcesso: number): boolean {
    if (idTipoProcesso) {
      const existeAlgumReembolso = [
        TipoProcessoEnum.REEMBOLSO_MEDICAMENTO
      ]
        .some(idTipoProcessoToCompare => idTipoProcessoToCompare === idTipoProcesso);
      return !existeAlgumReembolso
    }
    return null;


  }

  static disableStepProfessionalWhen(tipoProcesso$: Observable<TipoProcesso>): Observable<boolean> {
    return tipoProcesso$.pipe(
      distinctUntilChanged(),
      debounceTime(200),
      map((tipoProcesso: TipoProcesso) => {
        if (tipoProcesso) {
          return tipoProcesso.id
        }
        return null
      }),
      map(ReembolsoUtil.regraParaDesabilitarQuandoForTipoProcessoEspefico)
    );
  }
}
