import {Pipe, PipeTransform} from '@angular/core';

import {MessageResource} from './message-resource';
import {MessageResourceProvider} from './message-resource-provider';

/**
 * Classe 'Pipe' para prover o recurso de 'i18n'.
 */
@Pipe({
  name: 'i18n'
})
export class InternacionalizacaoPipe implements PipeTransform {
  private messageResource: MessageResource;

  /**
   * Construtor da classe.
   *
   * @param messageResource o provedor do recurso.
   */
  constructor(messageResource: MessageResourceProvider) {
    this.messageResource = new messageResource();
  }

  /**
   * Retorna a descrição conforme a chave informada.
   *
   * @param chave
   * @param params
   */
  transform(chave: string, params: any = undefined): string {
    let description = this.messageResource.getDescription(chave);

    if (description !== undefined && params !== undefined) {
      if (typeof params === 'string') {
        description = description.replace(new RegExp('\\{0}', 'g'), params);
      } else {
        for (let index = 0; index < params.length; index++) {
          description = description.replace(new RegExp('\\{' + index + '\\}', 'g'), params[index]);
        }
      }
    }
    return description;
  }
}
