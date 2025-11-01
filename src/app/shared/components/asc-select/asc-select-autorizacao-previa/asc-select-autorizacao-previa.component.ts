import {Component, forwardRef, Input} from '@angular/core';
import {isNotUndefinedNullOrEmpty} from '../../../constantes';
import {Pedido} from '../../../models/entidades';
import {AutorizacaoPreviaService, MessageService} from '../../../services/services';
import {TipoAcaoService} from '../models/tipo-acao-service';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseSelectControlValueAcessor} from '../models/base-select-control-value-acessor';
import {AscSelectAutorizacaoPreviaParams} from "../models/asc-select-autorizacao-previa-params";
import {TipoAcaoDoService} from "../models/tipo-acao-do-service";
import {SelectItem} from "primeng/api";
import {Observable} from "rxjs";
import {of} from "rxjs";
import { tap } from 'rxjs/operators';

type TipoAcaoDePesquisa = TipoAcaoService<AutorizacaoPreviaService, TipoAcaoDoService<AscSelectAutorizacaoPreviaParams, Pedido>>;

@Component({
  selector: 'asc-select-autorizacao-previa',
  templateUrl: './asc-select-autorizacao-previa.component.html',
  styleUrls: ['./asc-select-autorizacao-previa.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AscSelectAutorizacaoPreviaComponent),
    multi: true,
  }],
})
export class AscSelectAutorizacaoPreviaComponent extends BaseSelectControlValueAcessor<Pedido, AscSelectAutorizacaoPreviaParams, TipoAcaoDePesquisa> {

  @Input()
  selectId: string;

  constructor(
    private readonly autorizacaoPreviaService: AutorizacaoPreviaService,
    protected override readonly messageService: MessageService,
  ) {
    super(messageService);
    this.escutaAutorizacaoPrevia()
  }
  
  override definirServico(): (p: AscSelectAutorizacaoPreviaParams) => Observable<Pedido[]> {
    return (params: AscSelectAutorizacaoPreviaParams) => {
      if (params.executaConsulta || (params.idBeneficiario && params.idProcedimento)) {
        return this.autorizacaoPreviaService
          .consultarPorIdBeneficiarioAndIdProcedimento(params.idBeneficiario, params.idProcedimento);
      }
      return of([]);
    };
  }

  override filtrarPor(param: AscSelectAutorizacaoPreviaParams): boolean {
    return isNotUndefinedNullOrEmpty(param);
  }

  transformarObjetosParaSelectItems(pedidos: Pedido[]): SelectItem[] {
    return pedidos.map(pedido => ({
      value: pedido.id,
      label: this.montarLabelAutorizacaoPrevia(pedido)
    }))
  }

  montarLabelAutorizacaoPrevia(pedido: Pedido){
    let label:string  = pedido.id.toString();
    let listaNome = pedido.tipoProcesso.nome.split(" ");
    label += " - "+ listaNome[listaNome.length-1];

    if(pedido.idAutorizacaoPreviaSiags != null 
        && pedido.idAutorizacaoPreviaSiags.toString().length > 0){
      label += " - ("+pedido.idAutorizacaoPreviaSiags+")";
    }

    label  += " - "+ pedido.nomeMotivoSolicitacao;
    return label;
  }

  escutaAutorizacaoPrevia(){
    this.autorizacaoPreviaService
        .escutaAutorizacaoPrevia
        .pipe(
          tap( params => this.parametros = params)
        ).subscribe()
  }
}
