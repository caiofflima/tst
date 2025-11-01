import {Pipe, PipeTransform} from '@angular/core';

import {Pedido} from '../models/entidades';

@Pipe({name: 'autorizacaoPreviaPedido'})
export class AutorizacaoPreviaPedidoPipe implements PipeTransform {
  transform(value: Pedido, ...args: any[]) {
    if (value) {
      if (value.tipoProcesso) {
        return `${value.id} - ${value.tipoProcesso.nome} | ${value.nomeMotivoSolicitacao}`;
      } else if (value.nomeMotivoSolicitacao) {
        if( value.nomeMotivoSolicitacao.includes('WEB') ){
          const textoAutorizacaoPrevia = value.nomeMotivoSolicitacao.split('|')
          const preparaNome = `<strong>${textoAutorizacaoPrevia[0].trim()}</strong> | ${textoAutorizacaoPrevia[1].trim()}`
          return preparaNome
        }
        else  
          return `${value.id} - ${value.nomeMotivoSolicitacao}`;
      }
    }

    return '—';
  }
}
